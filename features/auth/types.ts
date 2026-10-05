import { User } from "./schemas/auth"

export type AuthResult = {
    success: boolean;
    error?: string;
    redirectTo?: string;
    fieldErrors?: Record<string, string[] | undefined>;
};

export type VerifyOTPResult={
    success:boolean,
    error?:string
}
