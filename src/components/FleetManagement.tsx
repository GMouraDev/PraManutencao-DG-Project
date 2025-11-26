import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { fleetVehicles, fleetBases, fleetStatuses, fleetFabricantes, fleetCategorias, fleetTiposFrota } from '@/data/mockData';
import { Vehicle, FleetStatus } from '@/types/fleet';
import { Search, Car, Wrench, UserX, AlertTriangle, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export const FleetManagement = () => {
  const [searchPlate, setSearchPlate] = useState('');
  const [selectedPlacas, setSelectedPlacas] = useState<string[]>([]);
  const [selectedModelos, setSelectedModelos] = useState<string[]>([]);
  const [selectedFabricantes, setSelectedFabricantes] = useState<string[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [selectedTiposFrota, setSelectedTiposFrota] = useState<string[]>([]);
  const [selectedBases, setSelectedBases] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTelemetrias, setSelectedTelemetrias] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Mostrar 50 veículos por página
  const [filtersExpanded, setFiltersExpanded] = useState(false); // Controla expansão dos filtros

  // Função para processar telemetrias e retornar nomes compactos
  const getTelemetrias = (vehicle: Vehicle) => {
    const telemetrias: string[] = [];
    
    if (vehicle.geotab && vehicle.geotab.toUpperCase() === 'SIM') telemetrias.push('GEOTAB');
    if (vehicle.t4s && vehicle.t4s.toUpperCase() === 'SIM') telemetrias.push('T4S');
    if (vehicle.sascar && vehicle.sascar.toUpperCase() === 'SIM') telemetrias.push('SASCAR');
    if (vehicle.pooltrack && vehicle.pooltrack.toUpperCase() === 'SIM') telemetrias.push('POOLTRACK');
    if (vehicle.golfleet && vehicle.golfleet.toUpperCase() === 'SIM') telemetrias.push('GOLFLEET');
    
    return telemetrias;
  };

  // Filtrar veículos baseado nos filtros
  const filteredVehicles = useMemo(() => {
    return fleetVehicles.filter(vehicle => {
      const matchesPlate = vehicle.placa.toLowerCase().includes(searchPlate.toLowerCase());
      const matchesPlaca = selectedPlacas.length === 0 || selectedPlacas.includes(vehicle.placa);
      const matchesModelo = selectedModelos.length === 0 || selectedModelos.includes(vehicle.modelo);
      const matchesFabricante = selectedFabricantes.length === 0 || selectedFabricantes.includes(vehicle.fabricante);
      const matchesCategoria = selectedCategorias.length === 0 || selectedCategorias.includes(vehicle.categoria);
      const matchesTipoFrota = selectedTiposFrota.length === 0 || selectedTiposFrota.includes(vehicle.tipoFrota);
      const matchesBase = selectedBases.length === 0 || selectedBases.includes(vehicle.base);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(vehicle.status);
      
      // Filtrar por telemetria
      const vehicleTelemetrias = getTelemetrias(vehicle);
      const matchesTelemetria = selectedTelemetrias.length === 0 || 
        selectedTelemetrias.some(tel => vehicleTelemetrias.includes(tel));
      
      return matchesPlate && matchesPlaca && matchesModelo && matchesFabricante && 
             matchesCategoria && matchesTipoFrota && matchesBase && matchesStatus && matchesTelemetria;
    });
  }, [searchPlate, selectedPlacas, selectedModelos, selectedFabricantes, selectedCategorias, 
      selectedTiposFrota, selectedBases, selectedStatuses, selectedTelemetrias]);

  // Paginação
  const isShowAll = itemsPerPage === -1;
  const totalPages = isShowAll ? 1 : Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = isShowAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = isShowAll ? filteredVehicles.length : startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset página quando filtros mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [searchPlate, selectedPlacas, selectedModelos, selectedFabricantes, selectedCategorias, 
      selectedTiposFrota, selectedBases, selectedStatuses, selectedTelemetrias, itemsPerPage]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = fleetVehicles.length;
    const operacao = fleetVehicles.filter(v => 
      ['Em Operação', 'Disponível', 'Veículo Pronto', 'Mobilização', 'Pós-Oficina', 'Veículo Alugado'].includes(v.status)
    ).length;
    const manutencao = fleetVehicles.filter(v => 
      ['Em Oficina - Externo', 'Em Oficina - Rentals', 'Em Oficina - Trois', 'PRA Reboque'].includes(v.status)
    ).length;
    const semMotorista = fleetVehicles.filter(v => 
      ['Sem Motorista', 'Sem Rota', 'Indisponível', 'Folga', 'Treinamento'].includes(v.status)
    ).length;
    const sinistrados = fleetVehicles.filter(v => 
      ['Sinistrado - PT', 'Venda', 'Desmobilizado', 'Devolução', 'Falta'].includes(v.status)
    ).length;

    return { total, operacao, manutencao, semMotorista, sinistrados };
  }, []);

  // Estatísticas por categoria
  const categoryStats = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    
    fleetVehicles.forEach(vehicle => {
      const categoria = vehicle.categoria || 'Sem Categoria';
      categoryMap[categoria] = (categoryMap[categoria] || 0) + 1;
    });

    // Converter para array e ordenar por quantidade (desc)
    return Object.entries(categoryMap)
      .map(([categoria, count]) => ({ categoria, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Estatísticas por tipo de frota (apenas para veículos filtrados)
  const tipoFrotaStats = useMemo(() => {
    const tipoFrotaMap: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      const tipoFrota = vehicle.tipoFrota || 'Sem Tipo';
      tipoFrotaMap[tipoFrota] = (tipoFrotaMap[tipoFrota] || 0) + 1;
    });

    // Converter para array e ordenar por quantidade (desc)
    return Object.entries(tipoFrotaMap)
      .map(([tipoFrota, count]) => ({ tipoFrota, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  const getStatusBadge = (status: FleetStatus) => {
    const variants = {
      'Em Operação': 'default',
      'Disponível': 'default',
      'Veículo Pronto': 'default',
      'Em Oficina - Externo': 'destructive',
      'Em Oficina - Rentals': 'destructive',
      'Em Oficina - Trois': 'destructive',
      'Aguardando Oficina': 'destructive',
      'Sem Motorista': 'secondary',
      'Sem Rota': 'secondary',
      'Indisponível': 'secondary',
      'Sinistrado - PT': 'outline',
      'Venda': 'outline',
      'Desmobilizado': 'outline',
      'Devolução': 'outline',
      'Administração': 'secondary',
      'Falta': 'destructive',
      'Folga': 'secondary',
      'Mobilização': 'default',
      'Pós-Oficina': 'default',
      'PRA Reboque': 'destructive',
      'Treinamento': 'secondary',
      'Veículo Alugado': 'outline'
    } as const;

    return (
      <Badge variant={variants[status] || 'default'} className="text-xs">
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: FleetStatus) => {
    const icons = {
      'Em Operação': <Car className="h-4 w-4" />,
      'Disponível': <Car className="h-4 w-4" />,
      'Veículo Pronto': <Car className="h-4 w-4" />,
      'Em Oficina - Externo': <Wrench className="h-4 w-4" />,
      'Em Oficina - Rentals': <Wrench className="h-4 w-4" />,
      'Em Oficina - Trois': <Wrench className="h-4 w-4" />,
      'Aguardando Oficina': <Wrench className="h-4 w-4" />,
      'Sem Motorista': <UserX className="h-4 w-4" />,
      'Sem Rota': <UserX className="h-4 w-4" />,
      'Indisponível': <UserX className="h-4 w-4" />,
      'Sinistrado - PT': <AlertTriangle className="h-4 w-4" />,
      'Venda': <AlertTriangle className="h-4 w-4" />,
      'Desmobilizado': <AlertTriangle className="h-4 w-4" />,
      'Devolução': <AlertTriangle className="h-4 w-4" />,
      'Administração': <UserX className="h-4 w-4" />,
      'Falta': <AlertTriangle className="h-4 w-4" />,
      'Folga': <UserX className="h-4 w-4" />,
      'Mobilização': <Car className="h-4 w-4" />,
      'Pós-Oficina': <Car className="h-4 w-4" />,
      'PRA Reboque': <Wrench className="h-4 w-4" />,
      'Treinamento': <UserX className="h-4 w-4" />,
      'Veículo Alugado': <Car className="h-4 w-4" />
    };

    return icons[status] || <Car className="h-4 w-4" />;
  };

  // Funções auxiliares para filtros múltiplos
  const toggleFilter = (filterArray: string[], setFilterArray: (value: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchPlate('');
    setSelectedPlacas([]);
    setSelectedModelos([]);
    setSelectedFabricantes([]);
    setSelectedCategorias([]);
    setSelectedTiposFrota([]);
    setSelectedBases([]);
    setSelectedStatuses([]);
    setSelectedTelemetrias([]);
  };

  const exportToExcel = () => {
    // Preparar dados para exportação com os mesmos campos da tabela
    const exportData = filteredVehicles.map(vehicle => {
      const telemetrias = getTelemetrias(vehicle);
      return {
        'Placa': vehicle.placa || '-',
        'Reserva': vehicle.placaReserva || '-',
        'Modelo': vehicle.modelo || '-',
        'Categoria': vehicle.categoria || '-',
        'Ano Fabricação': vehicle.anoFabricacao ? String(vehicle.anoFabricacao) : '-',
        'Base': vehicle.base || '-',
        'Tipo de Frota': vehicle.tipoFrota || '-',
        'Status Checklist': vehicle.statusMoki || '-',
        'Telemetrias': telemetrias.length > 0 ? telemetrias.join(' / ') : '-',
        'Status': vehicle.status || '-',
        'Entrada Oficina': vehicle.entradaOFC || '-',
        'Previsão Saída': vehicle.previsaoSaida || '-',
        'Observação (OBS)': vehicle.motivo || '-'
      };
    });

    // Criar workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Frota');

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 10 }, // Placa
      { wch: 10 }, // Reserva
      { wch: 25 }, // Modelo
      { wch: 12 }, // Categoria
      { wch: 12 }, // Ano Fabricação
      { wch: 15 }, // Base
      { wch: 15 }, // Tipo de Frota
      { wch: 18 }, // Status Checklist
      { wch: 15 }, // Telemetrias
      { wch: 20 }, // Status
      { wch: 15 }, // Entrada Oficina
      { wch: 18 }, // Previsão Saída
      { wch: 30 }  // Observação (OBS)
    ];
    ws['!cols'] = colWidths;

    // Gerar nome do arquivo com data e hora
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `frota_filtrada_${timestamp}.xlsx`;

    // Fazer download
    XLSX.writeFile(wb, filename);
  };

  // Obter valores únicos para cada filtro
  const uniquePlacas = Array.from(new Set(fleetVehicles.map(v => v.placa))).sort();
  const uniqueModelos = Array.from(new Set(fleetVehicles.map(v => v.modelo))).sort();
  const uniqueFabricantes = Array.from(new Set(fleetVehicles.map(v => v.fabricante))).sort();
  const uniqueCategorias = Array.from(new Set(fleetVehicles.map(v => v.categoria))).sort();
  const uniqueTiposFrota = Array.from(new Set(fleetVehicles.map(v => v.tipoFrota))).sort();
  const uniqueBases = Array.from(new Set(fleetVehicles.map(v => v.base))).sort();
  const uniqueStatuses = Array.from(new Set(fleetVehicles.map(v => v.status))).sort();
  const uniqueTelemetrias = ['GEOTAB', 'T4S', 'SASCAR', 'POOLTRACK', 'GOLFLEET'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Car className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Gestão de Frota
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Controle detalhado de veículos por base e placa
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-end gap-2">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <span>{filteredVehicles.length.toLocaleString()}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 mt-1">
                  {filteredVehicles.length === fleetVehicles.length ? 'Total de veículos' : 'Veículos filtrados'}
                </p>
                {tipoFrotaStats.length > 0 && (
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-end">
                    {tipoFrotaStats.map(({ tipoFrota, count }, index) => (
                      <span key={tipoFrota} className="text-xs text-muted-foreground">
                        {index > 0 && '•'} {count} {tipoFrota}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cards de Estatísticas por Categoria */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Total por Categoria de Veículos</p>
        <div className="flex flex-wrap gap-2">
          {categoryStats.map(({ categoria, count }) => (
            <Card key={categoria} className="border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-2 px-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground truncate" title={categoria}>
                    {categoria}
                  </p>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">{count}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


      {/* Filtros Múltiplos */}
      <Card>
        <CardHeader className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="text-base sm:text-lg">Filtros</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center gap-2 justify-center"
              >
                {filtersExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Ocultar Filtros</span>
                    <span className="sm:hidden">Ocultar</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Mostrar Filtros</span>
                    <span className="sm:hidden">Mostrar</span>
                    {(selectedPlacas.length > 0 || selectedModelos.length > 0 || selectedFabricantes.length > 0 || 
                      selectedCategorias.length > 0 || selectedTiposFrota.length > 0 || selectedBases.length > 0 || 
                      selectedStatuses.length > 0 || selectedTelemetrias.length > 0) && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {selectedPlacas.length + selectedModelos.length + selectedFabricantes.length + 
                         selectedCategorias.length + selectedTiposFrota.length + selectedBases.length + 
                         selectedStatuses.length + selectedTelemetrias.length}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
              {/* Botão Limpar Todos - só aparece quando há filtros ativos */}
              {(selectedPlacas.length > 0 || selectedModelos.length > 0 || selectedFabricantes.length > 0 || 
                selectedCategorias.length > 0 || selectedTiposFrota.length > 0 || selectedBases.length > 0 || 
                selectedStatuses.length > 0 || selectedTelemetrias.length > 0 || searchPlate) && (
                <Button variant="outline" size="sm" onClick={clearAllFilters} className="justify-center">
                  <X className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Limpar Todos</span>
                  <span className="sm:hidden">Limpar</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3">
            {/* Busca por Placa e Exportar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por placa..."
                  value={searchPlate}
                  onChange={(e) => setSearchPlate(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white flex-shrink-0"
                size="sm"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>

            {/* Grid de Filtros - Condicionalmente renderizado */}
            <div className={`transition-all duration-300 overflow-hidden ${filtersExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {/* Placas */}
              <MultiSelect
                options={uniquePlacas.map(placa => ({ label: placa, value: placa }))}
                selected={selectedPlacas}
                onChange={setSelectedPlacas}
                placeholder="Placas..."
              />

              {/* Modelos */}
              <MultiSelect
                options={uniqueModelos.map(modelo => ({ label: modelo, value: modelo }))}
                selected={selectedModelos}
                onChange={setSelectedModelos}
                placeholder="Modelos..."
              />

              {/* Fabricantes */}
              <MultiSelect
                options={uniqueFabricantes.map(fabricante => ({ label: fabricante, value: fabricante }))}
                selected={selectedFabricantes}
                onChange={setSelectedFabricantes}
                placeholder="Fabricantes..."
              />

              {/* Categorias */}
              <MultiSelect
                options={uniqueCategorias.map(categoria => ({ label: categoria, value: categoria }))}
                selected={selectedCategorias}
                onChange={setSelectedCategorias}
                placeholder="Categorias..."
              />

              {/* Tipos de Frota */}
              <MultiSelect
                options={uniqueTiposFrota.map(tipoFrota => ({ label: tipoFrota, value: tipoFrota }))}
                selected={selectedTiposFrota}
                onChange={setSelectedTiposFrota}
                placeholder="Tipos de Frota..."
              />

              {/* Bases */}
              <MultiSelect
                options={uniqueBases.map(base => ({ label: base, value: base }))}
                selected={selectedBases}
                onChange={setSelectedBases}
                placeholder="Bases..."
              />

              {/* Status */}
              <MultiSelect
                options={uniqueStatuses.map(status => ({ label: status, value: status }))}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
                placeholder="Status..."
              />

              {/* Telemetrias */}
              <MultiSelect
                options={uniqueTelemetrias.map(telemetria => ({ label: telemetria, value: telemetria }))}
                selected={selectedTelemetrias}
                onChange={setSelectedTelemetrias}
                placeholder="Telemetrias..."
              />
              </div>
            </div>

            {/* Filtros Ativos */}
            {(selectedPlacas.length > 0 || selectedModelos.length > 0 || selectedFabricantes.length > 0 || 
              selectedCategorias.length > 0 || selectedTiposFrota.length > 0 || selectedBases.length > 0 || 
              selectedStatuses.length > 0 || selectedTelemetrias.length > 0) && (
              <div className="pt-2 border-t border-border">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {selectedPlacas.map(placa => (
                    <Badge key={placa} variant="secondary" className="text-xs px-2 py-1">
                      {placa}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedPlacas, setSelectedPlacas, placa)} />
                    </Badge>
                  ))}
                  {selectedModelos.map(modelo => (
                    <Badge key={modelo} variant="secondary" className="text-xs px-2 py-1">
                      {modelo}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedModelos, setSelectedModelos, modelo)} />
                    </Badge>
                  ))}
                  {selectedFabricantes.map(fabricante => (
                    <Badge key={fabricante} variant="secondary" className="text-xs px-2 py-1">
                      {fabricante}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedFabricantes, setSelectedFabricantes, fabricante)} />
                    </Badge>
                  ))}
                  {selectedCategorias.map(categoria => (
                    <Badge key={categoria} variant="secondary" className="text-xs px-2 py-1">
                      {categoria}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedCategorias, setSelectedCategorias, categoria)} />
                    </Badge>
                  ))}
                  {selectedTiposFrota.map(tipoFrota => (
                    <Badge key={tipoFrota} variant="secondary" className="text-xs px-2 py-1">
                      {tipoFrota}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedTiposFrota, setSelectedTiposFrota, tipoFrota)} />
                    </Badge>
                  ))}
                  {selectedBases.map(base => (
                    <Badge key={base} variant="secondary" className="text-xs px-2 py-1">
                      {base}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedBases, setSelectedBases, base)} />
                    </Badge>
                  ))}
                  {selectedStatuses.map(status => (
                    <Badge key={status} variant="secondary" className="text-xs px-2 py-1">
                      {status}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedStatuses, setSelectedStatuses, status)} />
                    </Badge>
                  ))}
                  {selectedTelemetrias.map(telemetria => (
                    <Badge key={telemetria} variant="secondary" className="text-xs px-2 py-1">
                      {telemetria}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter(selectedTelemetrias, setSelectedTelemetrias, telemetria)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Veículos */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full">
            <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Placa</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Reserva</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Modelo</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Categoria</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Ano Fabricação</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Base</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Tipo de Frota</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Status Checklist</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Telemetrias</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Status</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Entrada Oficina</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap">Previsão Saída</TableHead>
                <TableHead className="text-center text-xs sm:text-sm whitespace-nowrap min-w-[150px]">Observação (OBS)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVehicles.map((vehicle) => {
                const telemetrias = getTelemetrias(vehicle);
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell className="text-center font-medium text-xs sm:text-sm whitespace-nowrap">{vehicle.placa}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.placaReserva || '-'}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.modelo}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.categoria}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.anoFabricacao || '-'}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.base}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.tipoFrota || '-'}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.statusMoki || '-'}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      {telemetrias.length > 0 ? (
                        <div className="flex flex-col gap-0.5 items-center">
                          {telemetrias.map((tel, idx) => (
                            <span key={idx} className="text-xs font-medium text-primary">{tel}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <div className="h-3 w-3 sm:h-4 sm:w-4">
                          {getStatusIcon(vehicle.status)}
                        </div>
                        <div className="hidden sm:block">
                          {getStatusBadge(vehicle.status)}
                        </div>
                        <div className="sm:hidden">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {vehicle.status.split(' ')[0]}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.entradaOFC || '-'}</TableCell>
                    <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">{vehicle.previsaoSaida || '-'}</TableCell>
                    <TableCell className="text-center min-w-[150px] sm:min-w-[200px] whitespace-nowrap">
                      <div className="text-xs sm:text-sm">
                        {vehicle.motivo || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Paginação */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="text-xs sm:text-sm text-muted-foreground">
                <div className="block sm:hidden">
                  {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} de {filteredVehicles.length}
                </div>
                <div className="hidden sm:block">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredVehicles.length)} de {filteredVehicles.length} veículos
                  {searchPlate && ` • Filtrado por placa: "${searchPlate}"`}
                  {selectedBases.length > 0 && ` • Bases: ${selectedBases.length}`}
                  {selectedStatuses.length > 0 && ` • Status: ${selectedStatuses.length}`}
                </div>
              </div>
              
              {/* Select para itens por página */}
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm text-muted-foreground">Linhas por página:</label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                  <SelectTrigger className="w-16 sm:w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="-1">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
              
            {/* Controles de paginação - só aparecem quando não é "Todos" */}
            {!isShowAll && totalPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-xs sm:text-sm"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline mr-1">Próxima</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
