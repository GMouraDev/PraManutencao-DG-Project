export type VehicleStatus = "operacao" | "manutencao" | "sem_motorista" | "sinistro";

export interface Vehicle {
  placa: string;
  base: string;
  status: VehicleStatus;
  motivoManutencao?: string;
  dataEntradaManutencao?: string;
  previsaoRetorno?: string;
}

export interface BaseInfo {
  nome: string;
  totalVeiculos: number;
  veiculosManutencao: number;
  veiculosSemMotorista: number;
  placas: string[];
}
