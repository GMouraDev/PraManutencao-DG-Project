import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statesData, fleetVehicles } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Car, BarChart3, Table } from "lucide-react";
import { useMemo } from "react";

export const FleetAnalysis = () => {
  // Calcular dados reais da planilha Excel
  const fleetStats = useMemo(() => {
    const total = fleetVehicles.length;
    
    // Veículos em manutenção (oficinas)
    const manutencao = fleetVehicles.filter(v => 
      ['Em Oficina - Externo', 'Em Oficina - Rentals', 'Em Oficina - Trois', 'PRA Reboque'].includes(v.status)
    ).length;
    
    // Veículos operacionais
    const operacionais = total - manutencao;
    
    // Agrupar por UF
    const stateStats = fleetVehicles.reduce((acc, vehicle) => {
      const uf = vehicle.uf || 'N/A';
      if (!acc[uf]) {
        acc[uf] = {
          state: uf,
          totalVehicles: 0,
          vehiclesInMaintenance: 0
        };
      }
      acc[uf].totalVehicles++;
      if (['Em Oficina - Externo', 'Em Oficina - Rentals', 'Em Oficina - Trois', 'PRA Reboque'].includes(vehicle.status)) {
        acc[uf].vehiclesInMaintenance++;
      }
      return acc;
    }, {} as Record<string, { state: string; totalVehicles: number; vehiclesInMaintenance: number }>);
    
    const statesData = Object.values(stateStats);
    const topStates = statesData
      .sort((a, b) => b.vehiclesInMaintenance - a.vehiclesInMaintenance)
      .slice(0, 10);
    
    return {
      total,
      manutencao,
      operacionais,
      statesData,
      topStates
    };
  }, []);

  const pieData = [
    { name: "Em Manutenção", value: fleetStats.manutencao },
    { name: "Operacionais", value: fleetStats.operacionais },
  ];

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  return (
    <div id="fleet" className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader className="p-4 sm:p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Status da Frota
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[180px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 30;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="hsl(var(--foreground))"
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          className="text-sm font-medium"
                        >
                          {`${name}: ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={60}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), "Veículos"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
              <div className="text-center p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Total da Frota</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">{fleetStats.total.toLocaleString()}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Em Manutenção</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">{fleetStats.manutencao.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="p-4 sm:p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Veículos em Manutenção por Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fleetStats.topStates} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    stroke="hsl(var(--border))"
                    domain={[0, 'dataMax']}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="state" 
                    className="text-xs"
                    width={60}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, "Veículos"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar 
                    dataKey="vehiclesInMaintenance" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 8, 8, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-primary/20">
        <CardHeader className="p-4 sm:p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Table className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Detalhamento por Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 sm:px-3 text-xs font-semibold">Estado</th>
                  <th className="text-right py-2 px-2 sm:px-3 text-xs font-semibold">Em Manutenção</th>
                  <th className="text-right py-2 px-2 sm:px-3 text-xs font-semibold">Total de Veículos</th>
                  <th className="text-right py-2 px-2 sm:px-3 text-xs font-semibold">% em Manutenção</th>
                </tr>
              </thead>
              <tbody>
                {fleetStats.statesData
                  .sort((a, b) => b.vehiclesInMaintenance - a.vehiclesInMaintenance)
                  .map((state) => {
                    const percentage = state.totalVehicles > 0 ? ((state.vehiclesInMaintenance / state.totalVehicles) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={state.state} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium">{state.state}</td>
                        <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-right">{state.vehiclesInMaintenance}</td>
                        <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-right">{state.totalVehicles}</td>
                        <td className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-right">
                          <span className="px-1 sm:px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                            {percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
