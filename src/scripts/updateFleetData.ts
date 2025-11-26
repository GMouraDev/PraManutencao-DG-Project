import { Vehicle, FleetStatus } from '../types/fleet';

// Dados baseados na estrutura real da planilha Excel
// Estes dados representam o que seria extraído da aba "Base Frota - Pralog"
const excelFleetData = [
  // Veículos em Oficina (baseados na tela mostrada)
  { placa: "LUJ7E04", base: "AMBEV RJ", status: "Em Oficina - Externo", motivo: "Manutenção preventiva", entrada: "2025-10-11", previsao_retorno: "2025-10-28", modelo: "DUCATO", ano: 2022, motorista: "João Silva" },
  { placa: "RJM9J25", base: "AMBEV RJ", status: "Em Oficina - Rentals", motivo: "Troca de peças", entrada: "2025-10-17", previsao_retorno: "2025-10-24", modelo: "MASTER", ano: 2021, motorista: "Maria Santos" },
  { placa: "RJO5E37", base: "AMBEV RJ", status: "Em Oficina - Trois", motivo: "Revisão geral", entrada: "2025-10-15", previsao_retorno: "2025-10-25", modelo: "DELIVERY", ano: 2023, motorista: "Pedro Costa" },
  { placa: "RJV8H31", base: "AMBEV RJ", status: "Em Oficina - Externo", motivo: "Correção de motor", entrada: "2025-10-18", previsao_retorno: "2025-10-26", modelo: "ACCELO", ano: 2022, motorista: "Ana Oliveira" },
  { placa: "RJY7H07", base: "AMBEV RJ", status: "Em Oficina - Rentals", motivo: "Troca de pneus", entrada: "2025-10-20", previsao_retorno: "2025-10-27", modelo: "DUCATO", ano: 2021, motorista: "Carlos Lima" },
  { placa: "RKM9E06", base: "AMBEV RJ", status: "Em Oficina - Trois", motivo: "Manutenção preventiva", entrada: "2025-10-19", previsao_retorno: "2025-10-29", modelo: "MASTER", ano: 2023, motorista: "Lucia Ferreira" },
  { placa: "SQX9A64", base: "AMBEV RJ", status: "Em Oficina - Externo", motivo: "Reparo na transmissão", entrada: "2025-10-16", previsao_retorno: "2025-10-30", modelo: "DELIVERY", ano: 2022, motorista: "Roberto Alves" },
  { placa: "SQZ2C28", base: "AMBEV RJ", status: "Em Oficina - Rentals", motivo: "Troca de freios", entrada: "2025-10-21", previsao_retorno: "2025-10-31", modelo: "ACCELO", ano: 2021, motorista: "Fernanda Rocha" },
  { placa: "SRB6172", base: "AMBEV RJ", status: "Em Oficina - Trois", motivo: "Manutenção elétrica", entrada: "2025-10-22", previsao_retorno: "2025-11-01", modelo: "DUCATO", ano: 2023, motorista: "Marcos Pereira" },
  { placa: "SRG6H47", base: "AMBEV RJ", status: "Em Oficina - Externo", motivo: "Revisão de suspensão", entrada: "2025-10-23", previsao_retorno: "2025-11-02", modelo: "MASTER", ano: 2022, motorista: "Patricia Souza" },
  { placa: "SRG8139", base: "AMBEV RJ", status: "Em Oficina - Rentals", motivo: "Troca de filtros", entrada: "2025-10-24", previsao_retorno: "2025-11-03", modelo: "DELIVERY", ano: 2021, motorista: "Antonio Silva" },
  { placa: "RVC0J61", base: "BRPR01", status: "Em Oficina - Trois", motivo: "Manutenção preventiva", entrada: "2025-10-25", previsao_retorno: "2025-11-04", modelo: "ACCELO", ano: 2023, motorista: "Juliana Costa" },

  // Veículos em Operação (baseados na tela mostrada)
  { placa: "ABC1234", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DUCATO", ano: 2023, motorista: "José Santos" },
  { placa: "DEF5678", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "MASTER", ano: 2022, motorista: "Mariana Lima" },
  { placa: "GHI9012", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DELIVERY", ano: 2021, motorista: "Rafael Oliveira" },
  { placa: "JKL3456", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "ACCELO", ano: 2023, motorista: "Camila Ferreira" },
  { placa: "MNO7890", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DUCATO", ano: 2022, motorista: "Diego Alves" },
  { placa: "PQR1234", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "MASTER", ano: 2021, motorista: "Beatriz Rocha" },
  { placa: "STU5678", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DELIVERY", ano: 2023, motorista: "Gabriel Pereira" },
  { placa: "VWX9012", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "ACCELO", ano: 2022, motorista: "Larissa Souza" },
  { placa: "YZA3456", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DUCATO", ano: 2021, motorista: "Paulo Silva" },
  { placa: "BCD7890", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "MASTER", ano: 2023, motorista: "Renata Costa" },
  { placa: "EFG1234", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DELIVERY", ano: 2022, motorista: "Felipe Oliveira" },
  { placa: "HIJ5678", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "ACCELO", ano: 2021, motorista: "Carla Mendes" },
  { placa: "KLM9012", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DUCATO", ano: 2023, motorista: "André Santos" },
  { placa: "NOP3456", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "MASTER", ano: 2022, motorista: "Luciana Lima" },
  { placa: "QRS7890", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DELIVERY", ano: 2021, motorista: "Rodrigo Costa" },
  { placa: "TUV1234", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "ACCELO", ano: 2023, motorista: "Patricia Alves" },
  { placa: "WXY5678", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DUCATO", ano: 2022, motorista: "Marcos Rocha" },
  { placa: "ZAB9012", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "MASTER", ano: 2021, motorista: "Fernanda Silva" },
  { placa: "CDE3456", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "DELIVERY", ano: 2023, motorista: "Roberto Oliveira" },
  { placa: "FGH7890", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entrada: "-", previsao_retorno: "-", modelo: "ACCELO", ano: 2022, motorista: "Silvia Pereira" },

  // Veículos sem motorista
  { placa: "IJK1234", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Aguardando contratação", entrada: "2025-10-01", previsao_retorno: null, modelo: "DUCATO", ano: 2023, motorista: null },
  { placa: "LMN5678", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Motorista em férias", entrada: "2025-10-05", previsao_retorno: "2025-11-05", modelo: "MASTER", ano: 2022, motorista: null },
  { placa: "OPQ9012", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Aguardando treinamento", entrada: "2025-10-10", previsao_retorno: "2025-11-10", modelo: "DELIVERY", ano: 2021, motorista: null },
  { placa: "RST3456", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Motorista licenciado", entrada: "2025-10-12", previsao_retorno: "2025-11-12", modelo: "ACCELO", ano: 2023, motorista: null },
  { placa: "UVW7890", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Aguardando documentação", entrada: "2025-10-14", previsao_retorno: "2025-11-14", modelo: "DUCATO", ano: 2022, motorista: null },

  // Veículos sinistrados
  { placa: "XYZ1234", base: "AMBEV RJ", status: "Sinistrado - PT", motivo: "Acidente de trânsito", entrada: "2025-09-15", previsao_retorno: "2025-12-15", modelo: "DUCATO", ano: 2022, motorista: "Paulo Silva" },
  { placa: "ABC5678", base: "AMBEV RJ", status: "Sinistrado - PT", motivo: "Colisão lateral", entrada: "2025-09-20", previsao_retorno: "2025-12-20", modelo: "MASTER", ano: 2021, motorista: "Renata Costa" },
  { placa: "DEF9012", base: "AMBEV RJ", status: "Sinistrado - PT", motivo: "Danos por enchente", entrada: "2025-09-25", previsao_retorno: "2025-12-25", modelo: "DELIVERY", ano: 2023, motorista: "Felipe Oliveira" },
  { placa: "GHI3456", base: "AMBEV RJ", status: "Sinistrado - PT", motivo: "Incêndio", entrada: "2025-09-30", previsao_retorno: "2025-12-30", modelo: "ACCELO", ano: 2022, motorista: "Carla Mendes" },
  { placa: "JKL7890", base: "AMBEV RJ", status: "Sinistrado - PT", motivo: "Roubo", entrada: "2025-10-01", previsao_retorno: "2026-01-01", modelo: "DUCATO", ano: 2021, motorista: "André Santos" }
];

function convertExcelDataToVehicles(): Vehicle[] {
  return excelFleetData.map((data, index) => ({
    id: `v${index + 1}`,
    placa: data.placa,
    modelo: data.modelo,
    fabricante: "FIAT",
    categoria: "VUC",
    tipoFrota: "Própria",
    base: data.base,
    status: data.status as FleetStatus,
    motivo: data.motivo === "-" ? "-" : data.motivo,
    entradaOFC: data.entrada === "-" ? null : data.entrada,
    previsaoSaida: data.previsao_retorno === "-" ? null : data.previsao_retorno,
    uf: "RJ",
    licensePlate: data.placa,
    reason: data.motivo === "-" ? "-" : data.motivo,
    entryDate: data.entrada === "-" ? null : data.entrada,
    returnForecast: data.previsao_retorno === "-" ? null : data.previsao_retorno,
    model: data.modelo,
    year: data.ano,
    driver: data.motorista
  }));
}

export function generateFleetDataFromExcel(): Vehicle[] {
  console.log('🔄 Gerando dados de frota baseados no Excel...');
  const vehicles = convertExcelDataToVehicles();
  
  console.log(`✅ Gerados ${vehicles.length} veículos baseados no Excel`);
  
  // Estatísticas
  const stats = {
    total: vehicles.length,
    operacao: vehicles.filter(v => v.status === 'Em Operação').length,
    manutencao: vehicles.filter(v => 
      v.status === 'Em Oficina - Externo' || 
      v.status === 'Em Oficina - Rentals' || 
      v.status === 'Em Oficina - Trois'
    ).length,
    semMotorista: vehicles.filter(v => v.status === 'Sem Motorista').length,
    sinistrados: vehicles.filter(v => v.status === 'Sinistrado - PT').length,
    bases: Array.from(new Set(vehicles.map(v => v.base))).sort()
  };
  
  console.log('\n📊 Estatísticas dos dados do Excel:');
  console.log(`   Total de veículos: ${stats.total}`);
  console.log(`   Em Operação: ${stats.operacao}`);
  console.log(`   Em Oficina: ${stats.manutencao}`);
  console.log(`   Sem Motorista: ${stats.semMotorista}`);
  console.log(`   Sinistrados: ${stats.sinistrados}`);
  console.log(`   Bases únicas: ${stats.bases.length}`);
  console.log(`   Bases: ${stats.bases.join(', ')}`);
  
  return vehicles;
}

// Estatísticas
function generateStats(vehicles: Vehicle[]) {
  return {
    total: vehicles.length,
    operacao: vehicles.filter(v => v.status === 'Em Operação').length,
    manutencao: vehicles.filter(v => 
      v.status === 'Em Oficina - Externo' || 
      v.status === 'Em Oficina - Rentals' || 
      v.status === 'Em Oficina - Trois'
    ).length,
    semMotorista: vehicles.filter(v => v.status === 'Sem Motorista').length,
    sinistrados: vehicles.filter(v => v.status === 'Sinistrado - PT').length,
    bases: Array.from(new Set(vehicles.map(v => v.base))).sort()
  };
}

// Dados para filtros baseados no Excel
export function getFleetBasesFromExcel(): string[] {
  return Array.from(new Set(excelFleetData.map(v => v.base))).sort();
}

export function getFleetStatusesFromExcel(): FleetStatus[] {
  return Array.from(new Set(excelFleetData.map(v => v.status as FleetStatus))).sort();
}
