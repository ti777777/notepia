import React, { useRef, useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

interface NoteOverlayProps {
    viewObjectId: string;
    name?: string;
    position: { x: number; y: number };
    width: number;
    viewport: { x: number; y: number; zoom: number };
    workspaceId?: string;
    viewId: string;
    isSelected?: boolean;
    onHeightChange?: (viewObjectId: string, height: number) => void;
}

const NoteOverlay: React.FC<NoteOverlayProps> = ({ viewObjectId, name, position, width, viewport, isSelected = false, onHeightChange }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const lastReportedHeightRef = useRef<number>(0);
    const onHeightChangeRef = useRef(onHeightChange);
    const [measuredHeight, setMeasuredHeight] = useState<number>(80);

    useEffect(() => {
        onHeightChangeRef.current = onHeightChange;
    }, [onHeightChange]);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const reportHeight = (height: number) => {
            if (Math.abs(height - lastReportedHeightRef.current) > 1) {
                lastReportedHeightRef.current = height;
                setMeasuredHeight(height);
                onHeightChangeRef.current?.(viewObjectId, height);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            const height = element.offsetHeight;
            if (height > 0) reportHeight(height);
        });

        resizeObserver.observe(element);

        const rafId = requestAnimationFrame(() => {
            const initialHeight = element.offsetHeight;
            if (initialHeight > 0) reportHeight(initialHeight);
        });

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(rafId);
        };
    }, [viewObjectId]);

    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') return null;
    if (!viewport || typeof viewport.x !== 'number' || typeof viewport.y !== 'number') return null;

    const zoom = viewport.zoom || 1;
    const screenX = position.x * zoom + viewport.x;
    const screenY = position.y * zoom + viewport.y;

    const connectionPoints = isSelected ? [
        { x: width / 2, y: 0, label: 'top' },
        { x: width / 2, y: measuredHeight, label: 'bottom' },
        { x: 0, y: measuredHeight / 2, label: 'left' },
        { x: width, y: measuredHeight / 2, label: 'right' },
    ] : [];

    return (
        <div
            className="absolute pointer-events-none origin-top-left"
            style={{
                left: screenX,
                top: screenY,
                transform: `scale(${zoom})`,
            }}
        >
            <div
                ref={contentRef}
                className={`bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-md p-4 select-text ${
                    isSelected
                        ? 'border-3 border-blue-500 border-dashed'
                        : 'border-2 border-yellow-400 dark:border-yellow-600'
                }`}
                style={{ width: `${width}px` }}
            >
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <FileText size={14} />
                    <span className="text-sm font-medium truncate">{name || 'Note'}</span>
                </div>
            </div>
            {connectionPoints.map((point) => (
                <div
                    key={point.label}
                    className="absolute w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                    style={{
                        left: `${point.x}px`,
                        top: `${point.y}px`,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </div>
    );
};

export default NoteOverlay;
