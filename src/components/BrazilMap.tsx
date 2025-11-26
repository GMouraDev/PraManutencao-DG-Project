import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statesData, fleetVehicles } from "@/data/mockData";
import { MapPin, TrendingUp, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";

export const BrazilMap = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Calcular dados dinâmicos por estado baseado nos veículos da planilha
  const stateStats = useMemo(() => {
    const stats: { 
      [key: string]: { 
        totalVehicles: number;
        statusCount: { [status: string]: number };
      } 
    } = {};
    
    fleetVehicles.forEach(vehicle => {
      const uf = vehicle.uf;
      if (!uf) return;
      
      if (!stats[uf]) {
        stats[uf] = {
          totalVehicles: 0,
          statusCount: {}
        };
      }
      
      stats[uf].totalVehicles++;
      
      // Contar por status
      const status = vehicle.status;
      if (!stats[uf].statusCount[status]) {
        stats[uf].statusCount[status] = 0;
      }
      stats[uf].statusCount[status]++;
    });
    
    return stats;
  }, []);

  const getStateData = (state: string) => {
    const dynamicData = stateStats[state];
    if (dynamicData) {
      // Obter bases únicas da UF
      const bases = Array.from(new Set(
        fleetVehicles
          .filter(v => v.uf === state && v.base)
          .map(v => v.base)
      )).sort();
      
      return {
        state,
        totalVehicles: dynamicData.totalVehicles,
        statusCount: dynamicData.statusCount,
        bases
      };
    }
    return null;
  };

  // Get unique states with vehicles (baseado nos dados reais da planilha)
  const activeStates = useMemo(() => {
    const statesFromVehicles = Array.from(new Set(fleetVehicles.map(v => v.uf).filter(Boolean))).sort();
    return statesFromVehicles;
  }, []);


  const getRegionColor = (state: string) => {
    const regions: { [key: string]: string } = {
      'RS': 'from-primary/10 to-primary/20 border-primary/30 hover:border-primary/50',
      'SC': 'from-primary/15 to-primary/25 border-primary/35 hover:border-primary/55',
      'PR': 'from-primary/20 to-primary/30 border-primary/40 hover:border-primary/60',
      'SP': 'from-primary/10 to-primary/20 border-primary/30 hover:border-primary/50',
      'RJ': 'from-primary/15 to-primary/25 border-primary/35 hover:border-primary/55',
      'MG': 'from-primary/20 to-primary/30 border-primary/40 hover:border-primary/60',
      'ES': 'from-primary/10 to-primary/20 border-primary/30 hover:border-primary/50',
    };
    return regions[state] || 'from-primary/10 to-primary/20 border-primary/30 hover:border-primary/50';
  };

  // Função para obter cor do card baseado no status
  const getStatusColor = (status: string): { border: string; text: string } => {
    const colors: { [key: string]: { border: string; text: string } } = {
      'Em Operação': { border: 'border-primary/30', text: 'text-primary' },
      'Sem Motorista': { border: 'border-foreground/20', text: 'text-foreground' },
      'Sem Rota': { border: 'border-foreground/20', text: 'text-foreground' },
      'PRA Reboque': { border: 'border-destructive/30', text: 'text-destructive' },
      'Em Oficina - Externo': { border: 'border-primary/30', text: 'text-primary' },
      'Em Oficina - Rentals': { border: 'border-primary/30', text: 'text-primary' },
      'Em Oficina - Trois': { border: 'border-primary/30', text: 'text-primary' },
      'Aguardando Oficina': { border: 'border-primary/30', text: 'text-primary' },
      'Disponível': { border: 'border-primary/30', text: 'text-primary' },
      'Veículo Pronto': { border: 'border-primary/30', text: 'text-primary' },
      'Mobilização': { border: 'border-primary/30', text: 'text-primary' },
      'Pós-Oficina': { border: 'border-primary/30', text: 'text-primary' },
      'Veículo Alugado': { border: 'border-primary/30', text: 'text-primary' },
      'Indisponível': { border: 'border-foreground/20', text: 'text-muted-foreground' },
      'Folga': { border: 'border-foreground/20', text: 'text-muted-foreground' },
      'Treinamento': { border: 'border-foreground/20', text: 'text-muted-foreground' },
      'Administração': { border: 'border-foreground/20', text: 'text-muted-foreground' },
      'Sinistrado - PT': { border: 'border-destructive/30', text: 'text-destructive' },
      'Venda': { border: 'border-foreground/20', text: 'text-muted-foreground' },
      'Desmobilizado': { border: 'border-foreground/20', text: 'text-muted-foreground' },
      'Devolução': { border: 'border-destructive/30', text: 'text-destructive' },
      'Falta': { border: 'border-destructive/30', text: 'text-destructive' },
    };
    return colors[status] || { border: 'border-primary/20', text: 'text-primary' };
  };

  return (
    <Card id="map" className="overflow-hidden border-primary/20 shadow-lg bg-card">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Detalhamento por Estado
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Selecione um estado para visualizar informações detalhadas
        </p>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* Grid responsivo de estados */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Estados com Veículos</h3>
          
          {/* Grid que se adapta ao espaço disponível */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {activeStates.map((state) => {
              const stateData = getStateData(state);
              const isSelected = selectedState === state;
              
              return (
                <div
                  key={state}
                  onClick={() => setSelectedState(isSelected ? null : state)}
                  className={`relative cursor-pointer rounded-lg p-2 sm:p-3 bg-gradient-to-br ${getRegionColor(state)} 
                    border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 group w-full
                    ${isSelected ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1 sm:mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-lg font-bold text-foreground truncate">{state}</h3>
                    </div>
                    <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'} transition-colors flex-shrink-0 ml-1`} />
                  </div>
                  
                  {stateData && (() => {
                    // Calcular manutenção baseado nos status
                    const manutencaoStatus = ['Em Oficina - Externo', 'Em Oficina - Rentals', 'Em Oficina - Trois', 'Aguardando Oficina', 'PRA Reboque'];
                    const manutencaoCount = manutencaoStatus.reduce((sum, status) => sum + (stateData.statusCount[status] || 0), 0);
                    
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1 truncate">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            Total
                          </span>
                          <span className="font-semibold text-xs">{stateData.totalVehicles}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1 truncate">
                            <TrendingUp className="h-3 w-3 flex-shrink-0" />
                            Manutenção
                          </span>
                          <Badge variant="secondary" className="text-xs px-1 py-0">{manutencaoCount}</Badge>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>

        {selectedState && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-card to-primary/5 rounded-xl border border-primary/20 p-3 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  {selectedState} - Detalhes
                </h3>
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-primary/10"
                >
                  Fechar
                </button>
              </div>

              {getStateData(selectedState) && (() => {
                const stateData = getStateData(selectedState);
                if (!stateData || !stateData.statusCount) return null;
                
                // Ordenar status por quantidade (maior para menor)
                const statusEntries = Object.entries(stateData.statusCount)
                  .filter(([_, count]) => count > 0)
                  .sort(([, a], [, b]) => b - a);
                
                return (
                  <>
                    {/* Card Total e Bases */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                      <div className="bg-card rounded-lg p-3 sm:p-4 border border-primary/20 w-full sm:w-auto sm:min-w-[200px]">
                        <p className="text-xs text-muted-foreground mb-1">Total de Veículos</p>
                        <p className="text-lg sm:text-2xl font-bold text-primary">{stateData.totalVehicles || 0}</p>
                      </div>
                      {stateData.bases && stateData.bases.length > 0 && (
                        <div className="bg-card rounded-lg p-3 sm:p-4 border border-primary/20 flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-2">Bases ({stateData.bases.length})</p>
                          <div className="flex flex-wrap gap-1.5">
                            {stateData.bases.map((base, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                              >
                                {base}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Cards dinâmicos de todos os status */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
                      {statusEntries.map(([status, count]) => {
                        const { border, text } = getStatusColor(status);
                        
                        return (
                          <div 
                            key={status} 
                            className={`bg-card rounded-lg p-3 sm:p-4 border ${border}`}
                          >
                            <p className="text-xs text-muted-foreground mb-1 truncate" title={status}>{status}</p>
                            <p className={`text-lg sm:text-2xl font-bold ${text}`}>
                              {count}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
