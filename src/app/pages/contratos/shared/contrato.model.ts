import { BaseResourceModel } from "../../../shared/models/base-resource.model";

export enum TipoContrato {
    CLT = 'CLT',
    PJ = 'PJ',
    ESTAGIO = 'ESTAGIO',
    TEMPORARIO = 'TEMPORARIO',
    TERCEIRIZADO = 'TERCEIRIZADO'
}

export enum StatusContrato {
    ATIVO = 'ATIVO',
    ENCERRADO = 'ENCERRADO'
}

export class Contrato extends BaseResourceModel {
    constructor(
        public colaboradorId?: number,
        public colaboradorNome?: string,
        public tipo?: TipoContrato | string,
        public dataInicio?: Date,
        public dataFim?: Date,
        public salario?: number,
        public cargaHoraria?: number,
        public status?: StatusContrato | string,
        public observacoes?: string,
    ) {
        super();
    }

    static fromJson(jsonData: any): Contrato {
        return Object.assign(new Contrato(), jsonData);
    }

    get isAtivo(): boolean {
        return this.status === StatusContrato.ATIVO || this.status === 'ATIVO';
    }

    get isEncerrado(): boolean {
        return this.status === StatusContrato.ENCERRADO || this.status === 'ENCERRADO';
    }

    get isVigente(): boolean {
        const hoje = new Date();
        const dataInicio = this.dataInicio ? new Date(this.dataInicio) : null;
        const dataFim = this.dataFim ? new Date(this.dataFim) : null;
        
        if (!dataInicio) return false;
        if (dataInicio > hoje) return false;
        if (dataFim && dataFim < hoje) return false;
        
        return this.isAtivo;
    }
} 