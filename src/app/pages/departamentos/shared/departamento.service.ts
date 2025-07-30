import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Departamento, DepartamentoFilter } from './departamento.model';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

@Injectable({
    providedIn: 'root'
})
export class DepartamentoService extends BaseResourceService<Departamento> {

    constructor(protected override injector: Injector) {
        super('departamentos', injector, Departamento.fromJson);
    }

    getAllWithFilters(filter: DepartamentoFilter, page: number = 0, size: number = 10): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (filter.nome) {
            params = params.set('nome', filter.nome);
        }

        const url = `${environment.apiUrl}/${this.apiPath}`;
        return this.http.get<any>(url, { params }).pipe(
            map((response: any) => {
                if (response && response.content && Array.isArray(response.content)) {
                    return {
                        content: this.jsonDataToResources(response.content),
                        totalElements: response.totalElements,
                        totalPages: response.totalPages,
                        size: response.size,
                        number: response.number
                    };
                }
                return response;
            })
        );
    }

    getEstatisticas(): Observable<any> {
        const url = `${environment.apiUrl}/${this.apiPath}/estatisticas`;
        return this.http.get<any>(url);
    }
} 