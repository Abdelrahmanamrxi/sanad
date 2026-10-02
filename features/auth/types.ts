import { User } from "./schemas/auth"

export type AuthResult={
    success:boolean,
    error?:string,
    fieldErrors?:Partial<Record<keyof User,string[]>>
}