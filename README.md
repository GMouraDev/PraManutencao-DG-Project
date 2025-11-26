# PRA Manutenção - Sistema de Gestão de Frota

Sistema de dashboard para gestão e análise de frota de veículos, desenvolvido para a Pralog. O sistema permite visualizar dados de manutenção, comparar preços de peças e analisar o status da frota em tempo real.

## 🚀 Sobre o Projeto

O **PRA Manutenção** é um dashboard interativo que oferece:

- **Visão Geral da Frota**: Métricas em tempo real sobre veículos em operação, manutenção e sem motorista
- **Mapa de Oficinas**: Visualização geográfica das oficinas por estado
- **Análise de Status**: Gráficos e estatísticas detalhadas da frota
- **Comparação de Preços**: Análise de custos de peças entre diferentes oficinas
- **Gestão de Frota**: Tabela completa com filtros avançados para busca e análise
- **Documentos Veículo**: Visualização e download de documentos CRLV organizados por locadora

### 📊 Dados Processados
- **1.112 veículos** processados da planilha Excel
- **47 bases** diferentes
- **17 fabricantes** de veículos
- **22 status** diferentes de veículos
- **Dados atualizados** em tempo real a partir do Excel

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts
- **Processamento**: Node.js + XLSX
- **Roteamento**: React Router

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd pramanutencao-21451

# 2. Instale as dependências
npm install

# 3. Execute o projeto em modo desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:8080
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Processar dados do Excel (veja instruções abaixo)
npm run process-full-excel
```

## 📋 Atualização de Dados

Para atualizar os dados do sistema com informações da planilha Excel, consulte o arquivo [INSTRUCOES_ATUALIZACAO.md](./INSTRUCOES_ATUALIZACAO.md).

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de interface
│   ├── BrazilMap.tsx   # Mapa de oficinas
│   ├── FleetAnalysis.tsx # Análise da frota
│   ├── FleetManagement.tsx # Gestão de frota
│   └── PartsComparison.tsx # Comparação de preços
├── data/
│   └── mockData.ts     # Dados processados do Excel
├── pages/              # Páginas da aplicação
├── types/              # Definições TypeScript
└── utils/              # Utilitários
```

## 🎯 Funcionalidades Principais

### Dashboard Principal
- Cards com métricas em tempo real
- Mapa interativo do Brasil com oficinas
- Gráficos de status da frota
- Comparação de preços de peças

### Gestão de Frota
- Tabela completa com 1.112 veículos
- Filtros avançados por placa, base, status, etc.
- Paginação otimizada
- Exportação de dados

### Documentos Veículo
- Organização por locadora (Arval, EVM, LM, Localiza, Movida, Propria, TKS)
- Visualização de PDFs em nova aba
- Download de documentos CRLV
- Interface modal para fácil navegação

### Análise de Dados
- Gráficos de pizza e barras
- Estatísticas por estado
- Análise de manutenção
- Comparação de custos

## 🔧 Configuração

O sistema está configurado para processar automaticamente dados do arquivo Excel localizado em:
```
src/data/Controle Frota - Pralog.xlsx
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação de atualização de dados ou entre em contato com a equipe de desenvolvimento.
