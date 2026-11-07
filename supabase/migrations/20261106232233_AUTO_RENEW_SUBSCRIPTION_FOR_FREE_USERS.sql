create or replace function public.get_or_renew_subscription(target_business_id uuid)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub public.subscriptions%rowtype;
  v_now timestamptz := clock_timestamp();
  v_new_start timestamptz;
  v_new_end timestamptz;
begin
  -- 1. عمل Lock على مستوى الصف (Row-Level Lock) لمنع أي Race Condition
  select * into v_sub
  from public.subscriptions
  where business_id = target_business_id
  for update;

  -- 2. لو المشترك غير موجود، إنشاؤه بحساب Free فوراً وبأمان
  if not found then
    insert into public.subscriptions (
      business_id, 
      plan_tier, 
      status, 
      current_period_start, 
      current_period_end
    )
    values (
      target_business_id, 
      'free', 
      'active', 
      v_now, 
      v_now + interval '30 days'
    )
    on conflict (business_id) do nothing
    returning * into v_sub;

    -- لو حدث سباق في الإدخال، اختر الصف المؤمن
    if v_sub.id is null then
      select * into v_sub
      from public.subscriptions
      where business_id = target_business_id
      for update;
    end if;

    -- إنشاء سجل الاستهلاك المبدئي بقيم صفرية
    insert into public.usage_cycles (
      business_id, 
      period_start, 
      period_end, 
      messages_count, 
      tokens_in, 
      tokens_out
    )
    values (
      target_business_id, 
      v_sub.current_period_start, 
      v_sub.current_period_end, 
      0, 
      0, 
      0
    )
    on conflict (business_id, period_start) do nothing;

    return v_sub;
  end if;

  -- 3. فحص انتهاء دورة الـ 30 يوم
  if v_sub.current_period_end < v_now then
    v_new_start := v_now;
    v_new_end := v_now + interval '30 days';

    -- تحديث التواريخ في subscriptions
    update public.subscriptions
    set 
      current_period_start = v_new_start,
      current_period_end = v_new_end,
      updated_at = v_now
    where id = v_sub.id
    returning * into v_sub;

    -- معالجة الـ usage_cycles في نفس الـ Transaction الذري:
    if v_sub.plan_tier = 'free' then
      -- للخطة المجانية: عمل Overwrite لنفس السجل القديم وتصفير العدادات
      update public.usage_cycles
      set 
        period_start = v_new_start,
        period_end = v_new_end,
        messages_count = 0,
        tokens_in = 0,
        tokens_out = 0
      where business_id = target_business_id;

      -- لو مكنش موجود من قبل، أنشئه
      if not found then
        insert into public.usage_cycles (
          business_id, 
          period_start, 
          period_end, 
          messages_count, 
          tokens_in, 
          tokens_out
        )
        values (
          target_business_id, 
          v_new_start, 
          v_new_end, 
          0, 
          0, 
          0
        )
        on conflict (business_id, period_start) do nothing;
      end if;
    else
      -- للخطط المدفوعة: إضافة صف تاريخي جديد لكل شهر
      insert into public.usage_cycles (
        business_id, 
        period_start, 
        period_end, 
        messages_count, 
        tokens_in, 
        tokens_out
      )
      values (
        target_business_id, 
        v_new_start, 
        v_new_end, 
        0, 
        0, 
        0
      )
      on conflict (business_id, period_start) do nothing;
    end if;
  end if;

  return v_sub;
end;
$$;


-- Security Policies
grant execute on function public.get_or_renew_subscription(uuid) to service_role;
revoke execute on function public.get_or_renew_subscription(uuid) from public, anon, authenticated;