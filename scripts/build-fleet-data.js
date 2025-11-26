import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando processamento do Excel para dados de frota...');

try {
  // Compilar e executar o script TypeScript
  const scriptPath = path.join(__dirname, '../src/scripts/processExcelFleet.ts');
  
  console.log('📦 Compilando TypeScript...');
  execSync('npx tsc src/scripts/processExcelFleet.ts --outDir dist --target es2020 --module commonjs --esModuleInterop --skipLibCheck', { stdio: 'inherit' });
  
  console.log('🔄 Executando processamento do Excel...');
  execSync('node dist/scripts/processExcelFleet.js', { stdio: 'inherit' });
  
  console.log('✅ Processamento concluído com sucesso!');
  
} catch (error) {
  console.error('❌ Erro durante o processamento:', error.message);
  process.exit(1);
}
