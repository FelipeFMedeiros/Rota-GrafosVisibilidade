import React from 'react';

interface ModalHeaderProps {
    width: number;
    height: number;
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
    width,
    height,
    zoom,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onClose,
}) => {
    return (
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
                    onClick={onZoomOut}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 md:p-2 rounded transition-colors"
                    title="Zoom Out (-)"
                >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>

                <button
                    onClick={onZoomReset}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 md:px-3 py-1 md:py-2 rounded text-xs"
                    title="Reset (0)"
                >
                    100%
                </button>

                <button
                    onClick={onZoomIn}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 md:p-2 rounded transition-colors"
                    title="Zoom In (+)"
                >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 md:p-2 rounded transition-colors ml-2 md:ml-4 hover:cursor-pointer"
                    title="Fechar (Esc)"
                >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ModalHeader;
