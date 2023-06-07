export interface Account {
    $id: string;
    name?: string;
    email?: string;
    emailVerification?: boolean;
    phone?: string;
    passwordUpdate?: boolean;
    prefs?: any;
    status: boolean;
    // roles?: string[];
}