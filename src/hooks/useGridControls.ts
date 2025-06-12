import { useState, useCallback, useRef, useEffect } from 'react';

interface UseGridControlsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const useGridControls = ({ isOpen, onClose }: UseGridControlsProps) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    // Reset quando modal abre
    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }
    }, [isOpen]);

    // Controles de zoom
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

    // Manipulador para zoom com CTRL + Scroll
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            if (!isOpen) return;

            if (e.ctrlKey) {
                e.preventDefault();

                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }

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

    // Controles de arrastar
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
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }

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

    // Event listeners
    useEffect(() => {
        const currentContainer = containerRef.current;
        if (isOpen && currentContainer) {
            currentContainer.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                currentContainer.removeEventListener('wheel', handleWheel);
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }
            };
        }
    }, [isOpen, handleWheel]);

    // Controle de teclado
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

    return {
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
    };
};
