import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Colaborador } from '../shared/colaborador.model';
import { ColaboradorFilter, ColaboradorService } from '../shared/colaborador.service';
import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';
import { PaginationService } from '../../../shared/services/pagination.service';
import { SearchService } from '../../../shared/services/search.service';
import { StatisticsCard, StatisticsService } from '../../../shared/services/statistics.service';
import { DeleteModalService } from '../../../shared/services/delete-modal.service';
import { PaginationComponent, PaginationOptions } from '../../../shared/components/pagination/pagination.component';

import { BreadCrumbComponent } from '../../../shared/components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
    ConfirmDeleteModalComponent
} from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { StatisticsCardsComponent } from '../../../shared/components/statistics-cards/statistics-cards.component';
import { EmptyStateComponent, EmptyStateConfig } from '../../../shared/components/empty-state/empty-state.component';
import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';
import { ResourceFiltersComponent } from '../../../shared/components/resource-filters/resource-filters.component';

@Component({
    selector: 'app-colaborador-list',
    templateUrl: './colaborador-list.component.html',
    styleUrls: ['./colaborador-list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        BreadCrumbComponent,
        PageHeaderComponent,
        ConfirmDeleteModalComponent,
        PaginationComponent,
        StatisticsCardsComponent,
        EmptyStateComponent,
        PageLoadingComponent,
        ResourceFiltersComponent
    ]
})
export class ColaboradorListComponent extends BaseResourceListComponent<Colaborador> implements OnInit, OnDestroy {

    public filtrosAvancados: ColaboradorFilter = {
        nome: '',
        cargo: '',
        departamento: ''
    };
    public mostrarFiltrosAvancados = false;

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private colaboradorService: ColaboradorService,
        protected override injector: Injector,
        protected override toastrService: ToastrService,
        protected override paginationService: PaginationService,
        protected override searchService: SearchService,
        protected override statisticsService: StatisticsService,
        protected override deleteModalService: DeleteModalService,
    ) {
        super(
            colaboradorService,
            injector,
            toastrService,
            paginationService,
            searchService,
            statisticsService,
            deleteModalService
        );
    }

    override ngOnInit(): void {
        super.ngOnInit();

        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(searchTerm => {
            this.performSearch(searchTerm);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public aplicarFiltrosAvancados(): void {
        this.isLoading = true;

        this.colaboradorService.getAllWithFilters(
            this.filtrosAvancados,
            0,
            this.paginationData.itemsPerPage
        ).subscribe({
            next: (response) => {
                this.resources = response.content;
                this.filteredResources = [...this.resources];
                this.paginationData.totalItems = response.totalElements;
                this.paginationData.totalPages = response.totalPages;
                this.paginationData.currentPage = 1;
                this.paginatedResources = this.paginationService.updatePagination(this.filteredResources);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao buscar colaboradores com filtros:', error);
                this.isLoading = false;
                this.toastrService.error('Erro ao buscar colaboradores');
            }
        });
    }

    public limparFiltros(): void {
        this.filtrosAvancados = {
            nome: '',
            cargo: '',
            departamento: ''
        };
        this.mostrarFiltrosAvancados = false;
        this.loadResources();
    }

    public toggleFiltrosAvancados(): void {
        this.mostrarFiltrosAvancados = !this.mostrarFiltrosAvancados;
    }

    public hasActiveFilters(): boolean {
        return !!(this.filtrosAvancados.nome?.trim() ||
            this.filtrosAvancados.cargo?.trim() ||
            this.filtrosAvancados.departamento?.trim());
    }

    public getActiveFiltersCount(): number {
        let count = 0;
        if (this.filtrosAvancados.nome?.trim()) count++;
        if (this.filtrosAvancados.cargo?.trim()) count++;
        if (this.filtrosAvancados.departamento?.trim()) count++;
        return count;
    }

    private performSearch(searchTerm: string): void {
        const trimmedTerm = searchTerm.trim();

        if (!trimmedTerm || trimmedTerm.length < 3) {
            this.loadResources();
            return;
        }

        this.isLoading = true;

        const filter: ColaboradorFilter = {
            nome: trimmedTerm,
            cargo: '',
            departamento: ''
        };

        this.colaboradorService.getAllWithFilters(
            filter,
            0,
            this.paginationData.itemsPerPage
        ).subscribe({
            next: (response) => {
                this.resources = response.content;
                this.filteredResources = [...this.resources];
                this.paginationData.totalItems = response.totalElements;
                this.paginationData.totalPages = response.totalPages;
                this.paginationData.currentPage = 1;
                this.paginatedResources = this.paginationService.updatePagination(this.filteredResources);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao buscar colaboradores:', error);
                this.isLoading = false;
                this.toastrService.error('Erro ao buscar colaboradores');
            }
        });
    }

    public onSearchChange(searchTerm: string): void {
        this.searchService.searchTerm = searchTerm;
        this.searchSubject.next(searchTerm);
    }

    override filterResources(): void {
        const searchTerm = this.searchService.searchTerm;
        this.searchSubject.next(searchTerm);
    }

    public getResourceIcon(colaborador: Colaborador): string {
        return 'bi-people';
    }

    protected getResourceDisplayName(colaborador: Colaborador): string {
        return colaborador.nome || 'Colaborador sem nome';
    }

    override get emptyStateConfig(): EmptyStateConfig {
        return {
            icon: 'bi-people',
            title: 'Nenhum colaborador encontrado',
            description: 'Comece cadastrando seu primeiro colaborador',
            buttonText: 'Cadastrar Primeiro Colaborador',
            buttonLink: 'new'
        };
    }

    override get loadingConfig() {
        return {
            title: 'Carregando colaboradores...',
            description: 'Aguarde enquanto buscamos os colaboradores'
        };
    }

    override get paginationOptions(): PaginationOptions {
        return {
            itemsPerPageOptions: [5, 10, 20, 50],
            showItemsPerPage: true,
            showInfo: true,
            iconClass: 'bi-people',
            iconColor: 'primary',
            itemType: 'colaboradores'
        };
    }

    override get searchPlaceholder(): string {
        return 'Buscar colaboradores...';
    }

    override get pageSubtitle(): string {
        return 'Gerencie os colaboradores da empresa';
    }

    get totalColaboradores(): number {
        return this.resources.length;
    }

    get colaboradoresAtivos(): number {
        return this.resources.filter(colaborador => colaborador.status === 'ATIVO').length;
    }

    get colaboradoresInativos(): number {
        return this.resources.filter(colaborador => colaborador.status === 'INATIVO').length;
    }

    override get statisticsCards(): StatisticsCard[] {
        return [
            {
                icon: 'bi-people',
                iconColor: 'primary',
                value: this.totalColaboradores,
                label: 'Total de Colaboradores'
            },
            {
                icon: 'bi-person-check',
                iconColor: 'success',
                value: this.colaboradoresAtivos,
                label: 'Colaboradores Ativos'
            },
            {
                icon: 'bi-person-x',
                iconColor: 'danger',
                value: this.colaboradoresInativos,
                label: 'Colaboradores Inativos'
            }
        ];
    }


    inativarColaborador(colaborador: Colaborador) {
        const dataDemissao = new Date();
        this.colaboradorService.inativar(colaborador.id!, dataDemissao).subscribe({
            next: () => {
                this.ngOnInit();
                this.toastrService.success('Colaborador inativado com sucesso!');
            },
            error: (error) => {
                this.toastrService.error('Erro ao inativar colaborador!');
            }
        });
    }

    protected formatResourceDate(date: any): string {
        return '';
    }
} 