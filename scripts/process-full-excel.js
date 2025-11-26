import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Processando arquivo Excel completo com 1112 veículos...');

try {
  // Caminho para o arquivo Excel real
  const excelPath = path.join(__dirname, '../src/data/Controle Frota - Pralog.xlsx');
  
  console.log(`📁 Carregando arquivo: ${excelPath}`);
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(excelPath)) {
    throw new Error(`Arquivo não encontrado: ${excelPath}`);
  }
  
  // Carregar o arquivo Excel
  const workbook = XLSX.readFile(excelPath);
  
  console.log('📋 Abas disponíveis:', workbook.SheetNames);
  
  // Procurar pela aba "Base - Frota - Pralog" ou similar
  let sheetName = null;
  for (const name of workbook.SheetNames) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('base') && (lowerName.includes('frota') || lowerName.includes('pralog'))) {
      sheetName = name;
      break;
    }
  }
  
  if (!sheetName) {
    // Se não encontrar, usar a primeira aba
    sheetName = workbook.SheetNames[0];
    console.log(`⚠️  Aba específica não encontrada, usando: ${sheetName}`);
  } else {
    console.log(`✅ Aba encontrada: ${sheetName}`);
  }
  
  // Processar a aba
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`📊 Total de linhas encontradas: ${jsonData.length}`);
  
  if (jsonData.length === 0) {
    throw new Error('Nenhum dado encontrado na planilha');
  }
  
  // Assumir que a primeira linha contém os cabeçalhos
  const headers = jsonData[0];
  console.log('📋 Cabeçalhos encontrados:', headers);
  
  // Mapear os dados para o formato esperado
  const fleetVehicles = [];
  let processedCount = 0;
  let errorCount = 0;
  
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    try {
      // Criar um objeto com os dados da linha baseado nos cabeçalhos
      const rowData = {};
      headers.forEach((header, index) => {
        if (header && row[index] !== undefined) {
          rowData[header.toLowerCase().trim()] = row[index];
        }
      });
      
      // Mapear para o formato esperado
      const vehicle = {
        id: `v${i}`,
        placa: getStringValue(rowData, ['placa']) || `PLACA_${i}`,
        modelo: getStringValue(rowData, ['modelo']) || '-',
        fabricante: getStringValue(rowData, ['fabricante']) || '-',
        categoria: getStringValue(rowData, ['categoria']) || '-',
        tipoFrota: getStringValue(rowData, ['tipo de frota', 'tipo_de_frota', 'tipodefrota']) || '-',
        base: getStringValue(rowData, ['base']) || 'N/A',
        status: mapStatus(getStringValue(rowData, ['status']) || 'Em Operação'),
        motivo: getStringValue(rowData, ['obs', 'observacao', 'observações']) || '-',
        entradaOFC: getStringValue(rowData, ['entrada ofc', 'entrada_ofc', 'entradaofc']) || null,
        previsaoSaida: getStringValue(rowData, ['previsão de saida', 'previsão_de_saida', 'previsaodesaida', 'previsão', 'previsao']) || null,
        // Campos de compatibilidade
        licensePlate: getStringValue(rowData, ['placa']) || `PLACA_${i}`,
        reason: getStringValue(rowData, ['obs', 'observacao', 'observações']) || '-',
        entryDate: getStringValue(rowData, ['entrada ofc', 'entrada_ofc', 'entradaofc']) || null,
        returnForecast: getStringValue(rowData, ['previsão de saida', 'previsão_de_saida', 'previsaodesaida', 'previsão', 'previsao']) || null,
        model: getStringValue(rowData, ['modelo']) || '-',
        driver: null
      };
      
      // Validar se tem pelo menos placa
      if (vehicle.placa && vehicle.placa !== `PLACA_${i}`) {
        fleetVehicles.push(vehicle);
        processedCount++;
      }
      
    } catch (error) {
      errorCount++;
      if (errorCount <= 10) { // Mostrar apenas os primeiros 10 erros
        console.warn(`⚠️  Erro ao processar linha ${i + 1}:`, error.message);
      }
    }
  }
  
  console.log(`✅ Processados ${processedCount} veículos com sucesso`);
  console.log(`❌ ${errorCount} linhas com erro`);
  
  if (processedCount === 0) {
    throw new Error('Nenhum veículo válido foi processado');
  }
  
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
    
    console.log('✅ Arquivo mockData.ts atualizado com todos os dados do Excel');
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
  console.log(`   Bases únicas: ${stats.bases.length} - ${stats.bases.slice(0, 5).join(', ')}${stats.bases.length > 5 ? '...' : ''}`);
  console.log(`   Fabricantes únicos: ${stats.fabricantes.length} - ${stats.fabricantes.join(', ')}`);
  console.log(`   Categorias únicas: ${stats.categorias.length} - ${stats.categorias.join(', ')}`);
  console.log(`   Tipos de Frota únicos: ${stats.tiposFrota.length} - ${stats.tiposFrota.join(', ')}`);
  
  console.log('\n🎉 Processamento completo concluído com sucesso!');
  
} catch (error) {
  console.error('❌ Erro durante o processamento:', error.message);
  process.exit(1);
}

// Funções auxiliares
function getStringValue(rowData, possibleKeys) {
  for (const key of possibleKeys) {
    const value = rowData[key];
    if (value !== undefined && value !== null && value !== '') {
      return String(value).trim();
    }
  }
  return '';
}

function mapStatus(excelStatus) {
  const statusMap = {
    "Em Manutenção": "Em Manutenção",
    "Em Operação": "Em Operação",
    "Sem Motorista": "Sem Motorista",
    "Sinistrado": "Sinistrado",
    "Operação": "Em Operação",
    "Manutenção": "Em Manutenção",
    "Manutencao": "Em Manutenção",
    "Operacao": "Em Operação"
  };
  
  return statusMap[excelStatus] || "Em Operação";
}
