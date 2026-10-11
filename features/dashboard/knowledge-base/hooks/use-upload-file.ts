"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, {isAxiosError} from "axios";

export const uploadFile = async (
  file: File,
): Promise<{ id: string; status: "queued" }> => {
  const fd = new FormData();
  fd.append("file", file);
  try{      
      const response = await axios.post(
          `/api/documents/upload`,
          fd,
        );
        return response.data as {id:string, status:"queued"};
    }
    catch(err){
        if(isAxiosError(err) && err.response?.data.error){
            throw new Error(err.response.data.error)
        }
        throw err instanceof Error ? err : new Error("Failed to upload document")
    }

  
};

export const useUploadFile=()=>{
    const qc=useQueryClient()
    return useMutation({
        mutationFn:uploadFile,
        onSuccess:()=>qc.invalidateQueries({queryKey:["documents"]})
    })
}
