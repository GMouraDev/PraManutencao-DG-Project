import { processFleetExcel } from '../utils/excelProcessor';
import { Vehicle } from '../types/fleet';
import * as fs from 'fs';
import * as path from 'path';

async function generateFleetDataFromExcel() {
  try {
    console.log('🔄 Processando dados do Excel...');
    
    // Processar dados do Excel
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
      
      console.log('✅ Arquivo mockData.ts atualizado com dados do Excel');
    } else {
      console.error('❌ Não foi possível encontrar a seção fleetVehicles no arquivo mockData.ts');
    }
    
    // Gerar estatísticas
    const stats = generateStats(vehicles);
    console.log('\n📊 Estatísticas dos dados processados:');
    console.log(`   Total de veículos: ${stats.total}`);
    console.log(`   Em Operação: ${stats.operacao}`);
    console.log(`   Em Manutenção: ${stats.manutencao}`);
    console.log(`   Sem Motorista: ${stats.semMotorista}`);
    console.log(`   Sinistrados: ${stats.sinistrados}`);
    console.log(`   Bases únicas: ${stats.bases.length}`);
    console.log(`   Bases: ${stats.bases.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Erro ao processar dados do Excel:', error);
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

// Executar o script se chamado diretamente
if (require.main === module) {
  generateFleetDataFromExcel();
}

export { generateFleetDataFromExcel };
