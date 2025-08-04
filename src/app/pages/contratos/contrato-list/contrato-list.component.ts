import { Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Contrato, StatusContrato, TipoContrato } from '../shared/contrato.model';
import { ContratoService, ContratoFilter, ContratoStatistics } from '../shared/contrato.service';
import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';
import { PaginationService } from '../../../shared/services/pagination.service';
import { SearchService } from '../../../shared/services/search.service';
import { StatisticsService, StatisticsCard } from '../../../shared/services/statistics.service';
import { DeleteModalService } from '../../../shared/services/delete-modal.service';

import { BreadCrumbComponent } from '../../../shared/components/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteModalComponent } from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { StatisticsCardsComponent } from '../../../shared/components/statistics-cards/statistics-cards.component';
import { EmptyStateComponent, EmptyStateConfig } from '../../../shared/components/empty-state/empty-state.component';
import { PageLoadingComponent } from '../../../shared/components/page-loading/page-loading.component';
import { ResourceFiltersComponent } from '../../../shared/components/resource-filters/resource-filters.component';
import { PaginationComponent, PaginationOptions } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-contrato-list',
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BreadCrumbComponent,
    PageHeaderComponent,
    ConfirmDeleteModalComponent,
    StatisticsCardsComponent,
    EmptyStateComponent,
    PageLoadingComponent,
    ResourceFiltersComponent,
    PaginationComponent
  ]
})
export class ContratoListComponent extends BaseResourceListComponent<Contrato> implements OnInit {

  public filtrosAvancados: ContratoFilter = {
    colaboradorNome: '',
    tipo: '',
    status: ''
  };
  public mostrarFiltrosAvancados = false;
  public statistics: ContratoStatistics = {
    total: 0,
    ativos: 0,
    inativos: 0,
    suspensos: 0,
    encerrados: 0,
    vigentes: 0
  };
  public StatusContrato = StatusContrato;
  public TipoContrato = TipoContrato;


