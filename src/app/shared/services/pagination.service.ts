import { Injectable } from '@angular/core';
import { PaginationConfig, PaginationData } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    private _currentPage: number = 1;
    private _itemsPerPage: number;
    private _totalPages: number = 0;
    private _totalItems: number = 0;

    constructor() {
        const savedItemsPerPage = localStorage.getItem('itemsPerPage');
        this._itemsPerPage = savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : this.config.defaultItemsPerPage;
    }

    get config(): PaginationConfig {
        return {
            options: {
                itemsPerPageOptions: [5, 10, 20, 50],
                showItemsPerPage: true,
                showInfo: true,
                iconClass: 'bi-collection',
                iconColor: 'primary',
                itemType: 'itens'
            },
            defaultItemsPerPage: 10,
            enableItemsPerPage: true
        };
    }

    get currentPage(): number {
        return this._currentPage;
    }

    get itemsPerPage(): number {
        return this._itemsPerPage;
    }

    get totalPages(): number {
        return this._totalPages;
    }

    get totalItems(): number {
        return this._totalItems;
    }

    onPageChange(page: number): void {
        this._currentPage = page;
    }

    onItemsPerPageChange(itemsPerPage: number): void {
        this._itemsPerPage = itemsPerPage;
        this._currentPage = 1; // Voltar para a primeira página
        // Salvar preferência no localStorage
        localStorage.setItem('itemsPerPage', itemsPerPage.toString());
    }

    updatePagination<T>(resources: T[]): T[] {
        this._totalItems = resources.length;
        this._totalPages = Math.ceil(this._totalItems / this._itemsPerPage);

        const startIndex = (this._currentPage - 1) * this._itemsPerPage;
        const endIndex = startIndex + this._itemsPerPage;

        return resources.slice(startIndex, endIndex);
    }

    get paginationData(): PaginationData {
        const startIndex = (this._currentPage - 1) * this._itemsPerPage;
        const endIndex = startIndex + this._itemsPerPage;

        return {
            currentPage: this._currentPage,
            totalPages: this._totalPages,
            itemsPerPage: this._itemsPerPage,
            totalItems: this._totalItems,
            startItem: this._totalItems > 0 ? startIndex + 1 : 0,
            endItem: Math.min(endIndex, this._totalItems)
        };
    }

    reset(): void {
        this._currentPage = 1;
        const savedItemsPerPage = localStorage.getItem('itemsPerPage');
        this._itemsPerPage = savedItemsPerPage ? parseInt(savedItemsPerPage, 10) : this.config.defaultItemsPerPage;
        this._totalPages = 0;
        this._totalItems = 0;
    }
} 