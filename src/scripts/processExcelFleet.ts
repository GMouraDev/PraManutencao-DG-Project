import { processFleetExcel } from '../utils/excelProcessor';
import { Vehicle, FleetStatus } from '../types/fleet';
import * as fs from 'fs';
import * as path from 'path';

async function processExcelAndUpdateMockData() {
  try {
    console.log('🔄 Iniciando processamento do Excel...');
    
    // Processar dados do Excel real
    const vehicles = await processFleetExcel();
    
    console.log(`✅ Processados ${vehicles.length} veículos do Excel`);
    
    // Gerar código TypeScript para os dados
    const vehiclesCode = generateVehiclesCode(vehicles);
    
    // Ler o arquivo mockData.ts atual
    const mockDataPath = path.join(__dirname, '../data/mockData.ts');
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
      
      console.log('✅ Arquivo mockData.ts atualizado com dados reais do Excel');
    } else {
      console.error('❌ Não foi possível encontrar a seção fleetVehicles no arquivo mockData.ts');
    }
    
    // Gerar estatísticas
    const stats = generateStats(vehicles);
    console.log('\n📊 Estatísticas dos dados processados do Excel:');
    console.log(`   Total de veículos: ${stats.total}`);
    console.log(`   Em Operação: ${stats.operacao}`);
    console.log(`   Em Manutenção: ${stats.manutencao}`);
    console.log(`   Sem Motorista: ${stats.semMotorista}`);
    console.log(`   Sinistrados: ${stats.sinistrados}`);
    console.log(`   Bases únicas: ${stats.bases.length}`);
    console.log(`   Bases: ${stats.bases.join(', ')}`);
    
    console.log('\n🎉 Processamento concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao processar Excel:', error);
    
    // Em caso de erro, usar dados de fallback
    console.log('🔄 Usando dados de fallback...');
    await useFallbackData();
  }
}

function generateVehiclesCode(vehicles: Vehicle[]): string {
  let code = 'export const fleetVehicles: Vehicle[] = [\n';
  
  vehicles.forEach((vehicle, index) => {
    const isLast = index === vehicles.length - 1;
    const comma = isLast ? '' : ',';
    
    code += `  {\n`;
    code += `    id: "${vehicle.id}",\n`;
    code += `    licensePlate: "${vehicle.licensePlate}",\n`;
    code += `    base: "${vehicle.base}",\n`;
    code += `    status: "${vehicle.status}",\n`;
    code += `    reason: "${vehicle.reason}",\n`;
    code += `    entryDate: ${vehicle.entryDate ? `"${vehicle.entryDate}"` : 'null'},\n`;
    code += `    returnForecast: ${vehicle.returnForecast ? `"${vehicle.returnForecast}"` : 'null'},\n`;
    code += `    model: ${vehicle.model ? `"${vehicle.model}"` : 'undefined'},\n`;
    code += `    year: ${vehicle.year || 'undefined'},\n`;
    code += `    driver: ${vehicle.driver ? `"${vehicle.driver}"` : 'null'}\n`;
    code += `  }${comma}\n`;
  });
  
  code += '];\n\n';
  
  // Adicionar dados para filtros
  const bases = Array.from(new Set(vehicles.map(v => v.base))).sort();
  const statuses = Array.from(new Set(vehicles.map(v => v.status))).sort();
  
  code += '// Dados para filtros\n';
  code += `export const fleetBases = ${JSON.stringify(bases)};\n`;
  code += `export const fleetStatuses: FleetStatus[] = ${JSON.stringify(statuses)};\n`;
  
  return code;
}

function generateStats(vehicles: Vehicle[]) {
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
  
  return stats;
}

async function useFallbackData() {
  // Usar dados de fallback se o Excel não puder ser processado
  const fallbackVehicles: Vehicle[] = [
    {
      id: "v1",
      placa: "LUJ7E04",
      modelo: "DUCATO",
      fabricante: "FIAT",
      categoria: "VUC",
      tipoFrota: "Própria",
      base: "AMBEV RJ",
      status: "Em Oficina - Externo",
      motivo: "Manutenção preventiva",
      entradaOFC: "2025-10-11",
      previsaoSaida: "2025-10-28",
      uf: "RJ",
      licensePlate: "LUJ7E04",
      reason: "Manutenção preventiva",
      entryDate: "2025-10-11",
      returnForecast: "2025-10-28",
      model: "DUCATO",
      year: 2022,
      driver: "João Silva"
    },
    {
      id: "v2",
      placa: "RJM9J25",
      modelo: "MASTER",
      fabricante: "RENAULT",
      categoria: "VUC",
      tipoFrota: "Própria",
      base: "AMBEV RJ",
      status: "Em Oficina - Rentals",
      motivo: "Troca de peças",
      entradaOFC: "2025-10-17",
      previsaoSaida: "2025-10-24",
      uf: "RJ",
      licensePlate: "RJM9J25",
      reason: "Troca de peças",
      entryDate: "2025-10-17",
      returnForecast: "2025-10-24",
      model: "MASTER",
      year: 2021,
      driver: "Maria Santos"
    }
  ];
  
  const vehiclesCode = generateVehiclesCode(fallbackVehicles);
  
  const mockDataPath = path.join(__dirname, '../data/mockData.ts');
  let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
  
  const fleetVehiclesStart = mockDataContent.indexOf('export const fleetVehicles: Vehicle[] = [');
  const fleetVehiclesEnd = mockDataContent.indexOf('];', fleetVehiclesStart) + 2;
  
  if (fleetVehiclesStart !== -1 && fleetVehiclesEnd !== -1) {
    const beforeFleet = mockDataContent.substring(0, fleetVehiclesStart);
    const afterFleet = mockDataContent.substring(fleetVehiclesEnd);
    
    mockDataContent = beforeFleet + vehiclesCode + afterFleet;
    fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
    
    console.log('✅ Dados de fallback aplicados');
  }
}

// Executar o script se chamado diretamente
if (require.main === module) {
  processExcelAndUpdateMockData();
}

export { processExcelAndUpdateMockData };
