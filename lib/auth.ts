import createClient from "./supabase/server";
import AppError from "./error";

export async function getAuthContext() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new AppError("Unauthorized Access", 401);
  }
  const { data: business, error:dbError } = await supabase
    .from("business")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if(!business?.id || dbError){
    throw new AppError("No business workspace has been found",404)
  }
  return {supabase,user,businessId:business.id as string}

}
