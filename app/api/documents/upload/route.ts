import { NextResponse } from "next/server";
import { handle } from "@/http/async-handler";
import { getAuthContext } from "@/lib/auth";
import { parseUpload } from "@/features/dashboard/knowledge-base/services/parse-upload";
import { uploadDocument } from "@/features/dashboard/knowledge-base/services/upload-document";
import { inngest } from "@/lib/clients/connections/inngest";

export const POST = handle(async (request) => {
  const { supabase, businessId } = await getAuthContext();
  const file = await parseUpload(request);
  const { id } = await uploadDocument(supabase, businessId, file);

  await inngest.send({
    name: "sanad/process-document",
    data: {
      businessId,
      documentId: id,
    },
  });

  return NextResponse.json({ id, status: "queued" }, { status: 201 });
});
