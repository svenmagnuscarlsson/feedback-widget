/**
 * Handles the snapshot overlay and area selection
 */
export function createOverlay(onSelect, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'fw-overlay';

    const banner = document.createElement('div');
    banner.className = 'fw-overlay__banner';
    banner.innerHTML = 'Dra för att markera ett område <kbd>ESC</kbd> för att avbryta';

    const selection = document.createElement('div');
    selection.className = 'fw-selection';
    selection.style.display = 'none';

    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    function handleMouseDown(e) {
        isDrawing = true;
        startX = e.clientX;
        startY = e.clientY;
        selection.style.display = 'block';
        selection.style.left = startX + 'px';
        selection.style.top = startY + 'px';
        selection.style.width = '0px';
        selection.style.height = '0px';
    }

    function handleMouseMove(e) {
        if (!isDrawing) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        selection.style.left = left + 'px';
        selection.style.top = top + 'px';
        selection.style.width = width + 'px';
        selection.style.height = height + 'px';
    }

    function handleMouseUp(e) {
        if (!isDrawing) return;
        isDrawing = false;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const rect = {
            x: Math.min(startX, currentX),
            y: Math.min(startY, currentY),
            width: Math.abs(currentX - startX),
            height: Math.abs(currentY - startY)
        };

        // Minimum selection size
        if (rect.width > 10 && rect.height > 10) {
            cleanup();
            onSelect(rect);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            cleanup();
            onCancel();
        }
    }

    function cleanup() {
        overlay.removeEventListener('mousedown', handleMouseDown);
        overlay.removeEventListener('mousemove', handleMouseMove);
        overlay.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('keydown', handleKeyDown);

        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (banner.parentNode) banner.parentNode.removeChild(banner);
        if (selection.parentNode) selection.parentNode.removeChild(selection);
    }

    overlay.addEventListener('mousedown', handleMouseDown);
    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    document.body.appendChild(overlay);
    document.body.appendChild(banner);
    document.body.appendChild(selection);

    return { cleanup };
}
