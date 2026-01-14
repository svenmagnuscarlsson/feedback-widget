import './styles.css';
import { createButton, removeButton } from './button.js';
import { createOverlay } from './overlay.js';
import { captureScreenshot } from './screenshot.js';
import { createModal, showToast } from './modal.js';

/**
 * Feedback Widget - Main module
 */
const FeedbackWidget = {
    config: null,
    button: null,
    currentOverlay: null,
    currentModal: null,

    /**
     * Initialize the feedback widget
     * @param {Object} options - Configuration options
     */
    init(options = {}) {
        // Default configuration
        this.config = {
            webhookUrl: options.webhookUrl || null,
            position: options.position || 'bottom-right',
            theme: options.theme || 'light',
            language: options.language || 'sv',
            zIndex: options.zIndex || 9999,
            showOnMobile: options.showOnMobile !== false
        };

        if (!this.config.webhookUrl) {
            console.error('FeedbackWidget: webhookUrl is required');
            return;
        }

        // Check mobile visibility
        if (!this.config.showOnMobile && this.isMobile()) {
            return;
        }

        // Apply theme and z-index
        document.documentElement.setAttribute('data-fw-theme', this.config.theme);
        document.documentElement.style.setProperty('--fw-z-index', this.config.zIndex);

        // Create floating button
        this.button = createButton(this.config.position, () => this.startCapture());
    },

    /**
     * Check if device is mobile
     */
    isMobile() {
        return window.innerWidth < 768;
    },

    /**
     * Start the capture process
     */
    startCapture() {
        // Hide button during capture
        if (this.button) {
            this.button.style.display = 'none';
        }

        this.currentOverlay = createOverlay(
            (rect) => this.handleSelection(rect),
            () => this.cancelCapture()
        );
    },

    /**
     * Handle area selection
     */
    async handleSelection(rect) {
        // Show button again
        if (this.button) {
            this.button.style.display = 'flex';
        }

        // Capture screenshot
        const screenshot = await captureScreenshot(rect);

        // Show modal
        this.currentModal = createModal(
            screenshot,
            (formData) => this.submitFeedback({ ...formData, screenshot, rect }),
            () => this.cancelCapture()
        );
    },

    /**
     * Cancel the capture process
     */
    cancelCapture() {
        if (this.button) {
            this.button.style.display = 'flex';
        }

        if (this.currentOverlay) {
            this.currentOverlay.cleanup();
            this.currentOverlay = null;
        }

        if (this.currentModal) {
            this.currentModal.cleanup();
            this.currentModal = null;
        }
    },

    /**
     * Submit feedback to webhook
     */
    async submitFeedback(data) {
        const payload = {
            id: this.generateUUID(),
            timestamp: new Date().toISOString(),
            type: data.type,
            priority: data.priority,
            description: data.description,
            screenshot: data.screenshot,
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            userAgent: navigator.userAgent,
            selection: data.rect
        };

        try {
            const response = await fetch(this.config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (this.currentModal) {
                this.currentModal.cleanup();
                this.currentModal = null;
            }

            if (response.ok) {
                showToast('✓ Feedback skickad!', 'success');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('FeedbackWidget: Failed to send feedback', error);
            showToast('✗ Kunde inte skicka feedback. Försök igen.', 'error');

            if (this.currentModal) {
                this.currentModal.cleanup();
                this.currentModal = null;
            }
        }
    },

    /**
     * Generate a UUID v4
     */
    generateUUID() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Destroy the widget
     */
    destroy() {
        this.cancelCapture();
        removeButton(this.button);
        this.button = null;
        this.config = null;
    }
};

// Export for global usage
if (typeof window !== 'undefined') {
    window.FeedbackWidget = FeedbackWidget;
}

export default FeedbackWidget;
