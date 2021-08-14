export default interface IUser {
    userId?: string;
    password: string;
    email: string;
    name: string;
    enabled?: boolean;
    code?: string;
    nonce?: string;
    claims?: string[];
    lastAuthenticated?: string;
}