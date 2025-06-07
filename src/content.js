const SIDEBAR_ID = 'dsft-sidebar-iframe';

// Listen for messages from the BACKGROUND script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'showLoading') {
    createSidebar();
    postMessageToSidebar({ type: 'groqLoading' });
  } else if (message.type === 'showResult') {
    createSidebar();
    postMessageToSidebar({ type: 'groqResult', content: message.content });
  }
});

// Listen for messages from our OWN IFRAME (to close itself)
window.addEventListener('message', (event) => {
    // Only accept messages from our own iframe, not from the webpage
    const iframe = document.getElementById(SIDEBAR_ID);
    if (event.source === iframe?.contentWindow) {
        if (event.data.type === 'closeDsftSidebar') {
            closeSidebar();
        }
    }
});


// --- UI Management Functions ---

function createSidebar() {
    if (document.getElementById(SIDEBAR_ID)) {
        return; // Sidebar already exists
    }

    const iframe = document.createElement('iframe');
    iframe.id = SIDEBAR_ID;
    iframe.src = chrome.runtime.getURL('src/sidebar.html');

    document.body.appendChild(iframe);
    document.body.classList.add('dsft-sidebar-active');
}

function closeSidebar() {
    const iframe = document.getElementById(SIDEBAR_ID);
    if (iframe) {
        iframe.remove();
    }
    document.body.classList.remove('dsft-sidebar-active');
}

function postMessageToSidebar(message) {
    const iframe = document.getElementById(SIDEBAR_ID);
    // Add a small delay to ensure the iframe's content window is ready to receive messages
    setTimeout(() => {
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(message, '*');
        }
    }, 100);
}