//features/auth/graphql/auth.types.ts

export interface LoginInput {
    username: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface RegisterInput {
    email: string;
    username: string;
    phone: string;
}

export interface UserRegister {
    email: string;
    username: string;
    phone: string;
}

export interface OTPInput {
    phone: string;
    email: string;
    otp: string;
}

export interface OTPResponse {
    success: boolean;
    message: string;
}

export interface ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}