import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { fleetVehicles } from "@/data/mockData";
import { Vehicle, FleetStatus } from "@/types/fleet";
import { useState, useMemo } from "react";
import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AlertCircle, Filter, MapPin, ChevronLeft, ChevronRight, Building2, Clock, Car, Search, X, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function IdleFleet() {
  // Filtros principais
  const [selectedUFs, setSelectedUFs] = useState<string[]>([]);
  const [selectedGestores, setSelectedGestores] = useState<string[]>([]);
  const [selectedBases, setSelectedBases] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Filtros da tabela (por coluna)
  const [filterPlaca, setFilterPlaca] = useState('');
  const [filterTipoFrota, setFilterTipoFrota] = useState('');
  const [filterAnoModelo, setFilterAnoModelo] = useState('');
  const [filterModelo, setFilterModelo] = useState('');
  const [filterObservacao, setFilterObservacao] = useState('');
  const [filterEntrada, setFilterEntrada] = useState('');
  const [filterPrevisao, setFilterPrevisao] = useState('');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Controle de visibilidade dos filtros da tabela
  const [showTableFilters, setShowTableFilters] = useState(false);

  // Filtrar apenas veículos ociosos (coluna AO)
  const idleVehicles = useMemo(() => {
    return fleetVehicles.filter(v => v.resumoStatus === "Frota Ociosa");
  }, []);

  // Obter valores únicos para filtros
  const uniqueUFs = useMemo(() => 
    Array.from(new Set(idleVehicles.map(v => v.uf).filter(Boolean))).sort(),
    [idleVehicles]
  );

  const uniqueGestores = useMemo(() => 
    Array.from(new Set(idleVehicles.map(v => v.gestor).filter(Boolean))).sort(),
    [idleVehicles]
  );

  const uniqueBases = useMemo(() => 
    Array.from(new Set(idleVehicles.map(v => v.base).filter(Boolean))).sort(),
    [idleVehicles]
  );

  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(idleVehicles.map(v => v.status))).sort(),
    [idleVehicles]
  );

  // Filtrar veículos baseado nos filtros principais
  const filteredByMainFilters = useMemo(() => {
    return idleVehicles.filter(vehicle => {
      const matchesUF = selectedUFs.length === 0 || selectedUFs.includes(vehicle.uf);
      const matchesGestor = selectedGestores.length === 0 || (vehicle.gestor && selectedGestores.includes(vehicle.gestor));
      const matchesBase = selectedBases.length === 0 || selectedBases.includes(vehicle.base);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(vehicle.status);
      
      return matchesUF && matchesGestor && matchesBase && matchesStatus;
    });
  }, [idleVehicles, selectedUFs, selectedGestores, selectedBases, selectedStatuses]);

  // Filtrar veículos baseado nos filtros da tabela
  const filteredVehicles = useMemo(() => {
    return filteredByMainFilters.filter(vehicle => {
      const matchesPlaca = !filterPlaca || vehicle.placa.toLowerCase().includes(filterPlaca.toLowerCase());
      const tipoFrota = vehicle.tipoFrotaManutencao || vehicle.tipoFrota || '';
      const matchesTipoFrota = !filterTipoFrota || tipoFrota.toLowerCase().includes(filterTipoFrota.toLowerCase());
      const anoModelo = String(vehicle.anoFabricacao || '');
      const matchesAnoModelo = !filterAnoModelo || anoModelo.includes(filterAnoModelo);
      const matchesModelo = !filterModelo || (vehicle.modelo || '').toLowerCase().includes(filterModelo.toLowerCase());
      const matchesObservacao = !filterObservacao || (vehicle.motivo || '').toLowerCase().includes(filterObservacao.toLowerCase());
      const matchesEntrada = !filterEntrada || (vehicle.entradaOFC || '').includes(filterEntrada);
      const matchesPrevisao = !filterPrevisao || (vehicle.previsaoSaida || '').includes(filterPrevisao);
      
      return matchesPlaca && matchesTipoFrota && matchesAnoModelo && matchesModelo && 
             matchesObservacao && matchesEntrada && matchesPrevisao;
    });
  }, [filteredByMainFilters, filterPlaca, filterTipoFrota, filterAnoModelo, filterModelo, 
      filterObservacao, filterEntrada, filterPrevisao]);

  // Reset página quando filtros mudam
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedUFs, selectedGestores, selectedBases, selectedStatuses, itemsPerPage, 
      filterPlaca, filterTipoFrota, filterAnoModelo, filterModelo, filterObservacao, filterEntrada, filterPrevisao]);

  // Paginação
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Calcular dias parado
  const calculateDaysStopped = (entradaOFC: string | null): number => {
    if (!entradaOFC) return 0;
    
    try {
      // Formato esperado: DD/MM/YYYY
      const [day, month, year] = entradaOFC.split('/');
      const entradaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - entradaDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  // Dados para gráfico de barras - Tipo de Frota (Coluna X)
  const tipoFrotaData = useMemo(() => {
    const tipoFrotaCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      const tipoFrota = vehicle.tipoFrotaManutencao || vehicle.tipoFrota || 'N/A';
      tipoFrotaCount[tipoFrota] = (tipoFrotaCount[tipoFrota] || 0) + 1;
    });

    return Object.entries(tipoFrotaCount)
      .map(([tipoFrota, count]) => ({ tipoFrota, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  // Dados para gráfico de barras - Gestores
  const gestoresData = useMemo(() => {
    const gestorCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      const gestor = vehicle.gestor || 'N/A';
      gestorCount[gestor] = (gestorCount[gestor] || 0) + 1;
    });

    return Object.entries(gestorCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredVehicles]);

  // Dados para tabela de status
  const statusData = useMemo(() => {
    const statusCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      statusCount[vehicle.status] = (statusCount[vehicle.status] || 0) + 1;
    });

    return Object.entries(statusCount)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Sem Motorista': <Users className="h-4 w-4" />,
      'Sem Rota': <AlertCircle className="h-4 w-4" />,
      'Indisponível': <AlertCircle className="h-4 w-4" />,
      'Folga': <Clock className="h-4 w-4" />,
      'Treinamento': <Building2 className="h-4 w-4" />,
      'Disponível': <Car className="h-4 w-4" />,
      'Veículo Pronto': <Car className="h-4 w-4" />,
      'Pós-Oficina': <Building2 className="h-4 w-4" />,
      'Mobilização': <Car className="h-4 w-4" />,
      'Falta': <AlertCircle className="h-4 w-4" />,
      'Devolução': <AlertCircle className="h-4 w-4" />,
      'Sinistrado - PT': <AlertCircle className="h-4 w-4" />,
    };
    return icons[status] || <AlertCircle className="h-4 w-4" />;
  };

  const clearAllFilters = () => {
    setSelectedUFs([]);
    setSelectedGestores([]);
    setSelectedBases([]);
    setSelectedStatuses([]);
    setFilterPlaca('');
    setFilterTipoFrota('');
    setFilterAnoModelo('');
    setFilterModelo('');
    setFilterObservacao('');
    setFilterEntrada('');
    setFilterPrevisao('');
  };

  const hasActiveFilters = selectedUFs.length > 0 || selectedGestores.length > 0 || 
    selectedBases.length > 0 || selectedStatuses.length > 0 ||
    filterPlaca || filterTipoFrota || filterAnoModelo || filterModelo || 
    filterObservacao || filterEntrada || filterPrevisao;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Panorama - Frota Ociosa
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredVehicles.length} Total de Placas
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-primary/10"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Filtros */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* UF */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  UF
                </label>
                <MultiSelect
                  options={uniqueUFs.map(uf => ({ label: uf, value: uf }))}
                  selected={selectedUFs}
                  onChange={setSelectedUFs}
                  placeholder="Selecione UF..."
                />
              </div>

              {/* Gestores */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gestores</label>
                <MultiSelect
                  options={uniqueGestores.map(gestor => ({ label: gestor, value: gestor }))}
                  selected={selectedGestores}
                  onChange={setSelectedGestores}
                  placeholder="Selecione Gestores..."
                />
              </div>

              {/* Base Operacional */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Operacional</label>
                <MultiSelect
                  options={uniqueBases.map(base => ({ label: base, value: base }))}
                  selected={selectedBases}
                  onChange={setSelectedBases}
                  placeholder="Selecione Bases..."
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <MultiSelect
                  options={uniqueStatuses.map(status => ({ label: status, value: status }))}
                  selected={selectedStatuses}
                  onChange={setSelectedStatuses}
                  placeholder="Selecione Status..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Status - Minimalista */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {/* Card Total - Primeiro */}
              <Card className="border border-primary/30 bg-primary/5 hover:border-primary/50 transition-colors flex-1 min-w-[150px]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground font-semibold">Total</p>
                      <p className="text-xl font-bold text-primary">{filteredVehicles.length}</p>
                    </div>
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cards de Status */}
              {statusData.map(({ status, count }) => (
                <Card key={status} className="border border-border/50 hover:border-primary/30 transition-colors flex-1 min-w-[150px]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground truncate" title={status}>{status}</p>
                        <p className="text-xl font-bold text-foreground">{count}</p>
                      </div>
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                        {getStatusIcon(status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Tipo de Frota */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Frota</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tipoFrotaData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis 
                    type="category" 
                    dataKey="tipoFrota" 
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Gestores */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Gestores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gestoresData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Veículos */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Veículos Ociosos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTableFilters(!showTableFilters)}
                className="h-8 gap-2"
              >
                <Filter className="h-4 w-4" />
                {showTableFilters ? (
                  <>
                    <span className="hidden sm:inline">Ocultar Filtros</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
            ) : (
                  <>
                    <span className="hidden sm:inline">Mostrar Filtros</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
            )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">PLACA</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterPlaca}
                              onChange={(e) => setFilterPlaca(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterPlaca && (
                              <button
                                onClick={() => setFilterPlaca('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">TIPO DE FROTA</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterTipoFrota}
                              onChange={(e) => setFilterTipoFrota(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterTipoFrota && (
                              <button
                                onClick={() => setFilterTipoFrota('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">ANO MODELO</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterAnoModelo}
                              onChange={(e) => setFilterAnoModelo(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterAnoModelo && (
                              <button
                                onClick={() => setFilterAnoModelo('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">MODELO</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterModelo}
                              onChange={(e) => setFilterModelo(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterModelo && (
                              <button
                                onClick={() => setFilterModelo('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap min-w-[200px] p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">OBSERVAÇÃO</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterObservacao}
                              onChange={(e) => setFilterObservacao(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterObservacao && (
                              <button
                                onClick={() => setFilterObservacao('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">ENTRADA</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterEntrada}
                              onChange={(e) => setFilterEntrada(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterEntrada && (
                              <button
                                onClick={() => setFilterEntrada('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">PREVISÃO</span>
                        {showTableFilters && (
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                            <Input
                              value={filterPrevisao}
                              onChange={(e) => setFilterPrevisao(e.target.value)}
                              placeholder="Filtrar..."
                              className="h-7 pl-7 pr-7 text-xs"
                            />
                            {filterPrevisao && (
                              <button
                                onClick={() => setFilterPrevisao('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap p-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">DIAS PARADO</span>
                        {showTableFilters && <div className="h-7"></div>}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVehicles.map((vehicle) => {
                    const diasParado = calculateDaysStopped(vehicle.entradaOFC);
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell className="text-center font-medium whitespace-nowrap">{vehicle.placa}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{vehicle.tipoFrotaManutencao || vehicle.tipoFrota || '-'}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{vehicle.anoFabricacao || '-'}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{vehicle.modelo || '-'}</TableCell>
                        <TableCell className="text-left min-w-[200px]">
                          <div className="whitespace-normal break-words text-sm">
                            {vehicle.motivo || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap">{vehicle.entradaOFC || '-'}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{vehicle.previsaoSaida || '-'}</TableCell>
                        <TableCell className="text-center whitespace-nowrap font-semibold">{diasParado}</TableCell>
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
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredVehicles.length)} de {filteredVehicles.length} veículos
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Itens por página:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-xs sm:text-sm text-muted-foreground min-w-[100px] text-center">
                  Página {currentPage} de {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

