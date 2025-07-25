import { Injectable } from '@angular/core';

export interface SearchConfig {
    enabled: boolean;
    placeholder: string;
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private _searchTerm: string = '';

    get config(): SearchConfig {
        return {
            enabled: true,
            placeholder: 'Buscar...'
        };
    }

    get searchTerm(): string {
        return this._searchTerm;
    }

    set searchTerm(term: string) {
        this._searchTerm = term;
    }

    filterResources<T>(resources: T[]): T[] {
        // Busca agora é feita no backend, retorna todos os recursos
        return [...resources];
    }
} 