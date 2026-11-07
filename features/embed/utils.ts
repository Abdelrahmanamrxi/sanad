// Perceptual brightness calculation
export function isDarkColor(hex: string): boolean {
  if (!hex || hex === "transparent") return false;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

export function getContrastTextColor(hex: string): string {
  return isDarkColor(hex) ? "#FFFFFF" : "#10201F";
}


// LocalStorage visitor UUID helper
export function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "";
  const STORAGE_KEY = "sanad_visitor_anon_id";
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}


export function getFriendlyErrorMessage(err: unknown, status?: number, isRtl = false): string {
  if (status === 429) {
    return isRtl
      ? "عذراً، استهلك المساعد رصيد المحادثات الشهري. يرجى التواصل مع إدارة المتجر مباشرة."
      : "This store assistant has reached its monthly message quota. Please contact store support.";
  }

  if (status === 401) {
    return isRtl
      ? "انتهت صلاحية جلسة المحادثة. يرجى إعادة المحاولة."
      : "Your chat session has expired. Please retry.";
  }

  if (status === 400) {
    return isRtl
      ? "تعذر إرسال الرسالة. يرجى التأكد من كتابة استفسارك والمحاولة مجدداً."
      : "Unable to send message. Please check your message and try again.";
  }

  if (status && status >= 500) {
    return isRtl
      ? "نواجه صعوبة مؤقتة في معالجة الرد. يرجى المحاولة بعد قليل."
      : "We're experiencing a temporary issue. Please try again shortly.";
  }

  if (err instanceof Error) {
    const raw = err.message.toLowerCase();
    if (
      raw.includes("failed to fetch") ||
      raw.includes("network") ||
      raw.includes("load failed") ||
      raw.includes("offline") ||
      err.name === "TypeError" ||
      err.name === "AbortError"
    ) {
      return isRtl
        ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً."
        : "Unable to connect to the server. Please check your internet connection and try again.";
    }

    if (
      err.message.includes("عذراً") ||
      err.message.includes("انتهت صلاحية") ||
      err.message.includes("تعذر") ||
      err.message.includes("نواجه صعوبة") ||
      err.message.includes("quota") ||
      err.message.includes("session")
    ) {
      return err.message;
    }
  }

  return isRtl
    ? "عذراً، حدث خطأ غير متوقع أثناء معالجة رسالتك. يرجى المحاولة مجدداً."
    : "Something went wrong while processing your response. Please try again.";
}

export function extractPath(urlStr?: string): string {
  if (!urlStr) return "/";

  try {
    // If it doesn't start with http/https, prefix it so new URL() doesn't throw
    const normalized = urlStr.startsWith("http") ? urlStr : `https://${urlStr}`;
    const parsed = new URL(normalized);
    
    // pathname gives you "/summary", "/checkout", etc.
    return parsed.pathname || "/";
  } catch {
    return "/";
  }
}

// Example:
// extractPath("https://store.com/summary") => "/summary"
// extractPath("store.com/products/item-1") => "/products/item-1"


export function isGreetingOrSmallTalk(msg: string): boolean {
  const cleaned = msg
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length === 0) return true;
  if (cleaned.length <= 3 && !msg.includes("?") && !msg.includes("؟"))
    return true;

  const smallTalkPatterns = [
    // English greetings, pleasantries & acknowledgments
    /^(hi|hello|hey|good (morning|evening|afternoon|day)|greetings|welcome|salam)( there)?$/i,
    /^(ezayk |3aml eh |aywa|tmm|eshta|mashy|khalas|fahman|shatoor|fol|habibi)?$/i,
    /^(thanks|thank you|thank you so much|many thanks|thx|ty|bye|goodbye|see you|take care|ok|okay|got it|cool|great|awesome)$/i,
    // Arabic greetings, pleasantries & acknowledgments
    /^(مرحبا|مرحباً|مرحب|أهلا|اهلا|أهلاً|اهلاً|أهليـن|اهلين|يا هلا|هلا|هاي|هلو)( (وسهلا|بيك|بك|يا غالي))?$/i,
    /^(السلام عليكم( ورحمة الله( وبركاته)?)?|سلام عليكم|وعليكم السلام)$/i,
    /^(صباح (الخير|النور|الورد)|مساء (الخير|النور|الورد))$/i,
    /^(شكرا|شكراً|مشكور|تسلم|يعطيك (العافيه|العافية)|جزاك الله خير|تمام|اوك|أوك|ماشي|حاضر|طيب|مع السلامة|باي)$/i,
  ];

  return smallTalkPatterns.some((pattern) => pattern.test(cleaned));
}