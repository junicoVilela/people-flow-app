import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Cargo, NivelCargoLabels } from "../shared/cargo.model";
import { CargoService } from "../shared/cargo.service";
import { BaseResourceListComponent } from "../../../shared/components/base-resource-list/base-resource-list.component";
import { PaginationService } from "../../../shared/services/pagination.service";
import { SearchService } from "../../../shared/services/search.service";
import { StatisticsService, StatisticsCard } from "../../../shared/services/statistics.service";
import { DeleteModalService } from "../../../shared/services/delete-modal.service";
import { PaginationOptions } from "../../../shared/components/pagination/pagination.component";

import { BreadCrumbComponent } from "../../../shared/components/bread-crumb/bread-crumb.component";
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { ConfirmDeleteModalComponent } from "../../../shared/components/confirm-delete-modal/confirm-delete-modal.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { StatisticsCardsComponent } from "../../../shared/components/statistics-cards/statistics-cards.component";
import { EmptyStateComponent, EmptyStateConfig } from "../../../shared/components/empty-state/empty-state.component";
import { PageLoadingComponent } from "../../../shared/components/page-loading/page-loading.component";
import { ResourceFiltersComponent } from "../../../shared/components/resource-filters/resource-filters.component";

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
export class CargoListComponent extends BaseResourceListComponent<Cargo> {
  
  nivelCargoLabels = NivelCargoLabels;

  constructor(
    private cargoService: CargoService,
    protected override injector: Injector,
    protected override toastrService: ToastrService,
    protected override paginationService: PaginationService,
    protected override searchService: SearchService,
    protected override statisticsService: StatisticsService,
    protected override deleteModalService: DeleteModalService,
    private router: Router,
    private route: ActivatedRoute
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

  override matchesSearch(cargo: Cargo, searchTerm: string): boolean {
    return cargo.nome?.toLowerCase().includes(searchTerm) || 
           cargo.descricao?.toLowerCase().includes(searchTerm) || 
           cargo.departamentoNome?.toLowerCase().includes(searchTerm) ||
           cargo.nivel?.toLowerCase().includes(searchTerm) ||
           false;
  }

  override get pageSubtitle(): string {
    return 'Gerencie os cargos da empresa';
  }

  get totalCargos(): number {
    return this.resources.length;
  }

  get cargosAtivos(): number {
    return this.resources.filter(cargo => cargo.ativo).length;
  }

  get cargosInativos(): number {
    return this.resources.filter(cargo => !cargo.ativo).length;
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