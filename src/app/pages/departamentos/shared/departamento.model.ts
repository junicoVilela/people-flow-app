import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export class Departamento extends BaseResourceModel {
    nome?: string;
    descricao?: string;
    ativo?: boolean;
    quantidadeCargos?: number;

    static fromJson(jsonData: any): Departamento {
        return Object.assign(new Departamento(), jsonData);
    }
}

export interface DepartamentoFilter {
    nome?: string;
} 