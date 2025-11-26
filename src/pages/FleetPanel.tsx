import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { fleetVehicles } from "@/data/mockData";
import { Vehicle, FleetStatus } from "@/types/fleet";
import { useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from "recharts";
import { MapPin, TrendingUp, Car, Wrench, Users, Activity, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Cores para os gráficos
const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function FleetPanel() {
  // Filtros principais
  const [selectedUFs, setSelectedUFs] = useState<string[]>([]);
  const [selectedAtuacoes, setSelectedAtuacoes] = useState<string[]>([]);
  const [selectedGestores, setSelectedGestores] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTipoPlacas, setSelectedTipoPlacas] = useState<string[]>([]);
  const [selectedResumoStatus, setSelectedResumoStatus] = useState<string[]>([]);

  // Obter valores únicos para filtros
  const uniqueUFs = useMemo(() => 
    Array.from(new Set(fleetVehicles.map(v => v.uf).filter(Boolean))).sort(),
    []
  );

  const uniqueStatuses = useMemo(() => 
    Array.from(new Set(fleetVehicles.map(v => v.status))).sort(),
    []
  );

  // Atuação (Coluna AD)
  const uniqueAtuacoes = useMemo(() => {
    return Array.from(new Set(fleetVehicles.map(v => v.atuacao).filter(Boolean))).sort();
  }, []);

  // Gestor (Coluna AB)
  const uniqueGestores = useMemo(() => {
    return Array.from(new Set(fleetVehicles.map(v => v.gestor).filter(Boolean))).sort();
  }, []);

  // Tipo de Placa (Coluna D)
  const uniqueTipoPlacas = useMemo(() => {
    return Array.from(new Set(fleetVehicles.map(v => v.tipoPlaca).filter(Boolean))).sort();
  }, []);

  // Resumo Status (Coluna AO)
  const uniqueResumoStatus = useMemo(() => {
    return Array.from(new Set(fleetVehicles.map(v => v.resumoStatus).filter(Boolean))).sort();
  }, []);

  // Filtrar veículos baseado nos filtros
  const filteredVehicles = useMemo(() => {
    return fleetVehicles.filter(vehicle => {
      const matchesUF = selectedUFs.length === 0 || selectedUFs.includes(vehicle.uf);
      const matchesAtuacao = selectedAtuacoes.length === 0 || (vehicle.atuacao && selectedAtuacoes.includes(vehicle.atuacao));
      const matchesGestor = selectedGestores.length === 0 || (vehicle.gestor && selectedGestores.includes(vehicle.gestor));
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(vehicle.status);
      const matchesTipoPlaca = selectedTipoPlacas.length === 0 || (vehicle.tipoPlaca && selectedTipoPlacas.includes(vehicle.tipoPlaca));
      const matchesResumoStatus = selectedResumoStatus.length === 0 || (vehicle.resumoStatus && selectedResumoStatus.includes(vehicle.resumoStatus));
      
      return matchesUF && matchesAtuacao && matchesGestor && matchesStatus && matchesTipoPlaca && matchesResumoStatus;
    });
  }, [selectedUFs, selectedAtuacoes, selectedGestores, selectedStatuses, selectedTipoPlacas, selectedResumoStatus]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const total = filteredVehicles.length;
    const emOperacao = filteredVehicles.filter(v => v.status === 'Em Operação').length;
    const emManutencao = filteredVehicles.filter(v => 
      ['Em Oficina - Externo', 'Em Oficina - Rentals', 'Em Oficina - Trois', 'Aguardando Oficina', 'PRA Reboque'].includes(v.status)
    ).length;
    const ociosos = filteredVehicles.filter(v => 
      ['Sem Motorista', 'Sem Rota', 'Indisponível', 'Folga', 'Treinamento'].includes(v.status)
    ).length;
    const disponivel = filteredVehicles.filter(v => 
      ['Disponível', 'Veículo Pronto', 'Mobilização', 'Pós-Oficina', 'Em Operação', 'Veículo Alugado'].includes(v.status)
    ).length;
    const utilizados = filteredVehicles.filter(v => 
      ['Em Operação', 'Veículo Alugado'].includes(v.status)
    ).length;

    const emOperacaoPercent = total > 0 ? ((emOperacao / total) * 100).toFixed(1) : '0.0';
    const emManutencaoPercent = total > 0 ? ((emManutencao / total) * 100).toFixed(1) : '0.0';
    const ociososPercent = total > 0 ? ((ociosos / total) * 100).toFixed(1) : '0.0';
    const disponivelPercent = total > 0 ? ((disponivel / total) * 100).toFixed(1) : '0.0';
    const utilizadosPercent = disponivel > 0 ? ((utilizados / disponivel) * 100).toFixed(1) : '0.0';

    return { 
      total, 
      emOperacao, 
      emManutencao, 
      ociosos,
      disponivel, 
      utilizados,
      emOperacaoPercent,
      emManutencaoPercent,
      ociososPercent,
      disponivelPercent,
      utilizadosPercent
    };
  }, [filteredVehicles]);

  // Dados para gráfico de status por UF
  const statusByUFData = useMemo(() => {
    const ufMap: { [key: string]: { [status: string]: number } } = {};
    
    filteredVehicles.forEach(vehicle => {
      const uf = vehicle.uf || 'N/A';
      if (!ufMap[uf]) {
        ufMap[uf] = {};
      }
      if (!ufMap[uf][vehicle.status]) {
        ufMap[uf][vehicle.status] = 0;
      }
      ufMap[uf][vehicle.status]++;
    });

    return Object.entries(ufMap).map(([uf, statuses]) => ({
      uf,
      ...statuses
    }));
  }, [filteredVehicles]);

  // Dados para gráfico de barras - Distribuição por Status
  const statusBarData = useMemo(() => {
    const statusCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      statusCount[vehicle.status] = (statusCount[vehicle.status] || 0) + 1;
    });

    return Object.entries(statusCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredVehicles]);

  // Dados para gráfico de barras - Fabricantes
  const fabricantesData = useMemo(() => {
    const fabricanteCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      const fabricante = vehicle.fabricante || 'N/A';
      fabricanteCount[fabricante] = (fabricanteCount[fabricante] || 0) + 1;
    });

    return Object.entries(fabricanteCount)
      .map(([fabricante, count]) => ({ fabricante, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  // Dados para gráfico de barras - Todas as Bases
  const allBasesData = useMemo(() => {
    const baseCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      const base = vehicle.base || 'N/A';
      baseCount[base] = (baseCount[base] || 0) + 1;
    });

    return Object.entries(baseCount)
      .map(([base, count]) => ({ base, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  // Dados para gráfico de área - Resumo de Status (baseado na coluna AO)
  const statusTrendData = useMemo(() => {
    const resumoStatusCount: { [key: string]: number } = {};
    
    // Contar veículos por resumoStatus
    filteredVehicles.forEach(vehicle => {
      const resumoStatus = vehicle.resumoStatus || 'Sem Classificação';
      resumoStatusCount[resumoStatus] = (resumoStatusCount[resumoStatus] || 0) + 1;
    });

    // Ordenar por valor (maior para menor) e retornar no formato esperado
    return Object.entries(resumoStatusCount)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  // Dados para gráfico de área - Distribuição por Categoria
  const categoryData = useMemo(() => {
    const categoryCount: { [key: string]: number } = {};
    
    filteredVehicles.forEach(vehicle => {
      const categoria = vehicle.categoria || 'N/A';
      categoryCount[categoria] = (categoryCount[categoria] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([categoria, count]) => ({ categoria, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredVehicles]);

  const clearAllFilters = () => {
    setSelectedUFs([]);
    setSelectedAtuacoes([]);
    setSelectedGestores([]);
    setSelectedStatuses([]);
    setSelectedTipoPlacas([]);
    setSelectedResumoStatus([]);
  };

  const hasActiveFilters = selectedUFs.length > 0 || selectedAtuacoes.length > 0 || 
    selectedGestores.length > 0 || selectedStatuses.length > 0 || selectedTipoPlacas.length > 0 || selectedResumoStatus.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Painel Frota
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Análise completa e visualização de dados da frota
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* UF - Filtro Principal */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  UF <span className="text-primary">*</span>
                </label>
                <MultiSelect
                  options={uniqueUFs.map(uf => ({ label: uf, value: uf }))}
                  selected={selectedUFs}
                  onChange={setSelectedUFs}
                  placeholder="Selecione UF..."
                />
              </div>

              {/* Atuação */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Atuação</label>
                <MultiSelect
                  options={uniqueAtuacoes.map(atuacao => ({ label: atuacao, value: atuacao }))}
                  selected={selectedAtuacoes}
                  onChange={setSelectedAtuacoes}
                  placeholder="Selecione Atuação..."
                />
              </div>

              {/* Gestor de Operação */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Gestor de Operação</label>
                <MultiSelect
                  options={uniqueGestores.map(gestor => ({ label: gestor, value: gestor }))}
                  selected={selectedGestores}
                  onChange={setSelectedGestores}
                  placeholder="Selecione Gestor..."
                />
              </div>

              {/* Tipo de Placa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Placa</label>
                <MultiSelect
                  options={uniqueTipoPlacas.map(tipoPlaca => ({ label: tipoPlaca, value: tipoPlaca }))}
                  selected={selectedTipoPlacas}
                  onChange={setSelectedTipoPlacas}
                  placeholder="Selecione Tipo..."
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

              {/* Resumo Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Resumo Status</label>
                <MultiSelect
                  options={uniqueResumoStatus.map(resumoStatus => ({ label: resumoStatus, value: resumoStatus }))}
                  selected={selectedResumoStatus}
                  onChange={setSelectedResumoStatus}
                  placeholder="Selecione Resumo Status..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo - Minimalista */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">Total de Veículos</p>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">Em Operação</p>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.emOperacao.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stats.emOperacaoPercent}% da frota</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">Em Manutenção</p>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.emManutencao.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stats.emManutencaoPercent}% da frota</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">Ociosos</p>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.ociosos.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stats.ociososPercent}% da frota</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">Disponibilidade</p>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.disponivel.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stats.disponivelPercent}% da frota</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-muted-foreground">Utilizados</p>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.utilizados.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{stats.utilizadosPercent}% da disponibilidade</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Distribuição por Status */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Fabricantes */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Fabricantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fabricantesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="fabricante" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Área - Distribuição por Categoria */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={Math.max(600, categoryData.length * 80)}>
                  <AreaChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="categoria" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Área - Resumo de Status */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Resumo de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={Math.max(600, statusTrendData.length * 80)}>
                  <AreaChart data={statusTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="status" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Barras - Todas as Bases */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Todas as Bases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={400} minWidth={600}>
                <BarChart data={allBasesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="base" 
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Barras Agrupadas - Status por UF */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Status por UF</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={statusByUFData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="uf" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Quantidade']}
                />
                <Legend />
                {uniqueStatuses.map((status, index) => (
                  <Bar 
                    key={status}
                    dataKey={status} 
                    stackId="a"
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    radius={index === uniqueStatuses.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

