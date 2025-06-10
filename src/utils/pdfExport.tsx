import jsPDF from 'jspdf';
import { gridValues } from '../config/values';

export const exportToPDF = (width: number, height: number, obstacles: unknown[] = []) => {
    const cellSize = gridValues.cellSize; // Tamanho da célula em pixels para o PDF
    const margin = gridValues.margin; // Margem do documento
    const gridWidth = width * cellSize;
    const gridHeight = height * cellSize;

    // Criar SVG do grid para adicionar ao PDF
    const svgContent = `
    <svg width="${gridWidth + margin * 2}" height="${gridHeight + margin * 2}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .grid-line { stroke: #666; stroke-width: 0.5; }
          .border-line { stroke: #000; stroke-width: 2; }
          .coordinate-text { font-family: Arial, sans-serif; font-size: 10px; fill: #666; }
          .title-text { font-family: Arial, sans-serif; font-size: 16px; fill: #000; font-weight: bold; }
          .info-text { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
        </style>
      </defs>
      
      <!-- Título -->
      <text x="${(gridWidth + margin * 2) / 2}" y="30" class="title-text" text-anchor="middle">
        Mapa Quadriculado - Teoria dos Grafos (25m × 35m)
      </text>
      
      <!-- Informações -->
      <text x="${margin}" y="${gridHeight + margin + 30}" class="info-text">
        Escala: 1 quadrado = 1 metro | Área total: 875m² | Coordenadas: X(0-24), Y(0-34)
      </text>
      
      <!-- Grid lines verticais -->
      ${Array.from(
          { length: width + 1 },
          (_, i) =>
              `<line x1="${margin + i * cellSize}" y1="${margin}" x2="${margin + i * cellSize}" y2="${
                  margin + gridHeight
              }" class="grid-line" />`,
      ).join('')}
      
      <!-- Grid lines horizontais -->
      ${Array.from(
          { length: height + 1 },
          (_, i) =>
              `<line x1="${margin}" y1="${margin + i * cellSize}" x2="${margin + gridWidth}" y2="${
                  margin + i * cellSize
              }" class="grid-line" />`,
      ).join('')}
      
      <!-- Borda externa -->
      <rect x="${margin}" y="${margin}" width="${gridWidth}" height="${gridHeight}" fill="none" class="border-line" />
      
      <!-- Coordenadas X (superior) -->
      ${Array.from(
          { length: width },
          (_, i) =>
              `<text x="${margin + i * cellSize + cellSize / 2}" y="${
                  margin - 5
              }" class="coordinate-text" text-anchor="middle">${i}</text>`,
      ).join('')}
      
      <!-- Coordenadas Y (lateral esquerda) -->
      ${Array.from(
          { length: height },
          (_, i) =>
              `<text x="${margin - 10}" y="${
                  margin + i * cellSize + cellSize / 2 + 3
              }" class="coordinate-text" text-anchor="middle">${i}</text>`,
      ).join('')}
      
      <!-- Obstáculos (serão adicionados futuramente) -->
      ${obstacles
          .map((/*obstacle*/) => {
              // Lógica para renderizar obstáculos no futuro
              return '';
          })
          .join('')}
    </svg>
  `;

    try {
        // Codificar SVG do Grid como data URL
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        // Criar imagem a partir do SVG do Grid e renderizar no canvas quando carregada
        const img = new Image();
        img.onload = function () {
            // Criar canvas para renderizar a imagem
            const canvas = document.createElement('canvas');
            const scaleFactor = 2; // Para melhor qualidade
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Desenhar imagem com escala para melhor qualidade
                ctx.scale(scaleFactor, scaleFactor);
                ctx.drawImage(img, 0, 0);

                // Converter canvas para dados de imagem
                const imgData = canvas.toDataURL('image/png');

                // Calcular proporções para página A4
                const imgWidth = 210; // Largura A4 em mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Criar PDF
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

                // Salvar PDF
                pdf.save('mapa-quadriculado.pdf');

                // Limpar recursos
                URL.revokeObjectURL(url);
            }
        };

        // Definir origem da imagem para o data URL do SVG
        img.src = url;
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
