import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Cargo, CargoFilter } from './cargo.model';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
    providedIn: 'root'
})
export class CargoService extends BaseResourceService<Cargo> {

    constructor(protected override injector: Injector) {
        super('cargos', injector, Cargo.fromJson);
    }

    getAllWithFilters(filter: CargoFilter, page: number = 0, size: number = 10): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (filter.nome) {
            params = params.set('nome', filter.nome);
        }
        if (filter.departamento) {
            params = params.set('departamento', filter.departamento);
        }
        if (filter.status) {
            params = params.set('status', filter.status);
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