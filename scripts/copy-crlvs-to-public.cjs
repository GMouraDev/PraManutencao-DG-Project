const fs = require('fs');
const path = require('path');

// NOTA: Este script foi usado para copiar arquivos de src/data/CRLVS para public/data/CRLVS
// Os arquivos agora estão diretamente em public/data/CRLVS e não precisam mais ser copiados de src
// Este script pode ser mantido caso seja necessário copiar arquivos de outra localização no futuro

// Diretório de destino (public/data/CRLVS)
const destDir = path.join(__dirname, '../public/data/CRLVS');

console.log('ℹ️  Os arquivos CRLVS já estão em public/data/CRLVS');
console.log('ℹ️  Se precisar copiar arquivos de outra localização, modifique o script');
console.log('✅ Arquivos prontos para uso em public/data/CRLVS');

