export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    success?: boolean;
}

export interface PaginatedApiResponse<T = any> {
    message: string;
    data: T[];
    meta: {
        itemsPerPage: number;
        totalItems?: number;
        currentPage?: number;
        totalPages?: number;
        sortBy?: any;
        searchBy?: any;
        search?: string;
        select?: string[];
        filter?: any;
        cursor?: string;
    };
    links?: {
        current?: string;
        next?: string;
        previous?: string;
    };
}

export interface ApiErrorResponse {
    message: string;
    error?: string;
    statusCode: number;
    success: false;
}
