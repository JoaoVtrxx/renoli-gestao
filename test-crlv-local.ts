import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// === CORREÇÃO DO WORKER (O SEGREDO) ===
// O Node.js (ESM) no Windows precisa de uma URL de arquivo (`file://`) para o worker.
const workerSrcPath = path.resolve(
  process.cwd(), // Garante que partimos da raiz do projeto
  'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'
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
      .join(' | '); 

    // === SALVAR LOG COMPLETO ===
    const logPath = path.resolve('./debug-crlv.txt');
    fs.writeFileSync(logPath, text);
    console.log(`\n💾 Texto completo salvo em: ${logPath}`);
    console.log("Por favor, anexe este arquivo ou cole seu conteúdo no chat.");

  } catch (e) {
    console.error("❌ ERRO FATAL:", e);
  }
}

testarLeitura();