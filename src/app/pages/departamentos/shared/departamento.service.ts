import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Departamento } from './departamento.model';

@Injectable({
    providedIn: 'root'
})
export class DepartamentoService extends BaseResourceService<Departamento> {

    constructor(protected override injector: Injector) {
        super('departamentos', injector, Departamento.fromJson);
    }
} 