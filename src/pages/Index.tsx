import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { BrazilMap } from "@/components/BrazilMap";
import { FleetAnalysis } from "@/components/FleetAnalysis";
import { Car, Wrench, UserX, AlertTriangle, MapIcon, Activity, TrendingUp, CheckCircle } from "lucide-react";
import { statesData, fleetVehicles } from "@/data/mockData";
import { useMemo } from "react";

const Index = () => {
  // Calcular estatísticas reais da planilha Excel
  const fleetStats = useMemo(() => {
    const total = fleetVehicles.length;
    
    // CARD 2: Veículos em operação - APENAS "Em Operação" + "Veículo Alugado"
    const emOperacao = fleetVehicles.filter(v => v.status === 'Em Operação').length;
    const veiculoAlugado = fleetVehicles.filter(v => v.status === 'Veículo Alugado').length;
    const operacao = emOperacao + veiculoAlugado;
    
    // CARD 3: Veículos em manutenção (oficinas) - com detalhamento
    const manutencaoExterno = fleetVehicles.filter(v => v.status === 'Em Oficina - Externo').length;
    const manutencaoRentals = fleetVehicles.filter(v => v.status === 'Em Oficina - Rentals').length;
    const manutencaoTrois = fleetVehicles.filter(v => v.status === 'Em Oficina - Trois').length;
    const aguardandoOficina = fleetVehicles.filter(v => v.status === 'Aguardando Oficina').length;
    const praReboque = fleetVehicles.filter(v => v.status === 'PRA Reboque').length;
    const manutencao = manutencaoExterno + manutencaoRentals + manutencaoTrois + praReboque;
    
    // CARD 4: Veículos ociosos
    const semMotorista = fleetVehicles.filter(v => v.status === 'Sem Motorista').length;
    const semRota = fleetVehicles.filter(v => v.status === 'Sem Rota').length;
    const indisponivel = fleetVehicles.filter(v => v.status === 'Indisponível').length;
    const folga = fleetVehicles.filter(v => v.status === 'Folga').length;
    const treinamento = fleetVehicles.filter(v => v.status === 'Treinamento').length;
    const disponivel = fleetVehicles.filter(v => v.status === 'Disponível').length;
    const veiculoPronto = fleetVehicles.filter(v => v.status === 'Veículo Pronto').length;
    const mobilizacao = fleetVehicles.filter(v => v.status === 'Mobilização').length;
    const posOficina = fleetVehicles.filter(v => v.status === 'Pós-Oficina').length;
    const ociosos = semMotorista + semRota + indisponivel + folga + treinamento + disponivel + veiculoPronto + mobilizacao + posOficina + aguardandoOficina;
    
    // CARD 5: Disponibilidade = Total - Manutenção (+ Reserva se existir)
    // Nota: Por enquanto não há campo de reserva, então é apenas Total - Manutenção
    const disponibilidade = total - manutencao;
    const disponibilidadePercentage = total > 0 ? ((disponibilidade / total) * 100).toFixed(1) : '0.0';
    
    // CARD 6: Utilizados = Disponibilidade - Ociosos
    const utilizados = disponibilidade - ociosos;
    const utilizadosPercentage = disponibilidade > 0 ? ((utilizados / disponibilidade) * 100).toFixed(1) : '0.0';
    
    const maintenancePercentage = total > 0 ? ((manutencao / total) * 100).toFixed(1) : '0.0';
    const operationPercentage = total > 0 ? ((operacao / total) * 100).toFixed(1) : '0.0';
    const ociososPercentage = total > 0 ? ((ociosos / total) * 100).toFixed(1) : '0.0';
    
    // Contar bases únicas
    const uniqueBases = Array.from(new Set(fleetVehicles.map(v => v.base))).length;
    
    return {
      total,
      operacao,
      manutencao,
      ociosos,
      disponibilidade,
      utilizados,
      maintenancePercentage,
      operationPercentage,
      ociososPercentage,
      disponibilidadePercentage,
      utilizadosPercentage,
      uniqueBases,
      // Dados detalhados para tooltips
      totalDetalhado: [
        { label: 'Em Operação', value: operacao },
        { label: 'Em Manutenção', value: manutencao },
        { label: 'Ociosos', value: ociosos },
        { label: 'Disponibilidade', value: disponibilidade },
        { label: 'Utilizados', value: utilizados }
      ],
      operacaoDetalhado: [
        { label: 'Em Operação', value: emOperacao },
        { label: 'Veículo Alugado', value: veiculoAlugado }
      ],
      manutencaoDetalhado: [
        { label: 'Em Oficina - Externo', value: manutencaoExterno },
        { label: 'Em Oficina - Rentals', value: manutencaoRentals },
        { label: 'Em Oficina - Trois', value: manutencaoTrois },
        { label: 'PRA Reboque', value: praReboque }
      ],
      ociososDetalhado: [
        { label: 'Sem Motorista', value: semMotorista },
        { label: 'Sem Rota', value: semRota },
        { label: 'Indisponível', value: indisponivel },
        { label: 'Folga', value: folga },
        { label: 'Treinamento', value: treinamento },
        { label: 'Disponível', value: disponivel },
        { label: 'Veículo Pronto', value: veiculoPronto },
        { label: 'Mobilização', value: mobilizacao },
        { label: 'Pós-Oficina', value: posOficina },
        { label: 'Aguardando Oficina', value: aguardandoOficina }
      ]
    };
  }, []);

  const regions = Array.from(new Set(statesData.map(s => {
    if (s.state === "RS" || s.state === "SC") return "Sul";
    return "Sudeste";
  })));

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Overview Gestão de Frota
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Visão completa da manutenção e análise de custos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {/* CARD 1: Total de Veículos */}
          <MetricCard
            title="Total de Veículos"
            value={fleetStats.total.toLocaleString()}
            icon={Car}
            trend={{ value: 5.2, isPositive: true }}
            tooltipData={fleetStats.totalDetalhado}
          />
          
          {/* CARD 2: Em Operação */}
          <MetricCard
            title="Em Operação"
            value={fleetStats.operacao.toLocaleString()}
            icon={Car}
            subtitle={`${fleetStats.operationPercentage}% da frota`}
            tooltipData={fleetStats.operacaoDetalhado}
          />
          
          {/* CARD 3: Em Manutenção */}
          <MetricCard
            title="Em Manutenção"
            value={fleetStats.manutencao.toLocaleString()}
            icon={Wrench}
            subtitle={`${fleetStats.maintenancePercentage}% da frota`}
            tooltipData={fleetStats.manutencaoDetalhado}
          />
          
          {/* CARD 4: Ociosos */}
          <MetricCard
            title="Ociosos"
            value={fleetStats.ociosos.toLocaleString()}
            icon={UserX}
            subtitle={`${fleetStats.ociososPercentage}% da frota`}
            tooltipData={fleetStats.ociososDetalhado}
          />
          
          {/* CARD 5: Disponibilidade */}
          <MetricCard
            title="Disponibilidade"
            value={fleetStats.disponibilidade.toLocaleString()}
            icon={Activity}
            subtitle={`${fleetStats.disponibilidadePercentage}% da frota`}
          />
          
          {/* CARD 6: Utilizados */}
          <MetricCard
            title="Utilizados"
            value={fleetStats.utilizados.toLocaleString()}
            icon={CheckCircle}
            subtitle={`${fleetStats.utilizadosPercentage}% da disponibilidade`}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <BrazilMap />
          <FleetAnalysis />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
