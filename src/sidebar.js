// Listen for the close button click
document.getElementById('close-btn').addEventListener('click', () => {
    // Send a message to the content script to close the sidebar
    window.parent.postMessage({ type: 'closeDsftSidebar' }, '*');
});

// Listen for messages from the content script
window.addEventListener('message', (event) => {
    // We only accept messages from our own window
    if (event.source !== window.parent) {
        return;
    }

    const message = event.data;
    const contentArea = document.getElementById('content-area');

    if (message.type === 'groqResult') {
        // 1. Convert the AI's Markdown text to HTML using the 'marked' library
        // 2. Sanitize the HTML to prevent security risks using 'DOMPurify'
        const sanitizedHtml = DOMPurify.sanitize(marked.parse(message.content));

        contentArea.innerHTML = `
            <div>${sanitizedHtml}</div>
            <div class="button-container">
                <button class="copy-btn">Copy to Clipboard</button>
            </div>
        `;

        // Add event listener to the new copy button
        contentArea.querySelector('.copy-btn').addEventListener('click', () => {
            // We copy the original, unformatted text
            navigator.clipboard.writeText(message.content);
            const btn = contentArea.querySelector('.copy-btn');
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
        });
    } else if (message.type === 'groqLoading') {
        contentArea.innerHTML = '<div class="spinner"></div>';
    }
});