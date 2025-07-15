import { Component, Injector } from '@angular/core';
import { Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BaseResourceFormComponent } from "../../../shared/components/base-resource-form/base-resource-form.component";
import { Cargo, NivelCargo, NivelCargoLabels } from "../shared/cargo.model";
import { CargoService } from "../shared/cargo.service";

import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { FormFieldErrorComponent } from "../../../shared/components/form-field-error/form-field-error.component";
import { PageLoadingComponent } from "../../../shared/components/page-loading/page-loading.component";
import { BreadCrumbComponent } from "../../../shared/components/bread-crumb/bread-crumb.component";

@Component({
  selector: 'app-cargo-form',
  templateUrl: './cargo-form.component.html',
  styleUrls: ['./cargo-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    FormFieldErrorComponent,
    PageLoadingComponent,
    BreadCrumbComponent
  ]
})
export class CargoFormComponent extends BaseResourceFormComponent<Cargo> {

  niveisCargoOptions = Object.values(NivelCargo);
  nivelCargoLabels = NivelCargoLabels;

  get isEditMode(): boolean {
    return this.resource.id !== null && this.resource.id !== undefined;
  }

  get pageSubtitle(): string {
    return this.isEditMode 
      ? 'Edite as informações do cargo' 
      : 'Cadastre um novo cargo na empresa';
  }

  constructor(
    protected cargoService: CargoService,
    protected override injector: Injector
  ) {
    super(injector, new Cargo(), cargoService, Cargo.fromJson);
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descricao: [null, [Validators.maxLength(250)]],
      nivel: [null, [Validators.required]],
      departamentoId: [1, [Validators.required]], // Temporário - departamento fixo
      salarioBase: [null, [Validators.required, Validators.min(0)]],
      ativo: [true]
    });
  }

  protected override creationPageTitle(): string {
    return "Cadastrar Novo Cargo";
  }

  protected override editionPageTitle(): string {
    return `Editando Cargo: ${this.resource.nome || ''}`;
  }
} 