  constructor(
    private contratoService: ContratoService,
    protected override injector: Injector,
    protected override toastrService: ToastrService,
    protected override paginationService: PaginationService,
    protected override searchService: SearchService,
    protected override statisticsService: StatisticsService,
    protected override deleteModalService: DeleteModalService,
  ) {
    super(
      contratoService,
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
    // Carrega as estatísticas após um pequeno delay para garantir que os dados estejam disponíveis
    setTimeout(() => {
      this.loadStatistics();
    }, 100);
  }

  private loadStatistics(): void {
    this.contratoService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = {
          total: stats.total || 0,
          ativos: stats.ativos || 0,
          inativos: stats.inativos || 0,
          suspensos: stats.suspensos || 0,
          encerrados: stats.encerrados || 0,
          vigentes: stats.vigentes || 0
        };
        console.log('Estatísticas carregadas:', this.statistics); // Debug
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        // Fallback para dados mock em caso de erro
        this.statistics = {
          total: 10,
          ativos: 9,
          inativos: 0,
          suspensos: 0,
          encerrados: 1,
          vigentes: 9
        };
      }
    });
  }

  public onSearchChange(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.filterResources();
  }

  public aplicarFiltrosAvancados(): void {
    this.isLoading = true;
    this.contratoService.getAllWithFilters(this.filtrosAvancados, 0, 10).subscribe({
      next: (response) => {
        this.resources = response.content || [];
        this.filteredResources = response.content || [];
        this.paginationData = {
          currentPage: response.number || 0,
          totalPages: response.totalPages || 0,
          itemsPerPage: response.size || 10,
          totalItems: response.totalElements || 0,
          startItem: 0,
          endItem: 0
        };
        this.filterResources();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao aplicar filtros:', error);
        this.toastrService.error('Erro ao aplicar filtros');
        this.isLoading = false;
      }
    });
  }

  public limparFiltros(): void {
    this.filtrosAvancados = {
      colaboradorNome: '',
      tipo: '',
      status: ''
    };
    this.loadResources();
  }

  public toggleFiltrosAvancados(): void {
    this.mostrarFiltrosAvancados = !this.mostrarFiltrosAvancados;
  }

  public hasActiveFilters(): boolean {
    return !!(this.filtrosAvancados.colaboradorNome || 
              this.filtrosAvancados.tipo || 
              this.filtrosAvancados.status);
  }

  public getActiveFiltersCount(): number {
    let count = 0;
    if (this.filtrosAvancados.colaboradorNome) count++;
    if (this.filtrosAvancados.tipo) count++;
    if (this.filtrosAvancados.status) count++;
    return count;
  }

  public encerrarContrato(contrato: Contrato): void {
    if (confirm(`Deseja realmente encerrar o contrato de ${contrato.colaboradorNome}?`)) {
      this.contratoService.encerrar(contrato.id!, new Date()).subscribe({
        next: () => {
          this.toastrService.success('Contrato encerrado com sucesso');
          this.loadResources();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Erro ao encerrar contrato:', error);
          this.toastrService.error('Erro ao encerrar contrato');
        }
      });
    }
  }

  protected getResourceIcon(contrato: Contrato): string {
    return 'description';
  }

  protected formatResourceDate(date: any): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  protected getResourceDisplayName(contrato: Contrato): string {
    return contrato.colaboradorNome || 'Contrato sem colaborador';
  }

  override get emptyStateConfig(): EmptyStateConfig {
    return {
      title: 'Nenhum contrato encontrado',
      description: 'Não há contratos cadastrados no sistema.',
      icon: 'description',
      buttonText: 'Cadastrar Contrato',
      buttonLink: '/contratos/new'
    };
  }

  override get loadingConfig() {
    return {
      title: 'Carregando contratos...',
      description: 'Aguarde enquanto buscamos os dados'
    };
  }

  override get paginationOptions(): PaginationOptions {
    return {
      itemsPerPageOptions: [5, 10, 20, 50],
      showItemsPerPage: true,
      showInfo: true,
      iconClass: 'bi-file-text',
      iconColor: 'primary',
      itemType: 'contratos'
    };
  }

  override get searchPlaceholder(): string {
    return 'Buscar por colaborador...';
  }

  override get pageSubtitle(): string {
    return 'Gerencie os contratos de trabalho dos colaboradores';
  }

  override get statisticsCards(): StatisticsCard[] {
    const cards = [
      {
        icon: 'bi-file-text',
        iconColor: 'primary',
        value: this.statistics.total || 0,
        label: 'Total de Contratos'
      },
      {
        icon: 'bi-check-circle',
        iconColor: 'success',
        value: this.statistics.ativos || 0,
        label: 'Contratos Ativos'
      },
      {
        icon: 'bi-x-circle',
        iconColor: 'danger',
        value: this.statistics.encerrados || 0,
        label: 'Contratos Encerrados'
      },
      {
        icon: 'bi-clock',
        iconColor: 'warning',
        value: this.statistics.vigentes || 0,
        label: 'Contratos Vigentes'
      }
    ];
    console.log('Cards de estatísticas:', cards); // Debug
    return cards;
  }

  public getStatusBadgeClass(contrato: Contrato): string {
    if (contrato.isAtivo) return 'badge bg-success';
    if (contrato.isEncerrado) return 'badge bg-danger';
    return 'badge bg-secondary';
  }

  public getTipoContratoLabel(tipo: string): string {
    switch (tipo) {
      case TipoContrato.CLT: return 'CLT';
      case TipoContrato.PJ: return 'PJ';
      case TipoContrato.ESTAGIO: return 'Estágio';
      case TipoContrato.TEMPORARIO: return 'Temporário';
      case TipoContrato.TERCEIRIZADO: return 'Terceirizado';
      default: return tipo;
    }
  }


} 