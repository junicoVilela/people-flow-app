import { Component, Injector, OnInit, AfterViewInit } from '@angular/core';
import { Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
import { Colaborador } from '../shared/colaborador.model';
import { ColaboradorService } from '../shared/colaborador.service';
import { Departamento } from '../../departamentos/shared/departamento.model';
import { DepartamentoService } from '../../departamentos/shared/departamento.service';
import { Cargo } from '../../cargos/shared/cargo.model';
import { CargoService } from '../../cargos/shared/cargo.service';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';
import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';

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
export class ColaboradorFormComponent extends BaseResourceFormComponent<Colaborador> implements OnInit, AfterViewInit {

    departamentos: Departamento[] = [];
    cargos: Cargo[] = [];
    cargosFiltrados: Cargo[] = [];

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
        protected departamentoService: DepartamentoService,
        protected cargoService: CargoService,
        protected override injector: Injector
    ) {
        super(injector, new Colaborador(), colaboradorService, Colaborador.fromJson);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.adjustPasswordValidation();
        this.loadDepartamentos();
        this.loadCargos();
    }

    ngAfterViewInit(): void {
        if (this.currentAction === 'edit' && this.resource) {
            this.loadCargosForDepartamento();
        }
    }

    private loadCargosForDepartamento(): void {
        if (this.resource.departamentoId) {
            this.cargosFiltrados = this.cargos.filter(cargo => cargo.departamentoId === this.resource.departamentoId);
        }
    }

    private loadDepartamentos(): void {
        this.departamentoService.getAll().subscribe({
            next: (departamentos) => {
                this.departamentos = departamentos.filter(d => d.ativo);
            },
            error: (error) => {
                console.error('Erro ao carregar departamentos:', error);
            }
        });
    }

    private loadCargos(): void {
        this.cargoService.getAll().subscribe({
            next: (cargos) => {
                this.cargos = cargos.filter(c => c.ativo);
                this.cargosFiltrados = [...this.cargos];
            },
            error: (error) => {
                console.error('Erro ao carregar cargos:', error);
            }
        });
    }

    get departamentoId(): number | null {
        return this.resourceForm.get('departamentoId')?.value;
    }

    onDepartamentoChange(): void {
        const departamentoId = this.resourceForm.get('departamentoId')?.value;
        
        if (departamentoId) {
            this.cargosFiltrados = this.cargos.filter(cargo => Number(cargo.departamentoId) === Number(departamentoId));
        } else {
            this.cargosFiltrados = [];
        }
        
        // Limpar seleção de cargo quando departamento muda
        this.resourceForm.patchValue({ cargoId: null });
    }

    private adjustPasswordValidation(): void {
        const senhaControl = this.resourceForm.get('senha');
        if (senhaControl) {
            if (this.currentAction === 'new') {
                senhaControl.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
            } else {
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
            cargoId: [null, [Validators.required]],
            departamentoId: [null, [Validators.required]],
            salario: [null, [Validators.required, Validators.min(0.01)]],
            dataAdmissao: [null, [Validators.required]]
        });
    }

    protected override creationPageTitle(): string {
        return 'Cadastrar Novo Colaborador';
    }

    protected override editionPageTitle(): string {
        return `Editando Colaborador: ${this.resource.nome || ''}`;
    }

} 