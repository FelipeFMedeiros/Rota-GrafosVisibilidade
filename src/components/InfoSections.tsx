import React from 'react';
import { gridValues } from '../config/values';
import { type ObstaclePosition } from '../config/obstaclePositions';

const InfoSections: React.FC<{ obstaclePositions: ObstaclePosition[] }> = ({ obstaclePositions }) => {
    // Função para buscar obstáculos por tipo
    const getObstaclesByType = (type: ObstaclePosition['type']) => {
        return obstaclePositions.filter((obstacle) => obstacle.type === type);
    };

    // Função para buscar obstáculo por ID
    const getObstacleById = (id: string) => {
        return obstaclePositions.find((obstacle) => obstacle.id === id);
    };

    // Extrair dados específicos dos obstáculos
    const mesas = getObstaclesByType('mesa');
    const cadeiras = getObstaclesByType('cadeira');
    const armarios = getObstaclesByType('armario');
    const laboratorios = getObstaclesByType('laboratorio');
    const salas = getObstaclesByType('sala');
    const banheiros = getObstaclesByType('banheiro');
    const escadas = getObstaclesByType('escada');
    const elevador = getObstacleById('E3');
    const corredor = getObstacleById('CORREDOR');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Coluna esquerda */}
            <div className="space-y-4">
                {/* Informações Gerais */}
                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Informações Gerais
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex justify-between">
                            <span>
                                • <strong>Área total:</strong>
                            </span>
                            <span>{gridValues.width * gridValues.height}m²</span>
                        </li>
                        <li className="flex justify-between">
                            <span>
                                • <strong>Dimensões:</strong>
                            </span>
                            <span>
                                {gridValues.width}m × {gridValues.height}m
                            </span>
                        </li>
                        <li className="flex justify-between">
                            <span>
                                • <strong>Escala:</strong>
                            </span>
                            <span>1 célula = 1m²</span>
                        </li>
                        <li className="flex justify-between">
                            <span>
                                • <strong>Obstáculos:</strong>
                            </span>
                            <span>{obstaclePositions.length} elementos</span>
                        </li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                        <p>
                            • <strong>Coordenadas:</strong> X (0-{gridValues.width - 1}), Y (0-
                            {gridValues.height - 1})
                        </p>
                    </div>
                </div>

                {/* Legenda de Cores */}
                <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                            />
                        </svg>
                        Legenda de Cores
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        {[
                            { color: '#E3F2FD', label: 'Laboratórios' },
                            { color: '#FFF8E1', label: 'Salas de Aula' },
                            { color: '#FFF3E0', label: 'Banheiros' },
                            { color: '#8D6E63', label: 'Mesas' },
                            { color: '#5D4037', label: 'Cadeiras' },
                            { color: '#ECEFF1', label: 'Escadas' },
                            { color: '#CFD8DC', label: 'Elevador' },
                            { color: '#795548', label: 'Armários' },
                            { color: '#F5F5F5', label: 'Corredor' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 border border-gray-400 rounded-sm shadow-sm"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-700">{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Coluna direita */}
            <div>
                {/* Detalhes dos Obstáculos */}
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        Dimensões dos Obstáculos
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2">
                        <div className="space-y-1.5">
                            {/* Mesas */}
                            {mesas.length > 0 && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">
                                        Mesas [{mesas.map((m) => m.id).join(', ')}]:
                                    </strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {mesas[0].width.toFixed(1)} × {mesas[0].height.toFixed(1)}m
                                    </span>
                                </p>
                            )}

                            {/* Cadeiras */}
                            {cadeiras.length > 0 && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">
                                        Cadeiras [{cadeiras.map((c) => c.id).join(', ')}]:
                                    </strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {cadeiras[0].width.toFixed(1)} × {cadeiras[0].height.toFixed(1)}m
                                    </span>
                                </p>
                            )}

                            {/* Armários */}
                            {armarios.length > 0 && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">
                                        Armários [{armarios.map((a) => a.id).join(', ')}]:
                                    </strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {armarios[0].width.toFixed(1)} × {armarios[0].height.toFixed(1)}m
                                    </span>
                                </p>
                            )}

                            {/* Laboratórios */}
                            {laboratorios.map((lab) => (
                                <p key={lab.id} className="flex justify-between items-center">
                                    <strong className="text-amber-800">Lab [{lab.id}]:</strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {lab.width.toFixed(1)} × {lab.height.toFixed(1)}m
                                    </span>
                                </p>
                            ))}

                            {/* Corredor */}
                            {corredor && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">Corredor:</strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {corredor.width.toFixed(1)} × {corredor.height.toFixed(1)}m
                                    </span>
                                </p>
                            )}

                            {/* Salas */}
                            {salas.length > 0 && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">
                                        Salas [{salas.map((s) => s.id).join(', ')}]:
                                    </strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {salas[0].width.toFixed(1)} × {salas[0].height.toFixed(1)}m
                                    </span>
                                </p>
                            )}

                            {/* Banheiros */}
                            {banheiros.map((banheiro) => (
                                <p key={banheiro.id} className="flex justify-between items-center">
                                    <strong className="text-amber-800">Banheiro [{banheiro.id}]:</strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {banheiro.width.toFixed(1)} × {banheiro.height.toFixed(1)}m
                                    </span>
                                </p>
                            ))}

                            {/* Escadas */}
                            {escadas.length > 0 && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">
                                        Escadas [{escadas.map((e) => e.id).join(', ')}]:
                                    </strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {escadas[0].width.toFixed(1)} × {escadas[0].height.toFixed(1)}m
                                    </span>
                                </p>
                            )}

                            {/* Elevador */}
                            {elevador && (
                                <p className="flex justify-between items-center">
                                    <strong className="text-amber-800">Elevador [{elevador.id}]:</strong>
                                    <span className="bg-white px-2 py-0.5 rounded text-xs">
                                        {elevador.width.toFixed(1)} × {elevador.height.toFixed(1)}m
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoSections;
