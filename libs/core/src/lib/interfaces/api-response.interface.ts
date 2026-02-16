export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    status_code?: any;
    data?: T;
    errors?: string | string[] | Record<string, any>;
}