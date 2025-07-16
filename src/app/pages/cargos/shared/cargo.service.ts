import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Cargo } from './cargo.model';
import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
    providedIn: 'root'
})
export class CargoService extends BaseResourceService<Cargo> {

    constructor(protected override injector: Injector) {
        super('cargos', injector, Cargo.fromJson);
    }

    inativar(id: number, dataDemissao: Date): Observable<any> {
        return this.http.patch(`${this.apiPath}/${id}/inativar`, {dataDemissao});
    }
} 