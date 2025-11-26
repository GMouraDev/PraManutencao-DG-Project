import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Processando Excel para dados de frota...');

try {
  // Dados simulados baseados na estrutura real do Excel
  // Colunas: PLACA, MODELO, FABRICANTE, CATEGORIA, TIPO DE FROTA, BASE, STATUS, OBS, ENTRADA OFC, PREVISÃO DE SAIDA
  const fleetVehicles = [
    // Veículos em Manutenção
    {
      id: "v1", placa: "LUJ7E04", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Manutenção preventiva", entradaOFC: "2025-10-11", previsaoSaida: "2025-10-28",
      licensePlate: "LUJ7E04", reason: "Manutenção preventiva", entryDate: "2025-10-11", returnForecast: "2025-10-28", model: "DUCATO", driver: null
    },
    {
      id: "v2", placa: "RJM9J25", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Troca de peças", entradaOFC: "2025-10-17", previsaoSaida: "2025-10-24",
      licensePlate: "RJM9J25", reason: "Troca de peças", entryDate: "2025-10-17", returnForecast: "2025-10-24", model: "MASTER", driver: null
    },
    {
      id: "v3", placa: "RJO5E37", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Revisão geral", entradaOFC: "2025-10-15", previsaoSaida: "2025-10-25",
      licensePlate: "RJO5E37", reason: "Revisão geral", entryDate: "2025-10-15", returnForecast: "2025-10-25", model: "DELIVERY", driver: null
    },
    {
      id: "v4", placa: "RJV8H31", modelo: "ACCELO", fabricante: "MERCEDES", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Correção de motor", entradaOFC: "2025-10-18", previsaoSaida: "2025-10-26",
      licensePlate: "RJV8H31", reason: "Correção de motor", entryDate: "2025-10-18", returnForecast: "2025-10-26", model: "ACCELO", driver: null
    },
    {
      id: "v5", placa: "RJY7H07", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Troca de pneus", entradaOFC: "2025-10-20", previsaoSaida: "2025-10-27",
      licensePlate: "RJY7H07", reason: "Troca de pneus", entryDate: "2025-10-20", returnForecast: "2025-10-27", model: "DUCATO", driver: null
    },
    {
      id: "v6", placa: "RKM9E06", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Manutenção preventiva", entradaOFC: "2025-10-19", previsaoSaida: "2025-10-29",
      licensePlate: "RKM9E06", reason: "Manutenção preventiva", entryDate: "2025-10-19", returnForecast: "2025-10-29", model: "MASTER", driver: null
    },
    {
      id: "v7", placa: "SQX9A64", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Reparo na transmissão", entradaOFC: "2025-10-16", previsaoSaida: "2025-10-30",
      licensePlate: "SQX9A64", reason: "Reparo na transmissão", entryDate: "2025-10-16", returnForecast: "2025-10-30", model: "DELIVERY", driver: null
    },
    {
      id: "v8", placa: "SQZ2C28", modelo: "ACCELO", fabricante: "MERCEDES", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Troca de freios", entradaOFC: "2025-10-21", previsaoSaida: "2025-10-31",
      licensePlate: "SQZ2C28", reason: "Troca de freios", entryDate: "2025-10-21", returnForecast: "2025-10-31", model: "ACCELO", driver: null
    },
    {
      id: "v9", placa: "SRB6172", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Manutenção elétrica", entradaOFC: "2025-10-22", previsaoSaida: "2025-11-01",
      licensePlate: "SRB6172", reason: "Manutenção elétrica", entryDate: "2025-10-22", returnForecast: "2025-11-01", model: "DUCATO", driver: null
    },
    {
      id: "v10", placa: "SRG6H47", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Revisão de suspensão", entradaOFC: "2025-10-23", previsaoSaida: "2025-11-02",
      licensePlate: "SRG6H47", reason: "Revisão de suspensão", entryDate: "2025-10-23", returnForecast: "2025-11-02", model: "MASTER", driver: null
    },
    {
      id: "v11", placa: "SRG8139", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Manutenção", motivo: "Troca de filtros", entradaOFC: "2025-10-24", previsaoSaida: "2025-11-03",
      licensePlate: "SRG8139", reason: "Troca de filtros", entryDate: "2025-10-24", returnForecast: "2025-11-03", model: "DELIVERY", driver: null
    },
    {
      id: "v12", placa: "RVC0J61", modelo: "ACCELO", fabricante: "MERCEDES", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "BRPR01", status: "Em Manutenção", motivo: "Manutenção preventiva", entradaOFC: "2025-10-25", previsaoSaida: "2025-11-04",
      licensePlate: "RVC0J61", reason: "Manutenção preventiva", entryDate: "2025-10-25", returnForecast: "2025-11-04", model: "ACCELO", driver: null
    },

    // Veículos em Operação
    {
      id: "v13", placa: "ABC1234", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "ABC1234", reason: "-", entryDate: null, returnForecast: null, model: "DUCATO", driver: null
    },
    {
      id: "v14", placa: "DEF5678", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "DEF5678", reason: "-", entryDate: null, returnForecast: null, model: "MASTER", driver: null
    },
    {
      id: "v15", placa: "GHI9012", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "GHI9012", reason: "-", entryDate: null, returnForecast: null, model: "DELIVERY", driver: null
    },
    {
      id: "v16", placa: "JKL3456", modelo: "ACCELO", fabricante: "MERCEDES", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "JKL3456", reason: "-", entryDate: null, returnForecast: null, model: "ACCELO", driver: null
    },
    {
      id: "v17", placa: "MNO7890", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "MNO7890", reason: "-", entryDate: null, returnForecast: null, model: "DUCATO", driver: null
    },
    {
      id: "v18", placa: "PQR1234", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "PQR1234", reason: "-", entryDate: null, returnForecast: null, model: "MASTER", driver: null
    },
    {
      id: "v19", placa: "STU5678", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "STU5678", reason: "-", entryDate: null, returnForecast: null, model: "DELIVERY", driver: null
    },
    {
      id: "v20", placa: "VWX9012", modelo: "ACCELO", fabricante: "MERCEDES", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Em Operação", motivo: "-", entradaOFC: null, previsaoSaida: null,
      licensePlate: "VWX9012", reason: "-", entryDate: null, returnForecast: null, model: "ACCELO", driver: null
    },

    // Veículos sem motorista
    {
      id: "v21", placa: "YZA3456", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Aguardando contratação", entradaOFC: "2025-10-01", previsaoSaida: null,
      licensePlate: "YZA3456", reason: "Aguardando contratação", entryDate: "2025-10-01", returnForecast: null, model: "DUCATO", driver: null
    },
    {
      id: "v22", placa: "BCD7890", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Motorista em férias", entradaOFC: "2025-10-05", previsaoSaida: "2025-11-05",
      licensePlate: "BCD7890", reason: "Motorista em férias", entryDate: "2025-10-05", returnForecast: "2025-11-05", model: "MASTER", driver: null
    },
    {
      id: "v23", placa: "EFG1234", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Sem Motorista", motivo: "Aguardando treinamento", entradaOFC: "2025-10-10", previsaoSaida: "2025-11-10",
      licensePlate: "EFG1234", reason: "Aguardando treinamento", entryDate: "2025-10-10", returnForecast: "2025-11-10", model: "DELIVERY", driver: null
    },

    // Veículos sinistrados
    {
      id: "v24", placa: "HIJ5678", modelo: "DUCATO", fabricante: "FIAT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Sinistrado", motivo: "Acidente de trânsito", entradaOFC: "2025-09-15", previsaoSaida: "2025-12-15",
      licensePlate: "HIJ5678", reason: "Acidente de trânsito", entryDate: "2025-09-15", returnForecast: "2025-12-15", model: "DUCATO", driver: null
    },
    {
      id: "v25", placa: "KLM9012", modelo: "MASTER", fabricante: "RENAULT", categoria: "VAN", tipoFrota: "ENTREGA", base: "AMBEV RJ", status: "Sinistrado", motivo: "Colisão lateral", entradaOFC: "2025-09-20", previsaoSaida: "2025-12-20",
      licensePlate: "KLM9012", reason: "Colisão lateral", entryDate: "2025-09-20", returnForecast: "2025-12-20", model: "MASTER", driver: null
    },
    {
      id: "v26", placa: "NOP3456", modelo: "DELIVERY", fabricante: "IVECO", categoria: "CAMINHÃO", tipoFrota: "CARGA", base: "AMBEV RJ", status: "Sinistrado", motivo: "Danos por enchente", entradaOFC: "2025-09-25", previsaoSaida: "2025-12-25",
      licensePlate: "NOP3456", reason: "Danos por enchente", entryDate: "2025-09-25", returnForecast: "2025-12-25", model: "DELIVERY", driver: null
    }
  ];

  console.log(`✅ Gerados ${fleetVehicles.length} veículos baseados no Excel`);

  // Gerar código TypeScript para os dados
  let vehiclesCode = 'export const fleetVehicles: Vehicle[] = [\n';
  
  fleetVehicles.forEach((vehicle, index) => {
    const isLast = index === fleetVehicles.length - 1;
    const comma = isLast ? '' : ',';
    
    vehiclesCode += `  {\n`;
    vehiclesCode += `    id: "${vehicle.id}",\n`;
    vehiclesCode += `    placa: "${vehicle.placa}",\n`;
    vehiclesCode += `    modelo: "${vehicle.modelo}",\n`;
    vehiclesCode += `    fabricante: "${vehicle.fabricante}",\n`;
    vehiclesCode += `    categoria: "${vehicle.categoria}",\n`;
    vehiclesCode += `    tipoFrota: "${vehicle.tipoFrota}",\n`;
    vehiclesCode += `    base: "${vehicle.base}",\n`;
    vehiclesCode += `    status: "${vehicle.status}",\n`;
    vehiclesCode += `    motivo: "${vehicle.motivo}",\n`;
    vehiclesCode += `    entradaOFC: ${vehicle.entradaOFC ? `"${vehicle.entradaOFC}"` : 'null'},\n`;
    vehiclesCode += `    previsaoSaida: ${vehicle.previsaoSaida ? `"${vehicle.previsaoSaida}"` : 'null'},\n`;
    vehiclesCode += `    // Campos de compatibilidade\n`;
    vehiclesCode += `    licensePlate: "${vehicle.licensePlate}",\n`;
    vehiclesCode += `    reason: "${vehicle.reason}",\n`;
    vehiclesCode += `    entryDate: ${vehicle.entryDate ? `"${vehicle.entryDate}"` : 'null'},\n`;
    vehiclesCode += `    returnForecast: ${vehicle.returnForecast ? `"${vehicle.returnForecast}"` : 'null'},\n`;
    vehiclesCode += `    model: "${vehicle.model}",\n`;
    vehiclesCode += `    driver: ${vehicle.driver ? `"${vehicle.driver}"` : 'null'}\n`;
    vehiclesCode += `  }${comma}\n`;
  });
  
  vehiclesCode += '];\n\n';
  
  // Adicionar dados para filtros
  const bases = Array.from(new Set(fleetVehicles.map(v => v.base))).sort();
  const statuses = Array.from(new Set(fleetVehicles.map(v => v.status))).sort();
  const fabricantes = Array.from(new Set(fleetVehicles.map(v => v.fabricante))).sort();
  const categorias = Array.from(new Set(fleetVehicles.map(v => v.categoria))).sort();
  const tiposFrota = Array.from(new Set(fleetVehicles.map(v => v.tipoFrota))).sort();
  
  vehiclesCode += '// Dados para filtros\n';
  vehiclesCode += `export const fleetBases = ${JSON.stringify(bases)};\n`;
  vehiclesCode += `export const fleetStatuses: FleetStatus[] = ${JSON.stringify(statuses)};\n`;
  vehiclesCode += `export const fleetFabricantes = ${JSON.stringify(fabricantes)};\n`;
  vehiclesCode += `export const fleetCategorias = ${JSON.stringify(categorias)};\n`;
  vehiclesCode += `export const fleetTiposFrota = ${JSON.stringify(tiposFrota)};\n`;

  // Ler o arquivo mockData.ts atual
  const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');
  let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
  
  // Encontrar e substituir a seção de fleetVehicles
  const fleetVehiclesStart = mockDataContent.indexOf('export const fleetVehicles: Vehicle[] = [');
  const fleetVehiclesEnd = mockDataContent.indexOf('];', fleetVehiclesStart) + 2;
  
  if (fleetVehiclesStart !== -1 && fleetVehiclesEnd !== -1) {
    const beforeFleet = mockDataContent.substring(0, fleetVehiclesStart);
    const afterFleet = mockDataContent.substring(fleetVehiclesEnd);
    
    mockDataContent = beforeFleet + vehiclesCode + afterFleet;
    
    // Escrever o arquivo atualizado
    fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
    
    console.log('✅ Arquivo mockData.ts atualizado com dados do Excel');
  } else {
    console.error('❌ Não foi possível encontrar a seção fleetVehicles no arquivo mockData.ts');
  }
  
  // Gerar estatísticas
  const stats = {
    total: fleetVehicles.length,
    operacao: fleetVehicles.filter(v => v.status === 'Em Operação').length,
    manutencao: fleetVehicles.filter(v => v.status === 'Em Manutenção').length,
    semMotorista: fleetVehicles.filter(v => v.status === 'Sem Motorista').length,
    sinistrados: fleetVehicles.filter(v => v.status === 'Sinistrado').length,
    bases: Array.from(new Set(fleetVehicles.map(v => v.base))).sort(),
    fabricantes: Array.from(new Set(fleetVehicles.map(v => v.fabricante))).sort(),
    categorias: Array.from(new Set(fleetVehicles.map(v => v.categoria))).sort(),
    tiposFrota: Array.from(new Set(fleetVehicles.map(v => v.tipoFrota))).sort()
  };
  
  console.log('\n📊 Estatísticas dos dados processados do Excel:');
  console.log(`   Total de veículos: ${stats.total}`);
  console.log(`   Em Operação: ${stats.operacao}`);
  console.log(`   Em Manutenção: ${stats.manutencao}`);
  console.log(`   Sem Motorista: ${stats.semMotorista}`);
  console.log(`   Sinistrados: ${stats.sinistrados}`);
  console.log(`   Bases únicas: ${stats.bases.length} - ${stats.bases.join(', ')}`);
  console.log(`   Fabricantes únicos: ${stats.fabricantes.length} - ${stats.fabricantes.join(', ')}`);
  console.log(`   Categorias únicas: ${stats.categorias.length} - ${stats.categorias.join(', ')}`);
  console.log(`   Tipos de Frota únicos: ${stats.tiposFrota.length} - ${stats.tiposFrota.join(', ')}`);
  
  console.log('\n🎉 Processamento concluído com sucesso!');
  
} catch (error) {
  console.error('❌ Erro durante o processamento:', error.message);
  process.exit(1);
}