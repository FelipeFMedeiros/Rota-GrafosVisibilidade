// Lib de exportação para PDF
import jsPDF from 'jspdf';
// Configurações
import { gridValues } from '../config/values';
import { type ObstaclePosition } from '../config/obstaclePositions';

export const exportToPDF = (width: number, height: number, obstacles: ObstaclePosition[] = []) => {
    const cellSize = gridValues.cellSize; // Tamanho da célula em pixels para o PDF
    const margin = gridValues.margin; // Margem do documento
    const gridWidth = width * cellSize;
    const gridHeight = height * cellSize;

    // Gerar SVG dos obstáculos
    const obstaclesSVG = obstacles
        .map((obstacle) => {
            const x = margin + obstacle.x * cellSize;
            const y = margin + obstacle.y * cellSize;
            const obstacleWidth = obstacle.width * cellSize;
            const obstacleHeight = obstacle.height * cellSize;

            // Para cadeiras, usar um visual diferenciado
            const isChair = obstacle.type === 'cadeira';
            const strokeWidth = isChair ? '2' : '1';
            const opacity = isChair ? '0.9' : '0.8';

            return `
            <!-- Obstáculo: ${obstacle.id} -->
            <rect x="${x}" y="${y}" width="${obstacleWidth}" height="${obstacleHeight}" 
                  fill="${obstacle.color}" stroke="#333" stroke-width="${strokeWidth}" opacity="${opacity}" />
            ${
                isChair
                    ? `
            <circle cx="${x + obstacleWidth / 2}" cy="${y + obstacleHeight / 2}" r="${
                          Math.min(obstacleWidth, obstacleHeight) / 4
                      }" 
                    fill="#333" opacity="0.6" />
            `
                    : ''
            }
            <text x="${x + obstacleWidth / 2}" y="${y + obstacleHeight / 2}" 
                  class="${isChair ? 'chair-text' : 'obstacle-text'}" text-anchor="middle" dominant-baseline="middle">
                ${obstacle.label.replace('\n', ' ')}
            </text>
        `;
        })
        .join('');

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
          .obstacle-text { font-family: Arial, sans-serif; font-size: 9px; fill: #333; font-weight: bold; }
          .chair-text { font-family: Arial, sans-serif; font-size: 8px; fill: #fff; font-weight: bold; }
        </style>
      </defs>
      
      <!-- Título -->
      <text x="${(gridWidth + margin * 2) / 2}" y="30" class="title-text" text-anchor="middle">
        Mapa Quadriculado - Teoria dos Grafos (25m × 35m)
      </text>
      
      <!-- Informações -->
      <text x="${margin}" y="${gridHeight + margin + 30}" class="info-text">
        Escala: 1 quadrado = 1 metro | Área total: 875m² | Coordenadas: X(0-24), Y(0-34) | Obstáculos: ${
            obstacles.length
        }
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
      
      <!-- Obstáculos -->
      ${obstaclesSVG}
      
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
                pdf.save('mapa-quadriculado-com-obstaculos.pdf');

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
