import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Colaborador } from "../shared/colaborador.model";
import { ColaboradorService } from "../shared/colaborador.service";
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
export class ColaboradorListComponent extends BaseResourceListComponent<Colaborador> {
  
  constructor(
    private colaboradorService: ColaboradorService,
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
      colaboradorService, 
      injector, 
      toastrService, 
      paginationService, 
      searchService, 
      statisticsService, 
      deleteModalService
    );
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

  override matchesSearch(colaborador: Colaborador, searchTerm: string): boolean {
    return colaborador.nome?.toLowerCase().includes(searchTerm) || 
           colaborador.email?.toLowerCase().includes(searchTerm) || 
           colaborador.cpf?.includes(searchTerm) ||
           colaborador.cargo?.toLowerCase().includes(searchTerm) ||
           colaborador.departamento?.toLowerCase().includes(searchTerm) ||
           false;
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