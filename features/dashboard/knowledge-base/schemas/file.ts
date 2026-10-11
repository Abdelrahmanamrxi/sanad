
import { z } from "zod";


export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
export const fileSchema = z
  .file({error:"File must be provided"})
  .min(1,"File must atleast contain some content")
  .max(FILE_SIZE_LIMIT)
  .mime([
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],"File must be either PDF, TXT, DOCX")
  .refine(
    async(file)=>{
        if(file.type==="text/plain")
        return true
    
        // Read the first 4 bytes of a file to check if it's not spoofed
        const buffer=await file.slice(0,4).arrayBuffer()
        const header = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
        
        // Check if the file matches PDF's magic bytes

        if(file.type==="application/pdf"){
         return header==="25504446"
        }

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return header.startsWith("504B");
      }

      return true
        
    }
    ,{
        message:"File content doesn't match its file extenstion (CORRUPTED OR SPOOFED FILE)"
    }
  )
