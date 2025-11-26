# 📋 Instruções para Atualização de Dados

Este guia explica como atualizar os dados do sistema PRA Manutenção quando houver mudanças na planilha Excel.

## ⚡ Processo Rápido

**Resumo**: Atualize a planilha Excel e execute o script. É só isso!

1. ✅ Atualize o arquivo: `src/data/Controle Frota - Pralog.xlsx`
2. ✅ Execute o comando: `npm run process-full-excel`
3. ✅ Reinicie o servidor: `npm run dev`

Pronto! Os dados serão atualizados automaticamente.

## 🎯 Quando Atualizar

Atualize os dados sempre que:
- ✅ Novos veículos forem adicionados à frota
- ✅ Status de veículos forem alterados
- ✅ Dados de manutenção forem atualizados
- ✅ Novas bases ou oficinas forem cadastradas
- ✅ Preços de peças forem modificados

## 📁 Arquivo de Dados

O sistema processa automaticamente o arquivo:
```
src/data/Controle Frota - Pralog.xlsx
```

**⚠️ IMPORTANTE**: Mantenha sempre este arquivo atualizado com os dados mais recentes!

## 🚀 Processo de Atualização

### Passo 1: Preparar a Planilha

1. **Abra o arquivo Excel** `src/data/Controle Frota - Pralog.xlsx`
2. **Atualize os dados** conforme necessário:
   - Adicione novos veículos
   - Altere status existentes
   - Atualize informações de manutenção
   - Modifique dados de oficinas
3. **Salve o arquivo** mantendo o mesmo nome e localização

### Passo 2: Processar os Dados

Execute o comando para processar a planilha atualizada:

```bash
# No terminal, na pasta raiz do projeto
npm run process-full-excel
```

**Ou alternativamente:**
```bash
node scripts/process-full-excel.cjs
```

### Passo 3: Verificar o Resultado

O script irá:
- ✅ Processar todos os dados da planilha
- ✅ Converter datas do formato Excel para DD/MM/YYYY
- ✅ Extrair UF de cada veículo
- ✅ Atualizar o arquivo `src/data/mockData.ts`
- ✅ Gerar estatísticas do processamento

**Exemplo de saída esperada:**
```
🚀 Processando arquivo Excel completo com 1112 veículos...
📁 Carregando arquivo: C:\DIEGO\pramanutencao-21451\src\data\Controle Frota - Pralog.xlsx
✅ Aba encontrada: Base Frota - Pralog
📊 Total de linhas encontradas: 1113
✅ Processados 1112 veículos com sucesso
❌ 0 linhas com erro
✅ Arquivo mockData.ts atualizado com todos os dados do Excel

📊 Estatísticas dos dados processados do Excel:
   Total de veículos: 1112
   Em Operação: 646
   Em Manutenção: 0
   Sem Motorista: 25
   Sinistrados: 0
   Bases únicas: 47
   Fabricantes únicos: 17
   Categorias únicas: 12
   Tipos de Frota únicos: 4

🎉 Processamento completo concluído com sucesso!
```

### Passo 4: Reiniciar o Servidor

Após o processamento, reinicie o servidor de desenvolvimento:

```bash
# Pare o servidor (Ctrl+C) e execute novamente
npm run dev
```

## 🔧 Solução de Problemas

### Erro: "Arquivo não encontrado"
```
❌ Arquivo não encontrado: src/data/Controle Frota - Pralog.xlsx
```

**Solução**: Verifique se o arquivo Excel está no local correto:
```
src/data/Controle Frota - Pralog.xlsx
```

### Erro: "Aba específica não encontrada"
```
⚠️ Aba específica não encontrada, usando: Planilha1
```

**Solução**: O script procura por uma aba com "Base" e "Frota" no nome. Renomeie a aba para "Base Frota - Pralog" ou similar.

### Erro: "Nenhum veículo válido foi processado"
```
❌ Nenhum veículo válido foi processado
```

**Solução**: Verifique se:
- A planilha tem dados na coluna "PLACA"
- Os cabeçalhos estão corretos
- Não há linhas completamente vazias

### Dados não aparecem no frontend

**Solução**: 
1. Verifique se o processamento foi concluído com sucesso
2. Reinicie o servidor (`npm run dev`)
3. Limpe o cache do navegador (Ctrl+F5)

## 📊 Estrutura da Planilha

A planilha deve conter as seguintes colunas:

| Coluna | Descrição | Obrigatória |
|--------|-----------|-------------|
| PLACA | Placa do veículo | ✅ Sim |
| PLACA RESERVA | Placa reserva | ❌ Não |
| MODELO | Modelo do veículo | ❌ Não |
| FABRICANTE | Fabricante | ❌ Não |
| CATEGORIA | Categoria do veículo | ❌ Não |
| ANO FABRICAÇÃO | Ano de fabricação | ❌ Não |
| TIPO DE FROTA | Tipo da frota | ❌ Não |
| BASE | Base do veículo | ✅ Sim |
| STATUS | Status atual | ❌ Não |
| OBS | Observações | ❌ Não |
| ENTRADA | Data de entrada na oficina | ❌ Não |
| PREVISÃO | Previsão de saída | ❌ Não |
| UF | Estado (UF) | ❌ Não |
| ULTIMO CHECKLIST | Data do último checklist | ❌ Não |
| STATUS MOKI | Status do checklist (MOKI) | ❌ Não |
| GEOTAB | Telemetria Geotab (SIM/NÃO) | ❌ Não |
| T4S | Telemetria T4S (SIM/NÃO) | ❌ Não |
| SASCAR | Telemetria Sascar (SIM/NÃO) | ❌ Não |
| POOLTRACK | Telemetria Pooltrack (SIM/NÃO) | ❌ Não |
| GOLFLEET | Telemetria Golfleet (SIM/NÃO) | ❌ Não |

## 🎯 Dicas Importantes

1. **Backup**: Sempre faça backup da planilha antes de grandes alterações
2. **Formato de Data**: Use o formato brasileiro DD/MM/YYYY nas datas
3. **Consistência**: Mantenha os nomes das colunas exatamente como mostrado na tabela
4. **Teste**: Após atualizar, teste o sistema para garantir que tudo funciona
5. **Versionamento**: Considere versionar as planilhas para controle de mudanças

## 📞 Suporte

Se encontrar problemas durante a atualização:

1. Verifique se seguiu todos os passos
2. Consulte a seção "Solução de Problemas" acima
3. Entre em contato com a equipe de desenvolvimento

---
