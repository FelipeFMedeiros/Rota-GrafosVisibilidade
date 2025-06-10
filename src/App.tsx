import React from 'react';
import { exportToPDF } from './utils/pdfExport';
import GridViewModal from './components/GridViewModal';
import { gridValues, obstacles } from './config/values';

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
            exportToPDF(gridValues.width, gridValues.height);
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
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Mapa Quadriculado - Teoria dos Grafos</h1>

                <div className="mb-4 text-sm text-gray-600">
                    <p>
                        <strong>Dimensões:</strong> {gridValues.width}m x {gridValues.height}m ({totalArea}m²)
                    </p>
                    <p>
                        <strong>Escala:</strong> 1 quadrado = 1 metro
                    </p>
                </div>

                {/* Coordenadas superiores (X) - usando gridValues.coordinatesX */}
                <div className="flex mb-1">
                    <div className="w-8"></div>
                    {gridValues.coordinatesX.map((x) => (
                        <div key={x} className="w-4 h-4 text-xs text-center text-gray-500" style={{ fontSize: '8px' }}>
                            {x}
                        </div>
                    ))}
                </div>

                {/* Grid principal com coordenadas laterais */}
                <div className="inline-block border-2 border-gray-800 bg-white">
                    {cells.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {/* Coordenada Y (lateral esquerda) */}
                            <div className="w-8 h-4 text-xs flex items-center justify-center text-gray-500 bg-gray-100">
                                {rowIndex}
                            </div>

                            {/* Células do grid */}
                            {row.map((cell, colIndex) => (
                                <div
                                    key={`${cell.row}-${cell.col}`}
                                    className="w-4 h-4 border border-gray-300 hover:bg-blue-100 cursor-pointer transition-colors"
                                    title={`Posição: (${colIndex}, ${rowIndex})`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Botões de ação */}
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                        </svg>
                        Visualizar Tela Cheia
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 ${
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

                {/* Modal de visualização */}
                <GridViewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    width={gridValues.width}
                    height={gridValues.height}
                />

                {/* Legenda */}
                <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Informações:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                            • <strong>Área total:</strong> {totalArea}m² ({gridValues.width}m × {gridValues.height}m)
                        </li>
                        <li>
                            • <strong>Cada célula:</strong> Representa 1m²
                        </li>
                        <li>
                            • <strong>Coordenadas:</strong> X (horizontal) de 0-{gridValues.width - 1}, Y (vertical) de
                            0-{gridValues.height - 1}
                        </li>
                        <li>
                            • <strong>Visualização:</strong> Use o botão "Tela Cheia" para melhor visualização com zoom
                        </li>
                        <li>
                            • <strong>PDF:</strong> Use o botão "Exportar PDF" para gerar versão para impressão
                        </li>
                    </ul>
                </div>

                {/* Lista de obstáculos usando valores de values.ts */}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Obstáculos a serem adicionados:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                        <div>
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
                        </div>
                        <div>
                            <p>
                                <strong>Salas [S1, S2]:</strong> {obstacles.sala.width.toFixed(2)} ×{' '}
                                {obstacles.sala.height.toFixed(2)}m
                            </p>
                            <p>
                                <strong>Banheiro cadeirante [{obstacles.banheiro[2].id}]:</strong>{' '}
                                {obstacles.banheiro[2].width.toFixed(2)} × {obstacles.banheiro[2].height.toFixed(2)}m
                            </p>
                            <p>
                                <strong>
                                    Banheiros [{obstacles.banheiro[0].id}, {obstacles.banheiro[1].id}]:
                                </strong>{' '}
                                {obstacles.banheiro[0].width.toFixed(2)} × {obstacles.banheiro[0].height.toFixed(2)}m
                            </p>
                            <p>
                                <strong>Escadas [E1, E2]:</strong> {obstacles.escada.width.toFixed(2)} ×{' '}
                                {obstacles.escada.height.toFixed(2)}m
                            </p>
                            <p>
                                <strong>Elevador [{obstacles.elevador.id}]:</strong>{' '}
                                {obstacles.elevador.width.toFixed(2)} × {obstacles.elevador.width.toFixed(2)}m
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
