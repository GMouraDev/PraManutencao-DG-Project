const fs = require('fs');
const path = require('path');

// Diretório onde estão os PDFs
const crlvsDir = path.join(__dirname, '../public/data/CRLVS');

// Função para listar arquivos PDF recursivamente
function listPDFFiles(dir, folderPath = '') {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursivamente listar arquivos nas subpastas
      const subFiles = listPDFFiles(fullPath, item);
      files.push(...subFiles);
    } else if (item.toLowerCase().endsWith('.pdf')) {
      files.push({
        folder: folderPath,
        file: item
      });
    }
  });

  return files;
}

// Gerar estrutura de documentos por pasta
function generateDocumentsList() {
  const allFiles = listPDFFiles(crlvsDir);
  const documentsByFolder = {};

  allFiles.forEach(({ folder, file }) => {
    if (!documentsByFolder[folder]) {
      documentsByFolder[folder] = [];
    }
    documentsByFolder[folder].push(file);
  });

  // Ordenar arquivos em cada pasta
  Object.keys(documentsByFolder).forEach((folder) => {
    documentsByFolder[folder].sort();
  });

  return documentsByFolder;
}

// Gerar lista de pastas
function generateFoldersList() {
  const folders = [];
  if (!fs.existsSync(crlvsDir)) {
    console.log('⚠️  Diretório public/data/CRLVS não encontrado!');
    return folders;
  }

  const items = fs.readdirSync(crlvsDir);
  items.forEach((item) => {
    const fullPath = path.join(crlvsDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      folders.push({
        name: item,
        path: item
      });
    }
  });

  return folders.sort((a, b) => a.name.localeCompare(b.name));
}

try {
  console.log('📋 Gerando lista de documentos...\n');

  const documentsByFolder = generateDocumentsList();
  const folders = generateFoldersList();

  // Gerar arquivo TypeScript com os dados
  const tsContent = `// Este arquivo é gerado automaticamente pelo script generate-documents-list.cjs
// Execute: npm run generate-documents-list

export const documentsByFolder: { [key: string]: string[] } = ${JSON.stringify(documentsByFolder, null, 2).replace(/"/g, '"')};

export const folders: Array<{ name: string; path: string }> = ${JSON.stringify(folders, null, 2).replace(/"/g, '"')};
`;

  const outputPath = path.join(__dirname, '../src/data/documentsList.ts');
  fs.writeFileSync(outputPath, tsContent);

  console.log('✅ Lista de documentos gerada com sucesso!');
  console.log(`📁 Pastas encontradas: ${folders.length}`);
  console.log('   ' + folders.map(f => f.name).join(', '));
  console.log('\n📄 Arquivos por pasta:');
  Object.keys(documentsByFolder).forEach((folder) => {
    console.log(`   ${folder}: ${documentsByFolder[folder].length} arquivos`);
  });
  console.log(`\n📝 Arquivo gerado: src/data/documentsList.ts`);
} catch (error) {
  console.error('❌ Erro ao gerar lista de documentos:', error);
  process.exit(1);
}

