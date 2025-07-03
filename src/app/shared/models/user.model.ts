import { BaseResourceModel } from "./base-resource.model";

export enum Role {
  ADMIN = 'ADMIN',
  RH = 'RH',
  COLABORADOR = 'COLABORADOR'
}

export class User extends BaseResourceModel {
  constructor(
    public usuarioId?: number,
    public nome?: string,
    public email?: string,
    public role?: Role,
    public token?: string,
    public ativo?: boolean,
    public dataCriacao?: string,
    public dataAtualizacao?: string
  ) {
    super();
  }

  static fromJson(jsonData: any): User {
    return Object.assign(new User(), jsonData);
  }

  get initials(): string {
    if (!this.nome) return 'US';
    const names = this.nome.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  get displayName(): string {
    return this.nome || this.email || 'Usuário';
  }

  get isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  get isRH(): boolean {
    return this.role === Role.RH;
  }

  get isColaborador(): boolean {
    return this.role === Role.COLABORADOR;
  }
} 