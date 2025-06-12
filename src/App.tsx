import React from 'react';
import { exportToPDF } from './utils/pdfExport';
import GridViewModal from './components/GridViewModal';
import { gridValues, obstacles } from './config/values';
import { obstaclePositions } from './config/obstaclePositions';

const App: React.FC = () => {
    const [isExporting, setIsExporting] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Criar array de células usando gridValues
    const cells = Array.from({ length: gridValues.height }, (_, row) =>
        Array.from({ length: gridValues.width }, (_, col) => ({ row, col })),
    );

    const handleExport = () => {
        setIsExporting(true);

        try {
            console.log('Starting PDF export...');
            exportToPDF(gridValues.width, gridValues.height, obstaclePositions);
            console.log('PDF export function called');

            setTimeout(() => {
                setIsExporting(false);
                console.log('Export state reset');
            }, 1500);
        } catch (error) {
            console.error('Error in export:', error);
            setIsExporting(false);
        }
    };

    // Calcula a área total uma vez para uso em vários locais
    const totalArea = gridValues.width * gridValues.height;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Mapa Quadriculado - Teoria dos Grafos</h1>

                <div className="mb-4 text-sm text-gray-600">
                    <p>
                        <strong>Dimensões:</strong> {gridValues.width}m x {gridValues.height}m ({totalArea}m²)
                    </p>
                    <p>
                        <strong>Escala:</strong> 1 quadrado = 1 metro
                    </p>
                </div>

                {/* Flexbox container for grid and info sections */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Grid section - Left Column */}
                    <div className="lg:w-2/3">
                        {/* Container com scroll horizontal único para coordenadas e grid */}
                        <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-sm">
                            <div className="min-w-max relative">
                                {/* Coordenadas superiores (X) - dentro do mesmo container de scroll */}
                                <div className="flex mb-1">
                                    <div className="w-8"></div>
                                    {gridValues.coordinatesX.map((x) => (
                                        <div
                                            key={x}
                                            className="w-4 h-4 text-xs text-center text-gray-500"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {x}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid com obstáculos */}
                                <div className="relative">
                                    {/* Grid base (células vazias) */}
                                    {cells.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex">
                                            {/* Coordenada Y (lateral esquerda) */}
                                            <div className="sticky left-0 w-8 h-4 text-xs flex items-center justify-center text-gray-500 bg-gray-100 z-10 border-r border-gray-300">
                                                {rowIndex}
                                            </div>

                                            {/* Células do grid vazias */}
                                            {row.map((cell, colIndex) => (
                                                <div
                                                    key={`${cell.row}-${cell.col}`}
                                                    className="w-4 h-4 border border-gray-300 hover:bg-blue-100 cursor-pointer transition-colors"
                                                    title={`Posição: (${colIndex}, ${rowIndex})`}
                                                />
                                            ))}
                                        </div>
                                    ))}

                                    {/* Obstáculos renderizados como elementos absolutos */}
                                    {obstaclePositions.map((obstacle) => {
                                        const left = 32 + obstacle.x * 16; // 32px = w-8 (coordenadas Y) + obstacle.x * 16px (w-4)
                                        const top = obstacle.y * 16; // obstacle.y * 16px (h-4)
                                        const width = obstacle.width * 16; // largura real * 16px
                                        const height = obstacle.height * 16; // altura real * 16px

                                        return (
                                            <div
                                                key={obstacle.id}
                                                className="absolute pointer-events-none border border-gray-600"
                                                style={{
                                                    left: `${left}px`,
                                                    top: `${top}px`,
                                                    width: `${width}px`,
                                                    height: `${height}px`,
                                                    backgroundColor: obstacle.color,
                                                    opacity: 0.8,
                                                    zIndex: 5,
                                                }}
                                                title={`${obstacle.id} - ${obstacle.label.replace(
                                                    '\n',
                                                    ' ',
                                                )} (${obstacle.width.toFixed(2)}m x ${obstacle.height.toFixed(2)}m)`}
                                            >
                                                {/* Label do obstáculo */}
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold pointer-events-none"
                                                    style={{
                                                        fontSize:
                                                            obstacle.type === 'cadeira'
                                                                ? '8px'
                                                                : width < 50
                                                                ? '6px'
                                                                : '9px',
                                                        lineHeight: '1.1',
                                                        textAlign: 'center',
                                                        whiteSpace: 'pre-line',
                                                        textShadow:
                                                            obstacle.type === 'cadeira' ? '0 0 2px white' : 'none',
                                                        color: obstacle.type === 'cadeira' ? '#000' : '#333',
                                                    }}
                                                >
                                                    {obstacle.label}
                                                </div>

                                                {/* Círculo especial para cadeiras (como no PDF) */}
                                                {obstacle.type === 'cadeira' && (
                                                    <div
                                                        className="absolute rounded-full bg-gray-700 opacity-60"
                                                        style={{
                                                            width: `${Math.min(width, height) / 3}px`,
                                                            height: `${Math.min(width, height) / 3}px`,
                                                            left: '50%',
                                                            top: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gray-800 hover:bg-gray-900 text-white text-base font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 hover:cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                    />
                                </svg>
                                Visualizar
                            </button>

                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className={`bg-gray-800 hover:bg-gray-900 text-white text-base font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 ${
                                    isExporting ? 'opacity-75 cursor-not-allowed' : 'hover:cursor-pointer'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                {isExporting ? 'Preparando PDF...' : 'Exportar PDF'}
                            </button>
                        </div>
                    </div>

                    {/* Info sections - Right Column */}
                    <div className="lg:w-1/3 space-y-4">
                        {/* Legenda */}
                        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm h-min">
                            <h3 className="font-semibold text-gray-800 mb-2">Informações:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>
                                    • <strong>Área total:</strong> {totalArea}m² ({gridValues.width}m ×{' '}
                                    {gridValues.height}m)
                                </li>
                                <li>
                                    • <strong>Cada célula:</strong> Representa 1m²
                                </li>
                                <li>
                                    • <strong>Coordenadas:</strong> X (horizontal) de 0-{gridValues.width - 1}, Y
                                    (vertical) de 0-{gridValues.height - 1}
                                </li>
                                <li>
                                    • <strong>Obstáculos:</strong> {obstaclePositions.length} elementos posicionados
                                </li>
                                <li>
                                    • <strong>Visualização:</strong> Use o botão "Visualizar" para ver em tela cheia
                                </li>
                                <li>
                                    • <strong>PDF:</strong> Use o botão "Exportar PDF" para gerar versão para impressão
                                </li>
                            </ul>
                        </div>

                        {/* Legenda de cores dos obstáculos */}
                        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm h-min">
                            <h3 className="font-semibold text-gray-800 mb-2">Legenda de Obstáculos:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#E3F2FD' }}></div>
                                    <span>Laboratórios</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#FFF8E1' }}></div>
                                    <span>Salas de Aula</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#FFF3E0' }}></div>
                                    <span>Banheiros</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#8D6E63' }}></div>
                                    <span>Mesas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#5D4037' }}></div>
                                    <span>Cadeiras</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#ECEFF1' }}></div>
                                    <span>Escadas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#CFD8DC' }}></div>
                                    <span>Elevador</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#795548' }}></div>
                                    <span>Armários</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border" style={{ backgroundColor: '#F5F5F5' }}></div>
                                    <span>Corredor</span>
                                </div>
                            </div>
                        </div>

                        {/* Lista de obstáculos usando valores de values.ts */}
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm h-min">
                            <h3 className="font-semibold text-gray-800 mb-2">Obstáculos posicionados:</h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                    <strong>Mesas [M1, M2]:</strong> {obstacles.mesa.width.toFixed(2)} ×{' '}
                                    {obstacles.mesa.height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Cadeiras [C1-C8]:</strong> {obstacles.cadeira.width.toFixed(2)} ×{' '}
                                    {obstacles.cadeira.height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Armários [A1, A2]:</strong> {obstacles.armario.width.toFixed(2)} ×{' '}
                                    {obstacles.armario.height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Laboratório 1 [{obstacles.laboratorio[0].id}]:</strong>{' '}
                                    {obstacles.laboratorio[0].width.toFixed(2)} ×{' '}
                                    {obstacles.laboratorio[0].height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Laboratório 2 [{obstacles.laboratorio[1].id}]:</strong>{' '}
                                    {obstacles.laboratorio[1].width.toFixed(2)} ×{' '}
                                    {obstacles.laboratorio[1].height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Corredor:</strong> {obstacles.corredor.width.toFixed(2)} ×{' '}
                                    {obstacles.corredor.height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Salas [S1, S2]:</strong> {obstacles.sala.width.toFixed(2)} ×{' '}
                                    {obstacles.sala.height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Banheiro cadeirante [{obstacles.banheiro[2].id}]:</strong>{' '}
                                    {obstacles.banheiro[2].width.toFixed(2)} × {obstacles.banheiro[2].height.toFixed(2)}
                                    m
                                </p>
                                <p>
                                    <strong>
                                        Banheiros [{obstacles.banheiro[0].id}, {obstacles.banheiro[1].id}]:
                                    </strong>{' '}
                                    {obstacles.banheiro[0].width.toFixed(2)} × {obstacles.banheiro[0].height.toFixed(2)}
                                    m
                                </p>
                                <p>
                                    <strong>Escadas [E1, E2]:</strong> {obstacles.escada.width.toFixed(2)} ×{' '}
                                    {obstacles.escada.height.toFixed(2)}m
                                </p>
                                <p>
                                    <strong>Elevador [{obstacles.elevador.id}]:</strong>{' '}
                                    {obstacles.elevador.width.toFixed(2)} × {obstacles.elevador.height.toFixed(2)}m
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de visualização */}
                <GridViewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    width={gridValues.width}
                    height={gridValues.height}
                    obstacles={obstaclePositions}
                />
            </div>
        </div>
    );
};

export default App;
