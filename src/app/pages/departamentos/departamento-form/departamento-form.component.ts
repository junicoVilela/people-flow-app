import { Component, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
import { Departamento } from '../shared/departamento.model';
import { DepartamentoService } from '../shared/departamento.service';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { BreadCrumbComponent } from '../../../shared/components/bread-crumb/bread-crumb.component';

@Component({
    selector: 'app-departamento-form',
    templateUrl: './departamento-form.component.html',
    styleUrls: ['./departamento-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        PageHeaderComponent,
        BreadCrumbComponent
    ]
})
export class DepartamentoFormComponent extends BaseResourceFormComponent<Departamento> {

    get isEditMode(): boolean {
        return this.resource.id !== null && this.resource.id !== undefined;
    }

    get pageSubtitle(): string {
        return this.isEditMode
            ? 'Edite as informações do departamento'
            : 'Cadastre um novo departamento na empresa';
    }

    constructor(
        protected departamentoService: DepartamentoService,
        protected override injector: Injector
    ) {
        super(injector, new Departamento(), departamentoService, Departamento.fromJson);
    }

    protected buildResourceForm(): void {
        this.resourceForm = this.formBuilder.group({
            nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            descricao: ['', [Validators.maxLength(250)]],
            ativo: [true]
        });
    }

    protected override creationPageTitle(): string {
        return 'Novo Departamento';
    }

    protected override editionPageTitle(): string {
        return 'Editar Departamento';
    }
} 