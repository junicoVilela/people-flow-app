export interface PaginationConfig {
    options: PaginationOptions;
    defaultItemsPerPage: number;
    enableItemsPerPage?: boolean;
}

export interface PaginationData {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    startItem: number;
    endItem: number;
}

// Import necessário para PaginationOptions
import { PaginationOptions } from '../components/pagination/pagination.component'; 