import React from 'react';

interface ModalInstructionsProps {
    showInstructions: boolean;
    setShowInstructions: (show: boolean) => void;
}

const ModalInstructions: React.FC<ModalInstructionsProps> = ({ showInstructions, setShowInstructions }) => {
    return (
        <div className="absolute bottom-4 left-4 max-w-xs md:max-w-md">
            <div className="bg-black bg-opacity-75 rounded overflow-hidden">
                <button
                    className="text-white px-2 md:px-3 py-1 text-xs md:text-sm w-full text-left hover:bg-black hover:bg-opacity-90 transition-colors"
                    onClick={() => setShowInstructions(!showInstructions)}
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
                        <div className="space-y-1">
                            <div>
                                • <span className="font-medium">Arrastar:</span> Navegar pelo mapa
                            </div>
                            <div>
                                • <span className="font-medium">Setas:</span> ↑ ↓ ← → Navegar pelo mapa
                            </div>
                            <div>
                                • <span className="font-medium">+ / -:</span> Zoom in/out
                            </div>
                            <div>
                                • <span className="font-medium">CTRL + Scroll:</span> Zoom in/out
                            </div>
                            <div>
                                • <span className="font-medium">0:</span> Reset zoom
                            </div>
                            <div>
                                • <span className="font-medium">Esc:</span> Fechar modal
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalInstructions;
