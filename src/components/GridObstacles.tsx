import React from 'react';
import { type ObstaclePosition } from '../config/obstaclePositions';

interface GridObstaclesProps {
    obstacles: ObstaclePosition[];
    cellSize: number;
    coordinateColumnWidth: number;
}

const GridObstacles: React.FC<GridObstaclesProps> = ({ obstacles, cellSize, coordinateColumnWidth }) => {
    return (
        <>
            {obstacles.map((obstacle) => {
                const left = coordinateColumnWidth + obstacle.x * cellSize;
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
                        title={`${obstacle.id} - ${obstacle.label.replace('\n', ' ')} (${obstacle.width.toFixed(
                            2,
                        )}m x ${obstacle.height.toFixed(2)}m)`}
                    >
                        {/* Label do obstáculo */}
                        <div
                            className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold pointer-events-none"
                            style={{
                                fontSize: obstacle.type === 'cadeira' ? '10px' : width < 60 ? '8px' : '12px',
                                lineHeight: '1.1',
                                textAlign: 'center',
                                whiteSpace: 'pre-line',
                                textShadow: obstacle.type === 'cadeira' ? '0 0 2px white' : 'none',
                                color: obstacle.type === 'cadeira' ? '#000' : '#333',
                            }}
                        >
                            {obstacle.label}
                        </div>

                        {/* Círculo especial para cadeiras */}
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
        </>
    );
};

export default GridObstacles;
