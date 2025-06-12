import React from 'react';
import { type ObstaclePosition } from '../config/obstaclePositions';
import GridObstacles from './GridObstacles';

interface GridProps {
    width: number;
    height: number;
    obstacles: ObstaclePosition[];
    cellSize: number;
    showCoordinates?: boolean;
    coordinateColumnWidth?: number;
    onCellClick?: (x: number, y: number) => void;
    className?: string;
    isOpen: boolean;
}

const Grid: React.FC<GridProps> = ({
    width,
    height,
    obstacles,
    cellSize,
    showCoordinates = true,
    coordinateColumnWidth = cellSize * 2,
    onCellClick,
    className = '',
    isOpen,
}) => {
    // Criar array de células (memoizado)
    const cells = React.useMemo(
        () => Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => ({ row, col }))),
        [height, width],
    );

    const handleCellClick = (colIndex: number, rowIndex: number) => {
        if (onCellClick) {
            onCellClick(colIndex, rowIndex);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Coordenadas superiores (X) */}
            {showCoordinates && (
                <div className="flex mb-2">
                    <div style={{ width: `${coordinateColumnWidth}px` }}></div>
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
            )}

            {/* Grid principal */}
            <div className={`border-2 bg-white relative ${isOpen ? 'border-gray-800' : 'border-transparent'}`}>
                {/* Grid base (células vazias) */}
                {cells.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {/* Coordenada Y (lateral esquerda) */}
                        {showCoordinates && (
                            <div
                                className="text-xs flex items-center justify-center text-gray-600 bg-gray-100 border-r border-gray-300 font-mono"
                                style={{
                                    width: `${coordinateColumnWidth}px`,
                                    height: `${cellSize}px`,
                                }}
                            >
                                {rowIndex}
                            </div>
                        )}

                        {/* Células do grid */}
                        {row.map((cell, colIndex) => (
                            <div
                                key={`${cell.row}-${cell.col}`}
                                className="border border-gray-300 hover:bg-blue-100 cursor-pointer transition-colors"
                                style={{
                                    width: `${cellSize}px`,
                                    height: `${cellSize}px`,
                                }}
                                title={`Posição: (${colIndex}, ${rowIndex})`}
                                onClick={() => handleCellClick(colIndex, rowIndex)}
                            />
                        ))}
                    </div>
                ))}

                {/* Obstáculos renderizados como elementos absolutos */}
                <GridObstacles
                    obstacles={obstacles}
                    cellSize={cellSize}
                    coordinateColumnWidth={showCoordinates ? coordinateColumnWidth : 0}
                />
            </div>
        </div>
    );
};

export default Grid;
