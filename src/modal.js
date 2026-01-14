/**
 * Creates the feedback modal dialog
 */
export function createModal(screenshot, onSubmit, onCancel) {
    const backdrop = document.createElement('div');
    backdrop.className = 'fw-modal-backdrop';

    backdrop.innerHTML = `
    <div class="fw-modal">
      <div class="fw-modal__header">
        <h2 class="fw-modal__title">Skicka feedback</h2>
        <button class="fw-modal__close" aria-label="Stäng">&times;</button>
      </div>
      <div class="fw-modal__body">
        <img class="fw-modal__preview" src="${screenshot}" alt="Markerat område">
        
        <div class="fw-form-group">
          <label>Typ av feedback</label>
          <div class="fw-radio-group">
            <label>
              <input type="radio" name="fw-type" value="bug" checked>
              🐛 Felrapport
            </label>
            <label>
              <input type="radio" name="fw-type" value="suggestion">
              💡 Förslag
            </label>
          </div>
        </div>
        
        <div class="fw-form-group">
          <label for="fw-priority">Prioritet</label>
          <select id="fw-priority" class="fw-select">
            <option value="low">Låg</option>
            <option value="normal" selected>Normal</option>
            <option value="high">Hög</option>
            <option value="critical">Kritisk</option>
          </select>
        </div>
        
        <div class="fw-form-group">
          <label for="fw-description">Beskrivning</label>
          <textarea id="fw-description" class="fw-textarea" placeholder="Beskriv problemet eller förslaget..."></textarea>
        </div>
      </div>
      <div class="fw-modal__footer">
        <button class="fw-btn fw-btn--secondary" data-action="cancel">Avbryt</button>
        <button class="fw-btn fw-btn--primary" data-action="submit">Skicka Feedback</button>
      </div>
    </div>
  `;

    const closeBtn = backdrop.querySelector('.fw-modal__close');
    const cancelBtn = backdrop.querySelector('[data-action="cancel"]');
    const submitBtn = backdrop.querySelector('[data-action="submit"]');
    const descriptionField = backdrop.querySelector('#fw-description');

    function cleanup() {
        if (backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
        }
    }

    function handleSubmit() {
        const type = backdrop.querySelector('input[name="fw-type"]:checked').value;
        const priority = backdrop.querySelector('#fw-priority').value;
        const description = descriptionField.value.trim();

        if (!description) {
            descriptionField.focus();
            descriptionField.style.borderColor = '#dc2626';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Skickar...';

        onSubmit({ type, priority, description });
    }

    closeBtn.addEventListener('click', () => { cleanup(); onCancel(); });
    cancelBtn.addEventListener('click', () => { cleanup(); onCancel(); });
    submitBtn.addEventListener('click', handleSubmit);

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            cleanup();
            onCancel();
        }
    });

    document.body.appendChild(backdrop);
    descriptionField.focus();

    return { cleanup };
}

/**
 * Shows a toast notification
 */
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fw-toast fw-toast--${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}
