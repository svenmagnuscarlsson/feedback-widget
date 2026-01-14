/**
 * Creates the floating feedback button
 */
export function createButton(position, onClick) {
    const button = document.createElement('button');
    button.className = `fw-button fw-button--${position}`;
    button.setAttribute('aria-label', 'Skicka feedback');
    button.setAttribute('title', 'Skicka feedback');

    // Feedback/comment icon
    button.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  `;

    button.addEventListener('click', onClick);
    document.body.appendChild(button);

    return button;
}

export function removeButton(button) {
    if (button && button.parentNode) {
        button.parentNode.removeChild(button);
    }
}
