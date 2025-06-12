import React, { useEffect, useState } from 'react';
// Types
import { type ObstaclePosition } from '../config/obstaclePositions';
// Configurações
import { gridValues } from '../config/values';
// Hooks
import { useGridControls } from '../hooks/useGridControls';
// Componentes
import Grid from './Grid';
import ModalHeader from './ModalHeader';
import ModalInstructions from './ModalInstructions';

interface GridViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    width: number;
    height: number;
    obstacles?: ObstaclePosition[];
}

const GridViewModal: React.FC<GridViewModalProps> = ({ isOpen, onClose, width, height, obstacles = [] }) => {
    const [showInstructions, setShowInstructions] = useState(true);

    const {
        zoom,
        pan,
        isDragging,
        containerRef,
        handleZoomIn,
        handleZoomOut,
        handleZoomReset,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = useGridControls({ isOpen, onClose });

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

    // Reset instruções quando modal abre
    useEffect(() => {
        if (isOpen) {
            setShowInstructions(true);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <div className="w-full h-full bg-white relative overflow-hidden">
                <ModalHeader
                    width={width}
                    height={height}
                    zoom={zoom}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onZoomReset={handleZoomReset}
                    onClose={onClose}
                />

                {/* Área do grid */}
                <div
                    ref={containerRef}
                    className="w-full h-full pt-14 sm:pt-16 overflow-hidden cursor-move select-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ userSelect: 'none' }}
                    draggable={false}
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
                        <Grid
                            width={width}
                            height={height}
                            obstacles={obstacles}
                            cellSize={gridValues.cellSize}
                            showCoordinates={true}
                            isOpen={isOpen}
                        />
                    </div>
                </div>

                <ModalInstructions showInstructions={showInstructions} setShowInstructions={setShowInstructions} />
            </div>
        </div>
    );
};

export default GridViewModal;
