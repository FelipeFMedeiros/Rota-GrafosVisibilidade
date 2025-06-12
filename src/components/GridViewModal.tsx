import React, { useEffect, useRef, useState, useCallback } from 'react';
import { type ObstaclePosition } from '../config/obstaclePositions';
import { gridValues } from '../config/values';

interface GridViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    width: number;
    height: number;
    obstacles?: ObstaclePosition[];
}

const GridViewModal: React.FC<GridViewModalProps> = ({ isOpen, onClose, width, height, obstacles = [] }) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showInstructions, setShowInstructions] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    // Reset zoom e pan quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setShowInstructions(true);
        }
    }, [isOpen]);

    // Previne scroll quando o modal está aberto
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    // Criar array de células (otimizado para não recriar em cada render)
    const cells = React.useMemo(
        () => Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => ({ row, col }))),
        [height, width],
    );

    // Controles de zoom (memoizados para evitar recriações)
    const handleZoomIn = useCallback(() => {
        setZoom((prev) => Math.min(prev * 1.2, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom((prev) => Math.max(prev / 1.2, 0.5));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    // Manipulador para zoom com CTRL + Scroll (otimizado)
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            if (!isOpen) return;

            if (e.ctrlKey) {
                e.preventDefault();

                // Cancelar qualquer animação anterior
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }

                // Usar requestAnimationFrame para suavizar o zoom
                rafRef.current = requestAnimationFrame(() => {
                    const zoomDirection = e.deltaY < 0 ? 1 : -1;
                    const zoomFactor = zoomDirection > 0 ? 1.1 : 1 / 1.1;

                    setZoom((prev) => {
                        const newZoom = prev * zoomFactor;
                        return Math.min(Math.max(newZoom, 0.5), 3);
                    });
                });
            }
        },
        [isOpen],
    );

    // Adiciona listener de evento wheel para zoom com CTRL+Scroll
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (isOpen && currentContainer) {
            currentContainer.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                currentContainer.removeEventListener('wheel', handleWheel);
                // Limpar qualquer animação pendente ao desmontar
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }
            };
        }
    }, [isOpen, handleWheel]);

    // Controles de arrastar (otimizados com requestAnimationFrame)
    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        },
        [pan],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (isDragging) {
                // Cancelar qualquer animação anterior
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }

                // Usar requestAnimationFrame para melhor performance
                rafRef.current = requestAnimationFrame(() => {
                    setPan({
                        x: e.clientX - dragStart.x,
                        y: e.clientY - dragStart.y,
                    });
                });
            }
        },
        [isDragging, dragStart],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Controle de teclado (memoizado)
    useEffect(() => {
        const navStep = 20;

        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    handleZoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    handleZoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    handleZoomReset();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setPan((prev) => ({ ...prev, y: prev.y + navStep }));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setPan((prev) => ({ ...prev, y: prev.y - navStep }));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    setPan((prev) => ({ ...prev, x: prev.x + navStep }));
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    setPan((prev) => ({ ...prev, x: prev.x - navStep }));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, onClose, handleZoomIn, handleZoomOut, handleZoomReset]);

    if (!isOpen) return null;

    const cellSize = gridValues.cellSize; // Tamanho base da célula

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <div className="w-full h-full bg-white relative overflow-hidden">
                {/* Header responsivo com controles */}
                <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-300 p-2 md:p-4 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">
                            Grid {width}m × {height}m
                        </h2>
                        <div className="text-xs md:text-sm text-gray-600">Zoom: {Math.round(zoom * 100)}%</div>
                    </div>

                    {/* Controles de zoom */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            onClick={handleZoomOut}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 md:p-2 rounded transition-colors"
                            title="Zoom Out (-)"
                        >
                            <svg
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>

                        <button
                            onClick={handleZoomReset}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 md:px-3 py-1 md:py-2 rounded text-xs"
                            title="Reset (0)"
                        >
                            100%
                        </button>

                        <button
                            onClick={handleZoomIn}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 md:p-2 rounded transition-colors"
                            title="Zoom In (+)"
                        >
                            <svg
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        {/* Botão fechar */}
                        <button
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 md:p-2 rounded transition-colors ml-2 md:ml-4"
                            title="Fechar (Esc)"
                        >
                            <svg
                                className="w-3 h-3 md:w-4 md:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Área do grid otimizada */}
                <div
                    ref={containerRef}
                    className="w-full h-full pt-14 sm:pt-16 overflow-hidden cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        className="flex flex-col items-center justify-center h-full"
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: 'center center',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            willChange: 'transform',
                        }}
                    >
                        {/* Coordenadas superiores (X) */}
                        <div className="flex mb-2">
                            <div style={{ width: `${cellSize * 2}px` }}></div>
                            {Array.from({ length: width }, (_, i) => (
                                <div
                                    key={i}
                                    className="text-xs text-center text-gray-600 font-mono flex items-center justify-center"
                                    style={{
                                        width: `${cellSize}px`,
                                        height: `${cellSize}px`,
                                    }}
                                >
                                    {i}
                                </div>
                            ))}
                        </div>

                        {/* Grid principal com coordenadas laterais */}
                        <div className="border-2 border-gray-800 bg-white relative">
                            {/* Grid base (células vazias) */}
                            {cells.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex">
                                    {/* Coordenada Y (lateral esquerda) */}
                                    <div
                                        className="text-xs flex items-center justify-center text-gray-600 bg-gray-100 border-r border-gray-300 font-mono"
                                        style={{
                                            width: `${cellSize * 2}px`,
                                            height: `${cellSize}px`,
                                        }}
                                    >
                                        {rowIndex}
                                    </div>

                                    {/* Células do grid vazias */}
                                    {row.map((cell, colIndex) => (
                                        <div
                                            key={`${cell.row}-${cell.col}`}
                                            className="border border-gray-300 hover:bg-blue-100 cursor-pointer transition-colors"
                                            style={{
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                            }}
                                            title={`Posição: (${colIndex}, ${rowIndex})`}
                                        />
                                    ))}
                                </div>
                            ))}

                            {/* Obstáculos renderizados como elementos absolutos */}
                            {obstacles.map((obstacle) => {
                                const left = cellSize * 2 + obstacle.x * cellSize; // cellSize * 2 = largura das coordenadas Y
                                const top = obstacle.y * cellSize;
                                const width = obstacle.width * cellSize;
                                const height = obstacle.height * cellSize;

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
                                                    obstacle.type === 'cadeira' ? '10px' : width < 60 ? '8px' : '12px',
                                                lineHeight: '1.1',
                                                textAlign: 'center',
                                                whiteSpace: 'pre-line',
                                                textShadow: obstacle.type === 'cadeira' ? '0 0 2px white' : 'none',
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

                {/* Instruções recolhíveis responsivas */}
                <div className="absolute bottom-4 left-4 max-w-xs md:max-w-md">
                    <div className="bg-black bg-opacity-75 rounded overflow-hidden">
                        <button
                            className="text-white px-2 md:px-3 py-1 text-xs md:text-sm w-full text-left"
                            onClick={() => setShowInstructions((prev) => !prev)}
                            aria-expanded={showInstructions}
                            aria-controls="instructions-panel"
                        >
                            {showInstructions ? 'Ocultar instruções ▲' : 'Mostrar instruções ▼'}
                        </button>
                        {showInstructions && (
                            <div
                                id="instructions-panel"
                                className="text-white p-2 md:p-3 text-xs md:text-sm border-t border-gray-600"
                            >
                                <div className="font-semibold mb-1">Controles:</div>
                                <div>• Arrastar: Navegar pelo mapa</div>
                                <div>• Setas: ↑↓←→ Navegar pelo mapa</div>
                                <div>• +/- : Zoom in/out</div>
                                <div>• CTRL + Scroll: Zoom in/out</div>
                                <div>• 0: Reset zoom</div>
                                <div>• Esc: Fechar</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GridViewModal;
