import { inngest } from "@/lib/inngest"
import {serve} from "inngest/next"
import { processDocument } from "@/features/dashboard/knowledge-base/inngest/process-document"

export const {GET,POST,PUT}=serve({
    client:inngest,
    functions:[processDocument]
})