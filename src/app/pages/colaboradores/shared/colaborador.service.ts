import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Colaborador } from "./colaborador.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService extends BaseResourceService<Colaborador> {

  constructor(protected override injector: Injector) {
    super("colaboradores", injector, Colaborador.fromJson);
  }

  inativar(id: number, dataDemissao: Date): Observable<void> {
    const url = `${environment.apiUrl}/${this.apiPath}/${id}/inativar`;
    return this.http.patch<void>(url, { dataDemissao }).pipe(
      map(() => void 0)
    );
  }
} 