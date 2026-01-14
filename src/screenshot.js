import html2canvas from 'html2canvas';

/**
 * Captures a screenshot of the specified area
 * @param {Object} rect - Selection rectangle {x, y, width, height}
 * @returns {Promise<string>} Base64-encoded PNG image
 */
export async function captureScreenshot(rect) {
    try {
        const canvas = await html2canvas(document.body, {
            x: rect.x + window.scrollX,
            y: rect.y + window.scrollY,
            width: rect.width,
            height: rect.height,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: null
        });

        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Screenshot capture failed:', error);
        // Return a placeholder if screenshot fails
        return createPlaceholderImage(rect.width, rect.height);
    }
}

function createPlaceholderImage(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Screenshot kunde inte tas', width / 2, height / 2);

    return canvas.toDataURL('image/png');
}
