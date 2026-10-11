import { NextRequest, NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";
import { fileSchema } from "@/features/dashboard/knowledge-base/schemas/file";

export const runtime="nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1) Authenticate the user and get the user.id
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user || error) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 401 },
      );
    }
    // 2) Retreive business details which are related to the user

    const { data:business } = await supabase
      .from("business")
      .select("id")
      .eq("owner_id", user.id)
      .single();

     if(!business || !business.id){
        return NextResponse.json({message:"No business workspace has been found for this user."},{status:404})
      }
    
    const businessId=business.id

    // 3) Retrieve the file's which are uploaded within the formdata

    const formData=await request.formData()
    const file=formData.get("file")

    // 4) Parse the file to see if it's secure.
    const parsed=fileSchema.safeParse(file)

    if(!parsed.success){
        return NextResponse.json({message:parsed.error.issues[0]?.message ||"Invalid file uploaded"},{status:400})
    }

    const parsedFile=parsed.data

    

  } catch (err) {
    console.log(err);
  }
}
