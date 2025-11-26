import * as XLSX from 'xlsx';
import { Vehicle, FleetStatus } from '@/types/fleet';

export interface ExcelVehicleData {
  placa: string; // PLACA
  modelo: string; // MODELO
  fabricante: string; // FABRICANTE
  categoria: string; // CATEGORIA
  tipoFrota: string; // TIPO DE FROTA
  base: string; // BASE
  status: string; // STATUS
  motivo: string; // OBS
  entradaOFC: string; // ENTRADA OFC
  previsaoSaida: string; // PREVISÃO DE SAIDA
  uf: string; // UF
}

export class ExcelProcessor {
  private workbook: XLSX.WorkBook | null = null;

  async loadExcel(filePath: string): Promise<void> {
    try {
      console.log(`Carregando arquivo Excel: ${filePath}`);
      
      // Carregar o arquivo Excel real
      const fileBuffer = await this.readFileAsBuffer(filePath);
      this.workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      
      console.log('✅ Arquivo Excel carregado com sucesso');
      console.log('📋 Abas disponíveis:', this.workbook.SheetNames);
    } catch (error) {
      console.error('Erro ao carregar arquivo Excel:', error);
      throw error;
    }
  }

  private async readFileAsBuffer(filePath: string): Promise<Buffer> {
    // Em um ambiente Node.js, você usaria fs.readFileSync
    // Em um ambiente browser, você usaria FileReader
    const fs = require('fs');
    return fs.readFileSync(filePath);
  }

  extractFleetData(): ExcelVehicleData[] {
    if (!this.workbook) {
      throw new Error('Workbook não foi carregado. Chame loadExcel() primeiro.');
    }

    // Procurar pela aba "Base - Frota Pralog" ou similar
    const sheetName = this.findFleetSheet();
    if (!sheetName) {
      throw new Error('Aba "Base - Frota Pralog" não encontrada no arquivo Excel');
    }

    console.log(`📊 Processando aba: ${sheetName}`);
    
    const worksheet = this.workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📋 Total de linhas encontradas: ${jsonData.length}`);
    
    // Assumindo que a primeira linha contém os cabeçalhos
    const headers = jsonData[0] as string[];
    console.log('📋 Cabeçalhos encontrados:', headers);
    
    // Mapear os dados para o formato esperado
    const fleetData: ExcelVehicleData[] = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[];
      if (!row || row.length === 0) continue;
      
      // Mapear as colunas baseado nos cabeçalhos
      const vehicleData = this.mapRowToVehicleData(row, headers);
      if (vehicleData) {
        fleetData.push(vehicleData);
      }
    }
    
    console.log(`✅ Processados ${fleetData.length} veículos da planilha`);
    return fleetData;
  }

  private findFleetSheet(): string | null {
    if (!this.workbook) return null;
    
    // Procurar por abas que contenham "Base" e "Frota" ou "Pralog"
    const sheetNames = this.workbook.SheetNames;
    
    for (const sheetName of sheetNames) {
      const lowerName = sheetName.toLowerCase();
      if (lowerName.includes('base') && (lowerName.includes('frota') || lowerName.includes('pralog'))) {
        return sheetName;
      }
    }
    
    // Se não encontrar, retornar a primeira aba
    return sheetNames[0] || null;
  }

  private mapRowToVehicleData(row: any[], headers: string[]): ExcelVehicleData | null {
    try {
      // Criar um objeto com os dados da linha baseado nos cabeçalhos
      const rowData: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        if (header && row[index] !== undefined) {
          rowData[header.toLowerCase().trim()] = row[index];
        }
      });

      // Mapear para o formato esperado baseado nos cabeçalhos exatos da planilha
      const vehicleData: ExcelVehicleData = {
        placa: this.getStringValue(rowData, ['placa']),
        modelo: this.getStringValue(rowData, ['modelo']),
        fabricante: this.getStringValue(rowData, ['fabricante']),
        categoria: this.getStringValue(rowData, ['categoria']),
        tipoFrota: this.getStringValue(rowData, ['tipo de frota', 'tipo_de_frota', 'tipodefrota']),
        base: this.getStringValue(rowData, ['base']),
        status: this.getStringValue(rowData, ['status']),
        motivo: this.getStringValue(rowData, ['obs', 'observacao', 'observações']),
        entradaOFC: this.getStringValue(rowData, ['entrada ofc', 'entrada_ofc', 'entradaofc']),
        previsaoSaida: this.getStringValue(rowData, ['previsão de saida', 'previsão_de_saida', 'previsaodesaida', 'previsão', 'previsao']),
        uf: this.getStringValue(rowData, ['uf'])
      };

      // Validar se tem pelo menos placa e base
      if (!vehicleData.placa || !vehicleData.base) {
        return null;
      }

      return vehicleData;
    } catch (error) {
      console.warn('Erro ao processar linha:', error);
      return null;
    }
  }

  private getStringValue(rowData: { [key: string]: any }, possibleKeys: string[]): string {
    for (const key of possibleKeys) {
      const value = rowData[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value).trim();
      }
    }
    return '';
  }

  private getNumberValue(rowData: { [key: string]: any }, possibleKeys: string[]): number | undefined {
    for (const key of possibleKeys) {
      const value = rowData[key];
      if (value !== undefined && value !== null && value !== '') {
        const num = Number(value);
        if (!isNaN(num)) {
          return num;
        }
      }
    }
    return undefined;
  }

  convertToVehicles(excelData: ExcelVehicleData[]): Vehicle[] {
    return excelData.map((data, index) => ({
      id: `v${index + 1}`,
      placa: data.placa,
      modelo: data.modelo || "-",
      fabricante: data.fabricante || "-",
      categoria: data.categoria || "-",
      tipoFrota: data.tipoFrota || "-",
      base: data.base,
      status: this.mapStatus(data.status),
      motivo: data.motivo === "-" || !data.motivo ? "-" : data.motivo,
      entradaOFC: data.entradaOFC === "-" || !data.entradaOFC ? null : data.entradaOFC,
      previsaoSaida: data.previsaoSaida === "-" || !data.previsaoSaida ? null : data.previsaoSaida,
      uf: data.uf || "N/A",
      // Campos de compatibilidade
      licensePlate: data.placa,
      reason: data.motivo === "-" || !data.motivo ? "-" : data.motivo,
      entryDate: data.entradaOFC === "-" || !data.entradaOFC ? null : data.entradaOFC,
      returnForecast: data.previsaoSaida === "-" || !data.previsaoSaida ? null : data.previsaoSaida,
      model: data.modelo,
      driver: null
    }));
  }

  private mapStatus(excelStatus: string): FleetStatus {
    const statusMap: { [key: string]: FleetStatus } = {
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
      "Em Manutenção": "Em Oficina - Externo",
      "Sinistrado": "Sinistrado - PT"
    };
    
    return statusMap[excelStatus] || "Em Operação";
  }

  async processExcelFile(filePath: string): Promise<Vehicle[]> {
    await this.loadExcel(filePath);
    const excelData = this.extractFleetData();
    return this.convertToVehicles(excelData);
  }
}

// Função utilitária para processar o arquivo Excel
export async function processFleetExcel(): Promise<Vehicle[]> {
  const processor = new ExcelProcessor();
  return await processor.processExcelFile('./src/data/Controle Frota - Pralog.xlsx');
}
