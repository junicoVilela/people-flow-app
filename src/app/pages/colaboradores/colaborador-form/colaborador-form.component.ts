import { Component, Injector } from '@angular/core';
import { Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BaseResourceFormComponent } from "../../../shared/components/base-resource-form/base-resource-form.component";
import { Colaborador } from "../shared/colaborador.model";
import { ColaboradorService } from "../shared/colaborador.service";

import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { FormFieldErrorComponent } from "../../../shared/components/form-field-error/form-field-error.component";
import { PageLoadingComponent } from "../../../shared/components/page-loading/page-loading.component";

@Component({
  selector: 'app-colaborador-form',
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    FormFieldErrorComponent,
    PageLoadingComponent
  ]
})
export class ColaboradorFormComponent extends BaseResourceFormComponent<Colaborador> {

  get isEditMode(): boolean {
    return this.resource.id !== null && this.resource.id !== undefined;
  }

  get pageSubtitle(): string {
    return this.isEditMode 
      ? 'Edite as informações do colaborador' 
      : 'Cadastre um novo colaborador na empresa';
  }

  constructor(
    protected colaboradorService: ColaboradorService,
    protected override injector: Injector
  ) {
    super(injector, new Colaborador(), colaboradorService, Colaborador.fromJson);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.adjustPasswordValidation();
  }

  private adjustPasswordValidation(): void {
    // Ajusta a validação da senha baseado no modo (criação ou edição)
    const senhaControl = this.resourceForm.get('senha');
    if (senhaControl) {
      if (this.currentAction === 'new') {
        // No modo criação, senha é obrigatória
        senhaControl.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
      } else {
        // No modo edição, senha é opcional
        senhaControl.setValidators([Validators.minLength(6), Validators.maxLength(20)]);
      }
      senhaControl.updateValueAndValidity();
    }
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(150)]],
      senha: [null, [Validators.minLength(6), Validators.maxLength(20)]], // Removido Validators.required
      cpf: [null, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      rg: [null, [Validators.maxLength(20)]],
      dataNascimento: [null, [Validators.required]],
      sexo: [null, [Validators.pattern(/^[MF]?$/)]],
      telefone: [null, [Validators.pattern(/^\d{10,11}$/)]],
      estadoCivil: [null, [Validators.maxLength(50)]],
      endereco: [null, [Validators.maxLength(200)]],
      cargo: [null, [Validators.required, Validators.maxLength(100)]],
      departamento: [null, [Validators.required, Validators.maxLength(100)]],
      salario: [null, [Validators.required, Validators.min(0.01)]],
      dataAdmissao: [null, [Validators.required]]
    });
  }

  protected override creationPageTitle(): string {
    return "Cadastrar Novo Colaborador";
  }

  protected override editionPageTitle(): string {
    return `Editando Colaborador: ${this.resource.nome || ''}`;
  }

} 