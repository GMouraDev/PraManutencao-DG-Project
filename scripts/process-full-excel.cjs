const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

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
      
      // Mapear colunas específicas por índice (0-indexed)
      // Coluna D = índice 3, Coluna X = índice 23, Coluna AB = índice 27, Coluna AD = índice 29, Coluna AO = índice 40
      const tipoPlaca = row[3] ? String(row[3]).trim() : null; // Coluna D
      const tipoFrotaManutencao = row[23] ? String(row[23]).trim() : null; // Coluna X
      const gestor = row[27] ? String(row[27]).trim() : null; // Coluna AB
      const atuacao = row[29] ? String(row[29]).trim() : null; // Coluna AD
      const resumoStatus = row[40] ? String(row[40]).trim() : null; // Coluna AO
      
      // Mapear para o formato esperado
      const placa = getStringValue(rowData, ['placa']) || `PLACA_${i}`;
      const base = getStringValue(rowData, ['base']) || 'N/A';
      // CORRIGIDO: ENTRADA da planilha mapeia para entradaOFC, PREVISÃO mapeia para previsaoSaida
      const entradaOFC = convertExcelDate(getStringValue(rowData, ['entrada', 'entrada ofc', 'entrada_ofc', 'entradaofc', 'ENTRADA']));
      const previsaoSaida = convertExcelDate(getStringValue(rowData, ['previsão', 'previsão de saida', 'previsão_de_saida', 'previsaodesaida', 'previsao', 'PREVISÃO']));
      const uf = getStringValue(rowData, ['uf']) || 'N/A';
      
      const vehicle = {
        id: `v${i}`,
        placa: placa,
        modelo: getStringValue(rowData, ['modelo']) || '-',
        fabricante: getStringValue(rowData, ['fabricante']) || '-',
        categoria: getStringValue(rowData, ['categoria']) || '-',
        tipoFrota: getStringValue(rowData, ['tipo de frota', 'tipo_de_frota', 'tipodefrota']) || '-',
        base: base,
        status: mapStatus(getStringValue(rowData, ['status']) || 'Em Operação'),
        motivo: getStringValue(rowData, ['obs', 'observacao', 'observações']) || '-',
        entradaOFC: entradaOFC,
        previsaoSaida: previsaoSaida,
        uf: uf,
        // Novos campos
        placaReserva: getStringValue(rowData, ['placa reserva', 'placa_reserva', 'placareserva', 'reserva']) || null,
        anoFabricacao: getStringValue(rowData, ['ano fabricação', 'ano_fabricação', 'anofabricacao', 'ano fabricacao', 'ano']) || null,
        ultimoChecklist: getStringValue(rowData, ['ultimo checklist', 'último checklist', 'ultimo_checklist', 'último_checklist', 'ultimochecklist']) || null,
        statusMoki: getStringValue(rowData, ['status moki', 'status_moki', 'statusmoki', 'moki']) || null,
        geotab: getStringValue(rowData, ['geotab']) || null,
        t4s: getStringValue(rowData, ['t4s']) || null,
        sascar: getStringValue(rowData, ['sascar']) || null,
        pooltrack: getStringValue(rowData, ['pooltrack']) || null,
        golfleet: getStringValue(rowData, ['golfleet', 'golfleet']) || null,
        // Campos das colunas específicas
        tipoPlaca: tipoPlaca || null, // Coluna D
        tipoFrotaManutencao: tipoFrotaManutencao || null, // Coluna X
        gestor: gestor || null, // Coluna AB
        atuacao: atuacao || null, // Coluna AD
        resumoStatus: resumoStatus || null, // Coluna AO
        // Campos de compatibilidade
        licensePlate: placa,
        reason: getStringValue(rowData, ['obs', 'observacao', 'observações']) || '-',
        entryDate: entradaOFC, // Mapeado de ENTRADA da planilha
        returnForecast: previsaoSaida, // Mapeado de PREVISÃO da planilha
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
    vehiclesCode += `    id: "${escapeString(vehicle.id)}",\n`;
    vehiclesCode += `    placa: "${escapeString(vehicle.placa)}",\n`;
    vehiclesCode += `    modelo: "${escapeString(vehicle.modelo)}",\n`;
    vehiclesCode += `    fabricante: "${escapeString(vehicle.fabricante)}",\n`;
    vehiclesCode += `    categoria: "${escapeString(vehicle.categoria)}",\n`;
    vehiclesCode += `    tipoFrota: "${escapeString(vehicle.tipoFrota)}",\n`;
    vehiclesCode += `    base: "${escapeString(vehicle.base)}",\n`;
    vehiclesCode += `    status: "${escapeString(vehicle.status)}",\n`;
    vehiclesCode += `    motivo: "${escapeString(vehicle.motivo)}",\n`;
    vehiclesCode += `    entradaOFC: ${vehicle.entradaOFC ? `"${escapeString(vehicle.entradaOFC)}"` : 'null'},\n`;
    vehiclesCode += `    previsaoSaida: ${vehicle.previsaoSaida ? `"${escapeString(vehicle.previsaoSaida)}"` : 'null'},\n`;
    vehiclesCode += `    uf: "${escapeString(vehicle.uf)}",\n`;
    vehiclesCode += `    // Novos campos\n`;
    vehiclesCode += `    placaReserva: ${vehicle.placaReserva ? `"${escapeString(vehicle.placaReserva)}"` : 'null'},\n`;
    vehiclesCode += `    anoFabricacao: ${vehicle.anoFabricacao ? (typeof vehicle.anoFabricacao === 'number' ? vehicle.anoFabricacao : `"${escapeString(vehicle.anoFabricacao)}"`) : 'null'},\n`;
    vehiclesCode += `    ultimoChecklist: ${vehicle.ultimoChecklist ? `"${escapeString(vehicle.ultimoChecklist)}"` : 'null'},\n`;
    vehiclesCode += `    statusMoki: ${vehicle.statusMoki ? `"${escapeString(vehicle.statusMoki)}"` : 'null'},\n`;
    vehiclesCode += `    geotab: ${vehicle.geotab ? `"${escapeString(vehicle.geotab)}"` : 'null'},\n`;
    vehiclesCode += `    t4s: ${vehicle.t4s ? `"${escapeString(vehicle.t4s)}"` : 'null'},\n`;
    vehiclesCode += `    sascar: ${vehicle.sascar ? `"${escapeString(vehicle.sascar)}"` : 'null'},\n`;
    vehiclesCode += `    pooltrack: ${vehicle.pooltrack ? `"${escapeString(vehicle.pooltrack)}"` : 'null'},\n`;
    vehiclesCode += `    golfleet: ${vehicle.golfleet ? `"${escapeString(vehicle.golfleet)}"` : 'null'},\n`;
    vehiclesCode += `    // Campos das colunas específicas\n`;
    vehiclesCode += `    tipoPlaca: ${vehicle.tipoPlaca ? `"${escapeString(vehicle.tipoPlaca)}"` : 'null'},\n`;
    vehiclesCode += `    tipoFrotaManutencao: ${vehicle.tipoFrotaManutencao ? `"${escapeString(vehicle.tipoFrotaManutencao)}"` : 'null'},\n`;
    vehiclesCode += `    gestor: ${vehicle.gestor ? `"${escapeString(vehicle.gestor)}"` : 'null'},\n`;
    vehiclesCode += `    atuacao: ${vehicle.atuacao ? `"${escapeString(vehicle.atuacao)}"` : 'null'},\n`;
    vehiclesCode += `    resumoStatus: ${vehicle.resumoStatus ? `"${escapeString(vehicle.resumoStatus)}"` : 'null'},\n`;
    vehiclesCode += `    // Campos de compatibilidade\n`;
    vehiclesCode += `    licensePlate: "${escapeString(vehicle.licensePlate)}",\n`;
    vehiclesCode += `    reason: "${escapeString(vehicle.reason)}",\n`;
    vehiclesCode += `    entryDate: ${vehicle.entryDate ? `"${escapeString(vehicle.entryDate)}"` : 'null'},\n`;
    vehiclesCode += `    returnForecast: ${vehicle.returnForecast ? `"${escapeString(vehicle.returnForecast)}"` : 'null'},\n`;
    vehiclesCode += `    model: "${escapeString(vehicle.model)}",\n`;
    vehiclesCode += `    driver: ${vehicle.driver ? `"${escapeString(vehicle.driver)}"` : 'null'}\n`;
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
  
  // Encontrar e substituir a seção de fleetVehicles e os filtros
  const fleetVehiclesStart = mockDataContent.indexOf('export const fleetVehicles: Vehicle[] = [');
  const fleetVehiclesEnd = mockDataContent.indexOf('];', fleetVehiclesStart) + 2;
  
  if (fleetVehiclesStart !== -1 && fleetVehiclesEnd !== -1) {
    const beforeFleet = mockDataContent.substring(0, fleetVehiclesStart);
    let afterFleet = mockDataContent.substring(fleetVehiclesEnd);
    
    // Remover todas as seções de filtros duplicadas que podem existir após fleetVehicles
    // Procura por todos os blocos "// Dados para filtros" e remove até a última linha de fleetTiposFrota
    while (true) {
      const filtersCommentIndex = afterFleet.indexOf('// Dados para filtros');
      if (filtersCommentIndex === -1) break;
      
      // Encontrar onde termina o bloco de filtros (até fleetTiposFrota + linhas em branco)
      const blockStart = filtersCommentIndex;
      const blockLines = afterFleet.substring(blockStart).split('\n');
      
      // Procurar pela linha de fleetTiposFrota
      let lastFilterIndex = -1;
      for (let i = 0; i < blockLines.length; i++) {
        if (blockLines[i].trim().startsWith('export const fleetTiposFrota')) {
          lastFilterIndex = i;
          break;
        }
      }
      
      if (lastFilterIndex === -1) break;
      
      // Calcular o fim do bloco incluindo linhas em branco após
      let blockEnd = blockStart;
      for (let i = 0; i <= lastFilterIndex; i++) {
        blockEnd += blockLines[i].length + 1; // +1 para o \n
      }
      
      // Pular linhas em branco após os filtros
      while (blockEnd < afterFleet.length && 
             (afterFleet[blockEnd] === '\n' || 
              afterFleet[blockEnd] === '\r' || 
              afterFleet[blockEnd] === ' ' || 
              afterFleet[blockEnd] === '\t')) {
        blockEnd++;
      }
      
      // Remover este bloco de filtros
      afterFleet = afterFleet.substring(0, blockStart) + afterFleet.substring(blockEnd);
    }
    
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
    "Administração": "Administração",
    "Aguardando Oficina": "Aguardando Oficina",
    "Desmobilizado": "Desmobilizado",
    "Devolução": "Devolução",
    "Disponível": "Disponível",
    "Em Oficina - Externo": "Em Oficina - Externo",
    "Em Oficina - Rentals": "Em Oficina - Rentals",
    "Em Oficina - Trois": "Em Oficina - Trois",
    "Em Operação": "Em Operação",
    "Falta": "Falta",
    "Folga": "Folga",
    "Indisponível": "Indisponível",
    "Mobilização": "Mobilização",
    "Pós-Oficina": "Pós-Oficina",
    "PRA Reboque": "PRA Reboque",
    "Sem Motorista": "Sem Motorista",
    "Sem Rota": "Sem Rota",
    "Sinistrado - PT": "Sinistrado - PT",
    "Treinamento": "Treinamento",
    "Veículo Alugado": "Veículo Alugado",
    "Veículo Pronto": "Veículo Pronto",
    "Venda": "Venda",
    // Mapeamentos alternativos
    "Operação": "Em Operação",
    "Manutenção": "Em Oficina - Externo",
    "Manutencao": "Em Oficina - Externo",
    "Operacao": "Em Operação",
    "Sinistrado": "Sinistrado - PT"
  };
  
  return statusMap[excelStatus] || "Em Operação";
}

function convertExcelDate(excelDate) {
  if (!excelDate || excelDate === "-" || excelDate === "0") {
    return null;
  }

  // Se já é uma data em formato string, retornar como está
  if (excelDate.includes('/') || excelDate.includes('-')) {
    return excelDate;
  }

  // Converter número de série do Excel para data
  const excelNum = parseInt(excelDate, 10);
  if (isNaN(excelNum) || excelNum <= 0) {
    return null;
  }

  // Excel conta dias desde 30/12/1899
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + excelNum * 24 * 60 * 60 * 1000);
  
  // Formatar como DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

function escapeString(str) {
  if (!str) return '';
  // Escapar aspas duplas e barras invertidas
  return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
