export interface Workshop {
  id: string;
  name: string;
  region: string;
  state: string;
  lat: number;
  lng: number;
}

export interface PartPrice {
  workshopId: string;
  price: number;
}

export interface Part {
  id: string;
  name: string;
  category: "MOTOR" | "TRANSMISSÃO" | "SUSPENSÃO" | "FREIOS" | "ACESSÓRIOS";
  kmUntilWearByModel: { modelId: string; km: number }[];
  prices: PartPrice[];
}

export interface VehicleModel {
  id: string;
  name: string;
  brand: string;
}

export interface StateData {
  state: string;
  vehiclesInMaintenance: number;
  totalVehicles: number;
  vehiclesWithoutDriver: number;
  accidentedVehicles: number;
  correctiveMaintenance: number;
}

export type FleetStatus = 
  | "Administração"
  | "Aguardando Oficina"
  | "Desmobilizado"
  | "Devolução"
  | "Disponível"
  | "Em Oficina - Externo"
  | "Em Oficina - Rentals"
  | "Em Oficina - Trois"
  | "Em Operação"
  | "Falta"
  | "Folga"
  | "Indisponível"
  | "Mobilização"
  | "Pós-Oficina"
  | "PRA Reboque"
  | "Sem Motorista"
  | "Sem Rota"
  | "Sinistrado - PT"
  | "Treinamento"
  | "Veículo Alugado"
  | "Veículo Pronto"
  | "Venda";

export interface Vehicle {
  id: string;
  placa: string; // PLACA
  modelo: string; // MODELO
  fabricante: string; // FABRICANTE
  categoria: string; // CATEGORIA
  tipoFrota: string; // TIPO DE FROTA
  base: string; // BASE
  status: FleetStatus; // STATUS
  motivo: string; // OBS
  entradaOFC: string | null; // ENTRADA OFC
  previsaoSaida: string | null; // PREVISÃO DE SAIDA
  uf: string; // UF
  // Novos campos
  placaReserva?: string; // PLACA RESERVA
  anoFabricacao?: string | number; // ANO FABRICAÇÃO
  ultimoChecklist?: string; // ULTIMO CHECKLIST
  statusMoki?: string; // STATUS MOKI
  geotab?: string; // GEOTAB (SIM/NÃO)
  t4s?: string; // T4S (SIM/NÃO)
  sascar?: string; // SASCAR (SIM/NÃO)
  pooltrack?: string; // POOLTRACK (SIM/NÃO)
  golfleet?: string; // GOLFLEET (SIM/NÃO)
  tipoPlaca?: string; // TIPO DE PLACA (Coluna D)
  gestor?: string; // GESTOR (Coluna AB)
  atuacao?: string; // ATUAÇÃO (Coluna AD)
  tipoFrotaManutencao?: string; // TIPO DE FROTA MANUTENÇÃO (Coluna X)
  resumoStatus?: string; // RESUMO STATUS (Coluna AO)
  // Campos adicionais para compatibilidade
  licensePlate?: string;
  reason?: string;
  entryDate?: string | null;
  returnForecast?: string | null;
  model?: string;
  year?: number;
  driver?: string;
}

export interface FleetFilter {
  licensePlate: string;
  base: string;
  status: string;
}