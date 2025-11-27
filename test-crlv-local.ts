import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// === CORREÇÃO DO WORKER (O SEGREDO) ===
// O Node.js (ESM) no Windows precisa de uma URL de arquivo (`file://`) para o worker.
const workerSrcPath = path.resolve(
  process.cwd(), // Garante que partimos da raiz do projeto
  'node_modules/pdfjs-dist/legacy/build/pdf.worker.js'
);
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerSrcPath).href;

async function testarLeitura() {
  try {
    const pdfPath = path.resolve('./CRLV Digital.pdf'); 
    
    if (!fs.existsSync(pdfPath)) {
      console.error("❌ Arquivo PDF não encontrado:", pdfPath);
      console.log("💡 Dica: Verifique se o arquivo 'CRLV Digital.pdf' está na raiz do projeto.");
      return;
    }

    console.log("📂 Lendo arquivo:", pdfPath);
    console.log("⚙️  Usando Worker em:", workerSrcPath);

    const buffer = fs.readFileSync(pdfPath);

    // Configuração de carga
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,     // Importante para evitar erros de fonte
      disableFontFace: true,    // Importante para evitar erros de fonte
    });

    const doc = await loadingTask.promise;
    console.log(`✅ Sucesso! PDF carregado. Páginas: ${doc.numPages}`);

    const page = await doc.getPage(1);
    const content = await page.getTextContent();
    
    // O "Truque do Pipe" para separar colunas visuais
    const text = content.items
      .map((item: any) => item.str)
      .join(' | '); // Usar pipe ajuda a separar campos colados

    console.log("\n📝 AMOSRA DO TEXTO EXTRAÍDO:");
    console.log(text.substring(0, 300) + "...");

    console.log("\n🔍 TESTE DE REGEX (Simulando sua regra de negócio):");
    
    // Regex ajustados para serem "gulosos" com espaços e pipes
    // Procura PLACA (padrão Mercosul ou antigo)
    const placaRegex = /[A-Z]{3}\s*\|?\s*[0-9]\s*\|?\s*[A-Z0-9]\s*\|?\s*[0-9]{2}/;
    const placaMatch = text.match(placaRegex);
    
    // Procura RENAVAM (11 dígitos)
    const renavamMatch = text.match(/\d{11}/);

    console.log(`� Placa detectada: ${placaMatch ? placaMatch[0].replace(/\|/g, '').replace(/\s/g, '') : "❌ Não encontrada"}`);
    console.log(`🔢 Renavam detectado: ${renavamMatch ? renavamMatch[0] : "❌ Não encontrado"}`);

  } catch (e) {
    console.error("❌ ERRO FATAL:", e);
  }
}

testarLeitura();