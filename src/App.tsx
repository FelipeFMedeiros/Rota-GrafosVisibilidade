import React from 'react';
import { exportToPDF } from './utils/pdfExport';
import GridViewModal from './components/GridViewModal';
import { gridValues } from './config/values';
import { obstaclePositions } from './config/obstaclePositions';
import InfoSections from './components/InfoSections';
import Grid from './components/Grid';

const App: React.FC = () => {
    const [isExporting, setIsExporting] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            exportToPDF(gridValues.width, gridValues.height, obstaclePositions);
            setTimeout(() => setIsExporting(false), 1500);
        } catch (error) {
            console.error('Error in export:', error);
            setIsExporting(false);
        }
    };

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

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Grid section */}
                    <div className="lg:w-fit">
                        <div className="overflow-x-auto bg-white border border-gray-300 rounded-lg shadow-sm">
                            <div className="min-w-max relative p-2">
                                <Grid
                                    width={gridValues.width}
                                    height={gridValues.height}
                                    obstacles={obstaclePositions}
                                    cellSize={16} 
                                    coordinateColumnWidth={32}
                                    className="sticky left-0"
                                    isOpen={isModalOpen}
                                />
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
                                className={`bg-gray-800 hover:bg-gray-900 text-white text-base font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 hover:cursor-pointer ${
                                    isExporting ? 'opacity-75 cursor-not-allowed' : ''
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

                    {/* Info sections */}
                    <div className="w-fit flex-shrink-0 ml-10 hidden md:block">
                        <InfoSections obstaclePositions={obstaclePositions} />
                    </div>
                </div>

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
