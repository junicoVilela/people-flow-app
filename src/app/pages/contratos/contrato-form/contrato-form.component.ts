import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Contrato, StatusContrato, TipoContrato } from '../shared/contrato.model';
import { ContratoService } from '../shared/contrato.service';
import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
import { Colaborador } from '../../colaboradores/shared/colaborador.model';
import { ColaboradorService } from '../../colaboradores/shared/colaborador.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';
import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    FormFieldErrorComponent,
    PageLoadingComponent
  ]
})
export class ContratoFormComponent extends BaseResourceFormComponent<Contrato> implements OnInit {

  public TipoContrato = TipoContrato;
  public StatusContrato = StatusContrato;
  public colaboradores: Colaborador[] = [];
  public colaboradoresFiltrados: Colaborador[] = [];

  constructor(
    protected contratoService: ContratoService,
    protected override injector: Injector
  ) {
    super(injector, new Contrato(), contratoService, Contrato.fromJson);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadColaboradores();
    this.setupFormValidation();
  }

  private loadColaboradores(): void {
    // Dados mock para colaboradores
    const mockColaboradores = [
      { id: 1, nome: 'João Silva', email: 'joao@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 2, nome: 'Maria Santos', email: 'maria@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 3, nome: 'Pedro Costa', email: 'pedro@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 4, nome: 'Ana Oliveira', email: 'ana@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 5, nome: 'Carlos Lima', email: 'carlos@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 6, nome: 'Lucia Ferreira', email: 'lucia@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 7, nome: 'Roberto Alves', email: 'roberto@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 8, nome: 'Fernanda Rocha', email: 'fernanda@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 9, nome: 'Marcos Silva', email: 'marcos@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false },
      { id: 10, nome: 'Juliana Costa', email: 'juliana@empresa.com', status: 'ATIVO', isAtivo: true, isDesligado: false, isFerias: false }
    ] as Colaborador[];
    
    this.colaboradores = mockColaboradores;
    this.colaboradoresFiltrados = [...this.colaboradores];
  }

  private setupFormValidation(): void {
    const statusControl = this.resourceForm.get('status');
    const dataFimControl = this.resourceForm.get('dataFim');
    const dataInicioControl = this.resourceForm.get('dataInicio');
    
    if (statusControl && dataFimControl) {
      statusControl.valueChanges.subscribe(status => {
        if (status === StatusContrato.ENCERRADO) {
          dataFimControl.setValidators([Validators.required]);
          dataFimControl.enable();
        } else {
          dataFimControl.clearValidators();
          dataFimControl.disable();
          dataFimControl.setValue(null);
        }
        dataFimControl.updateValueAndValidity();
      });
    }

    // Validação de datas
    if (dataInicioControl && dataFimControl) {
      dataInicioControl.valueChanges.subscribe(dataInicio => {
        if (dataInicio && dataFimControl.value) {
          const inicio = new Date(dataInicio);
          const fim = new Date(dataFimControl.value);
          
          if (inicio >= fim) {
            dataFimControl.setErrors({ invalidDateRange: true });
          } else {
            dataFimControl.setErrors(null);
          }
        }
      });

      dataFimControl.valueChanges.subscribe(dataFim => {
        if (dataFim && dataInicioControl.value) {
          const inicio = new Date(dataInicioControl.value);
          const fim = new Date(dataFim);
          
          if (inicio >= fim) {
            dataFimControl.setErrors({ invalidDateRange: true });
          } else {
            dataFimControl.setErrors(null);
          }
        }
      });
    }
  }

  get isEditMode(): boolean {
    return this.route.snapshot.params['id'] !== undefined;
  }

  get pageSubtitle(): string {
    return this.isEditMode 
      ? 'Edite as informações do contrato de trabalho'
      : 'Cadastre um novo contrato de trabalho';
  }

  override get loadingConfig(): any {
    return {
      message: 'Carregando...',
      overlay: true
    };
  }

  protected override buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      colaboradorId: [null, [Validators.required]],
      colaboradorNome: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      dataInicio: [null, [Validators.required]],
      dataFim: [{value: null, disabled: true}],
      salario: [null, [Validators.required, Validators.min(0)]],
      cargaHoraria: [null, [Validators.required, Validators.min(1), Validators.max(168)]],
      status: [StatusContrato.ATIVO, [Validators.required]],
      observacoes: [null]
    });
  }

  protected override creationPageTitle(): string {
    return 'Novo Contrato';
  }

  protected override editionPageTitle(): string {
    return 'Editar Contrato';
  }

  public onColaboradorChange(): void {
    const colaboradorId = this.resourceForm.get('colaboradorId')?.value;
    if (colaboradorId) {
      const colaborador = this.colaboradores.find(c => c.id === colaboradorId);
      if (colaborador) {
        this.resourceForm.patchValue({
          colaboradorNome: colaborador.nome
        });
      }
    }
  }
} 