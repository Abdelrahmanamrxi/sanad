import { NextResponse,NextRequest } from "next/server";
import AppError from "./error";
type Handler<C>=(req:NextRequest,ctx:C)=>Promise<Response>

export const handle=<C=unknown>(fn:Handler<C>)=>{
    return async(req:NextRequest,ctx:C)=>{
        try{
           return await fn(req,ctx)
        }
        catch(err){
            if(err instanceof AppError){
                if(err.cause) console.log(err.message,err.cause)
                return NextResponse.json({error:err.message},{status:err.status})
            }
            console.log(err)
            return NextResponse.json({error:"Internal Server Error"},{status:500})
        }
    }

}