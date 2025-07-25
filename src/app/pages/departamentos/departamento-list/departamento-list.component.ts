import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Departamento, DepartamentoFilter } from '../shared/departamento.model';
import { DepartamentoService } from '../shared/departamento.service';
import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';
import { PaginationService } from '../../../shared/services/pagination.service';
import { SearchService } from '../../../shared/services/search.service';
import { StatisticsCard, StatisticsService } from '../../../shared/services/statistics.service';
import { DeleteModalService } from '../../../shared/services/delete-modal.service';
import { PaginationComponent, PaginationOptions } from '../../../shared/components/pagination/pagination.component';

import { BreadCrumbComponent } from '../../../shared/components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatisticsCardsComponent } from '../../../shared/components/statistics-cards/statistics-cards.component';
import { EmptyStateComponent, EmptyStateConfig } from '../../../shared/components/empty-state/empty-state.component';
import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';
import { ResourceFiltersComponent } from '../../../shared/components/resource-filters/resource-filters.component';
import { ConfirmDeleteModalComponent } from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';

@Component({
    selector: 'app-departamento-list',
    templateUrl: './departamento-list.component.html',
    styleUrls: ['./departamento-list.component.scss'],
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
export class DepartamentoListComponent extends BaseResourceListComponent<Departamento> implements OnInit, OnDestroy {

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private departamentoService: DepartamentoService,
        protected override injector: Injector,
        protected override toastrService: ToastrService,
        protected override paginationService: PaginationService,
        protected override searchService: SearchService,
        protected override statisticsService: StatisticsService,
        protected override deleteModalService: DeleteModalService
    ) {
        super(
            departamentoService,
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

    private performSearch(searchTerm: string): void {
        const trimmedTerm = searchTerm.trim();
        
        // Só realiza a busca se tiver 3 ou mais caracteres
        if (trimmedTerm.length < 3 && trimmedTerm.length > 0) {
            return;
        }

        this.isLoading = true;

        const filter: DepartamentoFilter = {
            nome: trimmedTerm
        };

        this.departamentoService.getAllWithFilters(
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
                console.error('Erro ao buscar departamentos:', error);
                this.isLoading = false;
                this.toastrService.error('Erro ao buscar departamentos');
            }
        });
    }

    public getResourceIcon(departamento: Departamento): string {
        return 'bi-building';
    }

    protected getResourceDisplayName(departamento: Departamento): string {
        return departamento.nome || 'Departamento sem nome';
    }

    override get emptyStateConfig(): EmptyStateConfig {
        return {
            icon: 'bi-building',
            title: 'Nenhum departamento encontrado',
            description: 'Não há departamentos cadastrados no sistema.',
            buttonText: 'Cadastrar Departamento',
            buttonLink: '/departamentos/novo'
        };
    }

    override get loadingConfig() {
        return {
            title: 'Carregando departamentos...',
            description: 'Aguarde enquanto buscamos os departamentos'
        };
    }

    override get paginationOptions(): PaginationOptions {
        return {
            itemsPerPageOptions: [5, 10, 20, 50],
            showItemsPerPage: true,
            showInfo: true,
            iconClass: 'bi-building',
            iconColor: 'primary',
            itemType: 'departamentos'
        };
    }

    override get searchPlaceholder(): string {
        return 'Buscar departamentos...';
    }

    public onSearchChange(searchTerm: string): void {
        this.searchService.searchTerm = searchTerm;
        this.searchSubject.next(searchTerm);
    }

    override filterResources(): void {
        const searchTerm = this.searchService.searchTerm;
        this.searchSubject.next(searchTerm);
    }

    override get pageSubtitle(): string {
        return 'Gerencie os departamentos da empresa';
    }

    get totalDepartamentos(): number {
        return this.resources.length;
    }

    get departamentosAtivos(): number {
        return this.resources.filter(departamento => departamento.ativo).length;
    }

    get departamentosInativos(): number {
        return this.resources.filter(departamento => !departamento.ativo).length;
    }

    override get statisticsCards(): StatisticsCard[] {
        return [
            {
                icon: 'bi-building',
                iconColor: 'primary',
                value: this.totalDepartamentos,
                label: 'Total de Departamentos'
            },
            {
                icon: 'bi-check-circle',
                iconColor: 'success',
                value: this.departamentosAtivos,
                label: 'Departamentos Ativos'
            },
            {
                icon: 'bi-x-circle',
                iconColor: 'danger',
                value: this.departamentosInativos,
                label: 'Departamentos Inativos'
            }
        ];
    }

    protected formatResourceDate(date: any): string {
        return new Date(date).toLocaleDateString('pt-BR');
    }
} 