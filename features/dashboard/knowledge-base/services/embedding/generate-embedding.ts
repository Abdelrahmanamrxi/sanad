import {openRouter} from "@/lib/openrouter"



export const EMBEDDING_MODEL=process.env.OPENROUTER_EMBEDDING_MODEL!;

export async function generateEmbedding(text:string[],batchSize:number=50):Promise<number[][]>{
    if(text.length===0)
        return [];
    // Collects the embedding results
    const allEmbeddings:number[][]=[]

    for(let i=0;i<text.length;i+=batchSize){
        const batch = text.slice(i, i + batchSize); // Processes text in batches
        const response=await openRouter.embeddings.generate({
            requestBody:{
                model:EMBEDDING_MODEL,
                input:batch,
                encodingFormat:'float' // requests vectors in a floating point no.
            }
        })
        if(typeof response === "string" || !response.data){
            throw new Error("Failed to receive results from the embedding model")
        }
        // Sort them by index
         const sorted = response.data.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

         for(const item of sorted){
            allEmbeddings.push(item.embedding as number[])
         }
    }
    return allEmbeddings

}