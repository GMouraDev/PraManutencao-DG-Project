# 📄 Instruções - Adicionar Documentos CRLV

## Como adicionar novos arquivos ou pastas

### ✅ Método Simples (Recomendado)

1. **Adicione os arquivos PDF na pasta `public/data/CRLVS/`**
   - Para adicionar em uma pasta existente: coloque o PDF dentro da pasta correspondente
     - Exemplo: `public/data/CRLVS/Arval/novo-arquivo.pdf`
   - Para criar uma nova pasta: crie a pasta e coloque os PDFs dentro
     - Exemplo: `public/data/CRLVS/NovaLocadora/documento.pdf`

2. **Execute o script para atualizar a lista:**
   ```bash
   npm run generate-documents-list
   ```
   Este script vai:
   - Escanear todas as pastas em `public/data/CRLVS`
   - Listar todos os arquivos PDF encontrados
   - Gerar automaticamente o arquivo `src/data/documentsList.ts`

3. **Pronto!** Os novos arquivos aparecerão automaticamente no sistema.

### 📁 Exemplo Prático

#### Adicionar arquivo em pasta existente (Arval):
```bash
# 1. Copie o arquivo para a pasta
cp documento.pdf public/data/CRLVS/Arval/

# 2. Execute o script
npm run generate-documents-list

# 3. Reinicie o servidor se estiver rodando
npm run dev
```

#### Criar uma nova pasta (exemplo: "NovaLocadora"):
```bash
# 1. Crie a pasta e adicione os PDFs
mkdir public/data/CRLVS/NovaLocadora
cp *.pdf public/data/CRLVS/NovaLocadora/

# 2. Execute o script
npm run generate-documents-list

# 3. Pronto! A nova pasta aparecerá automaticamente
```

### ⚠️ Importante

- **NÃO é necessário editar código manualmente**
- O script `generate-documents-list.cjs` atualiza automaticamente:
  - Lista de pastas (`folders`)
  - Lista de arquivos por pasta (`documentsByFolder`)
- Apenas execute o script após adicionar/remover arquivos

### 🔄 Fluxo de Trabalho

1. Adicionar/remover PDFs em `public/data/CRLVS/`
2. Executar: `npm run generate-documents-list`
3. Os arquivos aparecerão automaticamente no sistema

### 📊 Estatísticas Atuais

- **7 pastas** configuradas
- **339 arquivos PDF** no total
- Todas as pastas são detectadas automaticamente

---

**Dica:** Execute o script sempre que modificar os arquivos PDF para manter o sistema atualizado!

