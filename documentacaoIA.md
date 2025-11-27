# Documentação pdfjs-dist - Configuração Worker Node.js

## Problema Comum

Erro: "Cannot find module 'pdf.worker.js'" ou "Setting up fake worker failed"

## Soluções para Node.js / Next.js

### Solução 1: Usar CDN (Mais Simples)

```javascript
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### Solução 2: Copiar Worker para Pasta Public

```bash
# No terminal do projeto
cp ./node_modules/pdfjs-dist/build/pdf.worker.min.js ./public/
```

Depois no código:

```javascript
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
```

### Solução 3: Usar pdf.worker.entry (Webpack/Next.js)

```javascript
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
```

### Solução 4: Para Next.js com new URL (Recomendada)

```javascript
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();
```

### Solução 5: Usar Legacy Build (Sem Worker)

Para ambientes Node.js sem suporte a Web Workers:

```javascript
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

// Não precisa configurar workerSrc
```

## Importante: Sincronização de Versões

⚠️ **A versão do worker DEVE ser igual à versão do pdfjs-dist**

Erro comum:

```
The API version "2.6.347" does not match the Worker version "2.1.266"
```

Solução:

```javascript
// Garantir mesma versão usando variável
const pdfjsVersion = require("pdfjs-dist/package.json").version;

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;
```

## Configuração para Next.js (Específico)

### next.config.js

```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "pdfjs-dist": require("path").resolve(
        __dirname,
        "node_modules/pdfjs-dist/es5/build/pdf.js",
      ),
    };
    return config;
  },
};
```

### Componente React/Next.js

```javascript
"use client"; // Se usando App Router

import { useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configurar antes de usar
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PDFComponent() {
  useEffect(() => {
    // Seu código de PDF aqui
  }, []);
}
```

## Alternativa: Usar Biblioteca pdf-parse

Para uso em Node.js puro (backend/API), considere usar `pdf-parse` que não precisa de worker:

```bash
npm install pdf-parse
```

```javascript
import pdfParse from "pdf-parse";

async function parsePDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}
```

## Links Úteis

- GitHub oficial: https://github.com/mozilla/pdf.js
- NPM: https://www.npmjs.com/package/pdfjs-dist
- Wiki Setup: https://github.com/mozilla/pdf.js/wiki/Setup-PDF.js-in-a-website
- Issues relacionados: https://github.com/mozilla/pdf.js/issues/8305

## Para Seu Erro Específico (Next.js + Turbopack)

O erro ocorre porque o `pathToFileURL` não funciona bem com Turbopack no Next.js.

**Solução Recomendada:**

1. Copie o worker para a pasta `public/`:

   ```bash
   cp node_modules/pdfjs-dist/build/pdf.worker.min.js public/
   ```

2. Atualize seu código em `veiculo.ts`:

   ```javascript
   import * as pdfjsLib from "pdfjs-dist";

   // REMOVA estas linhas:
   // const workerSrcPath = path.resolve(...)
   // pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerSrcPath).href;

   // USE isto:
   pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
   ```

3. Ou use CDN (sem precisar copiar arquivo):
   ```javascript
   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.js`;
   ```
