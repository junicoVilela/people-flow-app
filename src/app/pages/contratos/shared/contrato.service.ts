import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { Contrato, StatusContrato, TipoContrato } from './contrato.model';

export interface ContratoFilter {
  colaboradorNome?: string;
  tipo?: string;
  status?: string;
}

export interface ContratoStatistics {
  total: number;
  ativos: number;
  inativos: number;
  suspensos: number;
  encerrados: number;
  vigentes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContratoService extends BaseResourceService<Contrato> {

  constructor(protected override injector: Injector) {
    super("contratos", injector, Contrato.fromJson);
  }



  // Dados mock para demonstração
  private mockContratos: Contrato[] = [
    Object.assign(new Contrato(), {
      id: 1, colaboradorId: 1, colaboradorNome: 'João Silva',
      tipo: TipoContrato.CLT, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-01-15'), dataFim: new Date('2025-01-15'),
      salario: 3500.00, cargaHoraria: 40, observacoes: 'Contrato CLT padrão'
    }),
    Object.assign(new Contrato(), {
      id: 2, colaboradorId: 2, colaboradorNome: 'Maria Santos',
      tipo: TipoContrato.PJ, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-02-01'), dataFim: new Date('2024-12-31'),
      salario: 5000.00, cargaHoraria: 40, observacoes: 'Contrato PJ'
    }),
    Object.assign(new Contrato(), {
      id: 3, colaboradorId: 3, colaboradorNome: 'Pedro Costa',
      tipo: TipoContrato.ESTAGIO, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-03-01'), dataFim: new Date('2024-12-31'),
      salario: 1200.00, cargaHoraria: 30, observacoes: 'Estágio em desenvolvimento'
    }),
    Object.assign(new Contrato(), {
      id: 4, colaboradorId: 4, colaboradorNome: 'Ana Oliveira',
      tipo: TipoContrato.CLT, status: StatusContrato.ENCERRADO,
      dataInicio: new Date('2023-06-01'), dataFim: new Date('2024-05-31'),
      salario: 2800.00, cargaHoraria: 40, observacoes: 'Contrato encerrado'
    }),
    Object.assign(new Contrato(), {
      id: 5, colaboradorId: 5, colaboradorNome: 'Carlos Lima',
      tipo: TipoContrato.TEMPORARIO, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-01-01'), dataFim: new Date('2024-06-30'),
      salario: 2500.00, cargaHoraria: 40, observacoes: 'Contrato temporário'
    }),
    Object.assign(new Contrato(), {
      id: 6, colaboradorId: 6, colaboradorNome: 'Lucia Ferreira',
      tipo: TipoContrato.CLT, status: StatusContrato.ATIVO,
      dataInicio: new Date('2023-12-01'), dataFim: new Date('2025-12-01'),
      salario: 4200.00, cargaHoraria: 40, observacoes: 'Analista de RH'
    }),
    Object.assign(new Contrato(), {
      id: 7, colaboradorId: 7, colaboradorNome: 'Roberto Alves',
      tipo: TipoContrato.PJ, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-04-15'), dataFim: new Date('2025-04-15'),
      salario: 6000.00, cargaHoraria: 40, observacoes: 'Desenvolvedor Senior'
    }),
    Object.assign(new Contrato(), {
      id: 8, colaboradorId: 8, colaboradorNome: 'Fernanda Rocha',
      tipo: TipoContrato.CLT, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-05-01'), dataFim: new Date('2025-05-01'),
      salario: 3800.00, cargaHoraria: 40, observacoes: 'Designer UX/UI'
    }),
    Object.assign(new Contrato(), {
      id: 9, colaboradorId: 9, colaboradorNome: 'Marcos Silva',
      tipo: TipoContrato.ESTAGIO, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-06-01'), dataFim: new Date('2024-12-31'),
      salario: 1000.00, cargaHoraria: 20, observacoes: 'Estágio em marketing'
    }),
    Object.assign(new Contrato(), {
      id: 10, colaboradorId: 10, colaboradorNome: 'Juliana Costa',
      tipo: TipoContrato.TERCEIRIZADO, status: StatusContrato.ATIVO,
      dataInicio: new Date('2024-03-15'), dataFim: new Date('2025-03-15'),
      salario: 3200.00, cargaHoraria: 40, observacoes: 'Contrato terceirizado'
    })
  ];

  override getAll(): Observable<Contrato[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next([...this.mockContratos]);
        observer.complete();
      }, 300);
    });
  }

  override getById(id: number): Observable<Contrato> {
    const contrato = this.mockContratos.find(c => c.id === id);
    return new Observable(observer => {
      setTimeout(() => {
        if (contrato) {
          observer.next(contrato);
        } else {
          observer.error('Contrato não encontrado');
        }
        observer.complete();
      }, 300);
    });
  }

  override create(resource: Contrato): Observable<Contrato> {
    const novoContrato = new Contrato();
    Object.assign(novoContrato, {
      ...resource,
      id: Math.max(...this.mockContratos.map(c => c.id || 0)) + 1,
      dataCriacao: new Date()
    });
    this.mockContratos.push(novoContrato);
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(novoContrato);
        observer.complete();
      }, 500);
    });
  }

  override update(resource: Contrato): Observable<Contrato> {
    const index = this.mockContratos.findIndex(c => c.id === resource.id);
    if (index !== -1) {
      Object.assign(this.mockContratos[index], { ...resource, dataAtualizacao: new Date() });
    }
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.mockContratos[index]);
        observer.complete();
      }, 500);
    });
  }

  override delete(id: number): Observable<void> {
    const index = this.mockContratos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockContratos.splice(index, 1);
    }
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 500);
    });
  }

  getAllWithFilters(filter: ContratoFilter, page: number = 0, size: number = 10): Observable<any> {
    let filteredContratos = this.mockContratos.filter(contrato => {
      if (filter.colaboradorNome && !contrato.colaboradorNome?.toLowerCase().includes(filter.colaboradorNome.toLowerCase())) return false;
      if (filter.tipo && contrato.tipo !== filter.tipo) return false;
      if (filter.status && contrato.status !== filter.status) return false;
      return true;
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedContratos = filteredContratos.slice(startIndex, endIndex);

    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          content: paginatedContratos,
          totalElements: filteredContratos.length,
          totalPages: Math.ceil(filteredContratos.length / size),
          size: size,
          number: page
        });
        observer.complete();
      }, 300);
    });
  }

  encerrar(id: number, dataEncerramento: Date): Observable<void> {
    const contrato = this.mockContratos.find(c => c.id === id);
    if (contrato) {
      contrato.status = StatusContrato.ENCERRADO;
      contrato.dataFim = dataEncerramento;
    }
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 500);
    });
  }

  getQuantidadePorStatus(status: string): Observable<number> {
    const count = this.mockContratos.filter(c => c.status === status).length;
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(count);
        observer.complete();
      }, 100);
    });
  }

  getStatistics(): Observable<ContratoStatistics> {
    const ativos = this.mockContratos.filter(c => c.isAtivo).length;
    const encerrados = this.mockContratos.filter(c => c.isEncerrado).length;
    const vigentes = this.mockContratos.filter(c => c.isVigente).length;
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          total: this.mockContratos.length,
          ativos,
          inativos: 0, // Não temos contratos inativos no mock
          suspensos: 0, // Não temos contratos suspensos no mock
          encerrados,
          vigentes
        });
        observer.complete();
      }, 300);
    });
  }
} 