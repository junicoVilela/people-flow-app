import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Colaborador } from "./colaborador.model";
import { environment } from "../../../../environments/environment";

export interface ColaboradorFilter {
  nome?: string;
  cargo?: string;
  departamento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService extends BaseResourceService<Colaborador> {

  constructor(protected override injector: Injector) {
    super("colaboradores", injector, Colaborador.fromJson);
  }

  getAllWithFilters(filter: ColaboradorFilter, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter.nome) {
      params = params.set('nome', filter.nome);
    }
    if (filter.cargo) {
      params = params.set('cargo', filter.cargo);
    }
    if (filter.departamento) {
      params = params.set('departamento', filter.departamento);
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

  inativar(id: number, dataDemissao: Date): Observable<void> {
    const url = `${environment.apiUrl}/${this.apiPath}/${id}/inativar`;
    return this.http.patch<void>(url, { dataDemissao }).pipe(
      map(() => void 0)
    );
  }
} 