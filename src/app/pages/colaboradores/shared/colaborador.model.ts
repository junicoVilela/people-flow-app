import { BaseResourceModel } from "../../../shared/models/base-resource.model";

export class Colaborador extends BaseResourceModel {
    constructor(
        public nome?: string,
        public email?: string,
        public cpf?: string,
        public rg?: string,
        public dataNascimento?: Date,
        public sexo?: string,
        public telefone?: string,
        public estadoCivil?: string,
        public endereco?: string,
        public cargo?: string,
        public departamento?: string,
        public cargoId?: number,
        public departamentoId?: number,
        public salario?: number,
        public dataAdmissao?: Date,
        public dataDemissao?: Date,
        public status?: string,
        public dataCriacao?: Date,
        public dataAtualizacao?: Date
    ) {
        super();
    }

    static fromJson(jsonData: any): Colaborador {
        return Object.assign(new Colaborador(), jsonData);
    }
} 