import React, { useEffect, useRef, useState } from 'react';

interface GridViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    width: number;
    height: number;
}

const GridViewModal: React.FC<GridViewModalProps> = ({ isOpen, onClose, width, height }) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showInstructions, setShowInstructions] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset zoom e pan quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }
    }, [isOpen]);

    // Previne scroll quando o modal está aberto
    useEffect(() => {
        if (isOpen) {
            // Salva o estilo overflow atual
            const originalStyle = window.getComputedStyle(document.body).overflow;
            // Desabilita o scroll
            document.body.style.overflow = 'hidden';

            // Restaura o scroll quando o modal é fechado
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    // Criar array de células
    const cells = Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => ({ row, col })));

    // Controles de zoom
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev * 1.2, 3)); // Max zoom 3x
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev / 1.2, 0.5)); // Min zoom 0.5x
    };

    const handleZoomReset = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    // Passo de navegação para controles de teclado
    const navStep = 20;

    // Manipulador para zoom com CTRL + Scroll
    const handleWheel = (e: WheelEvent) => {
        if (!isOpen) return;

        // Verifica se a tecla CTRL está pressionada
        if (e.ctrlKey) {
            e.preventDefault();

            // Determina a direção do zoom baseado no delta da roda do mouse
            const zoomDirection = e.deltaY < 0 ? 1 : -1;

            if (zoomDirection > 0) {
                // Zoom in - usa o mesmo multiplicador que handleZoomIn
                setZoom((prev) => Math.min(prev * 1.1, 3));
            } else {
                // Zoom out - usa o mesmo divisor que handleZoomOut
                setZoom((prev) => Math.max(prev / 1.1, 0.5));
            }
        }
    };

    // Reset zoom e pan quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setShowInstructions(true);
        }
    }, [isOpen]);

    // Adiciona listener de evento wheel para zoom com CTRL+Scroll
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (isOpen && currentContainer) {
            // Precisa usar passive: false para poder usar preventDefault
            currentContainer.addEventListener('wheel', handleWheel as EventListener, { passive: false });

            return () => {
                currentContainer.removeEventListener('wheel', handleWheel as EventListener);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Controles de arrastar
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Controle de teclado
    useEffect(() => {
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
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const cellSize = 20; // Tamanho base da célula

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <div className="w-full h-full bg-white relative overflow-hidden">
                {/* Header com controles */}
                <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-300 p-4 z-10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-gray-800">Visualização Completa - Grid 25m × 35m</h2>
                        <div className="text-sm text-gray-600">Zoom: {Math.round(zoom * 100)}%</div>
                    </div>

                    {/* Controles de zoom */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleZoomOut}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded transition-colors hover:cursor-pointer"
                            title="Zoom Out (-)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>

                        <button
                            onClick={handleZoomReset}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-xs transition-colors hover:cursor-pointer"
                            title="Reset (0)"
                        >
                            100%
                        </button>

                        <button
                            onClick={handleZoomIn}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded transition-colors hover:cursor-pointer"
                            title="Zoom In (+)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        {/* Botão fechar */}
                        <button
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors ml-4 hover:cursor-pointer"
                            title="Fechar (Esc)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Área do grid */}
                <div
                    ref={containerRef}
                    className="w-full h-full pt-20 overflow-hidden cursor-move"
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
                        }}
                    >
                        {/* Coordenadas superiores (X) */}
                        <div className="flex mb-2">
                            <div style={{ width: `${cellSize * 2}px` }}></div>
                            {Array.from({ length: width }, (_, i) => (
                                <div
                                    key={i}
                                    className="text-xs text-center text-gray-600 font-mono"
                                    style={{
                                        width: `${cellSize}px`,
                                        height: `${cellSize}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {i}
                                </div>
                            ))}
                        </div>

                        {/* Grid principal com coordenadas laterais */}
                        <div className="border-2 border-gray-800 bg-white">
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

                                    {/* Células do grid */}
                                    {row.map((cell, colIndex) => (
                                        <div
                                            key={`${cell.row}-${cell.col}`}
                                            className="border border-gray-300 hover:bg-blue-100 transition-colors"
                                            style={{
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                            }}
                                            title={`Posição: (${colIndex}, ${rowIndex})`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Instruções recolhíveis */}
                <div className="absolute bottom-4 left-4">
                    <div className="bg-black bg-opacity-75 rounded overflow-hidden">
                        <button
                            className="text-white px-3 py-1 text-sm focus:outline-none hover:bg-opacity-90 transition-opacity w-full text-left"
                            onClick={() => setShowInstructions((prev) => !prev)}
                            aria-expanded={showInstructions}
                            aria-controls="instructions-panel"
                        >
                            {showInstructions ? 'Ocultar instruções ▲' : 'Mostrar instruções ▼'}
                        </button>
                        {showInstructions && (
                            <div
                                id="instructions-panel"
                                className="text-white p-3 text-sm animate-fade-in border-t border-gray-600"
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
