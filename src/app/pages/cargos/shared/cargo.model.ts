import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export class Cargo extends BaseResourceModel {
    nome?: string;
    descricao?: string;
    nivel?: NivelCargo;
    departamentoId?: number;
    departamentoNome?: string;
    salarioBase?: number;
    ativo?: boolean;

    static fromJson(jsonData: any): Cargo {
        return Object.assign(new Cargo(), jsonData);
    }
}

export enum NivelCargo {
    JUNIOR = 'JUNIOR',
    PLENO = 'PLENO',
    SENIOR = 'SENIOR'
}

export const NivelCargoLabels = {
    [NivelCargo.JUNIOR]: 'Júnior',
    [NivelCargo.PLENO]: 'Pleno',
    [NivelCargo.SENIOR]: 'Sênior'
};

export interface CargoFilter {
    nome?: string;
    departamento?: string;
    status?: string;
} 