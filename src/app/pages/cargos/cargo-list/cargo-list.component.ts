import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Cargo, NivelCargoLabels, CargoFilter } from '../shared/cargo.model';
import { CargoService } from '../shared/cargo.service';
import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';
import { PaginationService } from '../../../shared/services/pagination.service';
import { SearchService } from '../../../shared/services/search.service';
import { StatisticsService, StatisticsCard } from '../../../shared/services/statistics.service';
import { DeleteModalService } from '../../../shared/services/delete-modal.service';
import { PaginationOptions } from '../../../shared/components/pagination/pagination.component';

import { BreadCrumbComponent } from '../../../shared/components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
    ConfirmDeleteModalComponent
} from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatisticsCardsComponent } from '../../../shared/components/statistics-cards/statistics-cards.component';
import { EmptyStateComponent, EmptyStateConfig } from '../../../shared/components/empty-state/empty-state.component';
import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';
import { ResourceFiltersComponent } from '../../../shared/components/resource-filters/resource-filters.component';

@Component({
    selector: 'app-cargo-list',
    templateUrl: './cargo-list.component.html',
    styleUrls: ['./cargo-list.component.scss'],
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
export class CargoListComponent extends BaseResourceListComponent<Cargo> implements OnInit, OnDestroy {

    nivelCargoLabels = NivelCargoLabels;

    public filtrosAvancados: CargoFilter = {
        nome: '',
        departamento: '',
        status: ''
    };
    public mostrarFiltrosAvancados = false;
    public statistics = {
        total: 0,
        ativos: 0,
        inativos: 0
    };

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private cargoService: CargoService,
        protected override injector: Injector,
        protected override toastrService: ToastrService,
        protected override paginationService: PaginationService,
        protected override searchService: SearchService,
        protected override statisticsService: StatisticsService,
        protected override deleteModalService: DeleteModalService
    ) {
        super(
            cargoService,
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

        this.mostrarFiltrosAvancados = false;
        
        // Carregar estatísticas do backend
        this.carregarEstatisticas();
    }

    private carregarEstatisticas(): void {
        this.cargoService.getEstatisticas().subscribe({
            next: (estatisticas) => {
                this.statistics = {
                    total: estatisticas.total || 0,
                    ativos: estatisticas.ativos || 0,
                    inativos: estatisticas.inativos || 0
                };
            },
            error: (error) => {
                console.error('Erro ao carregar estatísticas:', error);
                this.statistics = {
                    total: this.resources.length,
                    ativos: this.resources.filter(cargo => cargo.ativo).length,
                    inativos: this.resources.filter(cargo => !cargo.ativo).length
                };
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public aplicarFiltrosAvancados(): void {
        this.isLoading = true;

        this.cargoService.getAllWithFilters(
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
                console.error('Erro ao buscar cargos com filtros:', error);
                this.isLoading = false;
                this.toastrService.error('Erro ao buscar cargos');
            }
        });
    }

    public limparFiltros(): void {
        this.filtrosAvancados = {
            nome: '',
            departamento: '',
            status: ''
        };
        this.mostrarFiltrosAvancados = false;
        this.loadResources();
    }

    public toggleFiltrosAvancados(): void {
        this.mostrarFiltrosAvancados = !this.mostrarFiltrosAvancados;
    }

    public hasActiveFilters(): boolean {
        return !!(this.filtrosAvancados.nome?.trim() ||
            this.filtrosAvancados.departamento?.trim() ||
            this.filtrosAvancados.status?.trim());
    }

    public getActiveFiltersCount(): number {
        let count = 0;
        if (this.filtrosAvancados.nome?.trim()) count++;
        if (this.filtrosAvancados.departamento?.trim()) count++;
        if (this.filtrosAvancados.status?.trim()) count++;
        return count;
    }

    private performSearch(searchTerm: string): void {
        const trimmedTerm = searchTerm.trim();
        
        if (trimmedTerm.length < 3 && trimmedTerm.length > 0) {
            return;
        }

        if (!trimmedTerm) {
            this.loadResources();
            return;
        }

        this.isLoading = true;

        const filter: CargoFilter = {
            nome: trimmedTerm,
            departamento: '',
            status: ''
        };

        this.cargoService.getAllWithFilters(
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
                console.error('Erro ao buscar cargos:', error);
                this.isLoading = false;
                this.toastrService.error('Erro ao buscar cargos');
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

    public getResourceIcon(cargo: Cargo): string {
        return 'bi-briefcase';
    }

    protected getResourceDisplayName(cargo: Cargo): string {
        return cargo.nome || 'Cargo sem nome';
    }

    override get emptyStateConfig(): EmptyStateConfig {
        return {
            icon: 'bi-briefcase',
            title: 'Nenhum cargo encontrado',
            description: 'Comece criando seu primeiro cargo',
            buttonText: 'Criar Primeiro Cargo',
            buttonLink: 'new'
        };
    }

    override get loadingConfig() {
        return {
            title: 'Carregando cargos...',
            description: 'Aguarde enquanto buscamos os cargos'
        };
    }

    override get paginationOptions(): PaginationOptions {
        return {
            itemsPerPageOptions: [5, 10, 20, 50],
            showItemsPerPage: true,
            showInfo: true,
            iconClass: 'bi-briefcase',
            iconColor: 'primary',
            itemType: 'cargos'
        };
    }

    override get searchPlaceholder(): string {
        return 'Buscar cargos...';
    }

    override get pageSubtitle(): string {
        return 'Gerencie os cargos da empresa';
    }

    get totalCargos(): number {
        return this.statistics.total;
    }

    get cargosAtivos(): number {
        return this.statistics.ativos;
    }

    get cargosInativos(): number {
        return this.statistics.inativos;
    }

    override get statisticsCards(): StatisticsCard[] {
        return [
            {
                icon: 'bi-briefcase',
                iconColor: 'primary',
                value: this.totalCargos,
                label: 'Total de Cargos'
            },
            {
                icon: 'bi-check-circle',
                iconColor: 'success',
                value: this.cargosAtivos,
                label: 'Cargos Ativos'
            },
            {
                icon: 'bi-x-circle',
                iconColor: 'danger',
                value: this.cargosInativos,
                label: 'Cargos Inativos'
            }
        ];
    }

    formatSalario(salario: number | undefined): string {
        if (!salario) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(salario);
    }

    protected formatResourceDate(date: any): string {
        return '';
    }
} 