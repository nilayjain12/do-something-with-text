// Listen for the custom event from the background script
document.addEventListener('contextMenuAction', (e) => {
  const { action, text } = e.detail;
  handleAction(action, text);
});

// Listen for messages from the iframe (e.g., to close itself)
window.addEventListener('message', (event) => {
    if (event.data.type === 'closeDsftSidebar') {
        closeSidebar();
    }
});
const SIDEBAR_ID = 'dsft-sidebar-iframe';

// Main function to handle actions
async function handleAction(action, text) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    alert("Groq API key is not set. Please set it in the extension's popup.");
    return;
  }

  // Create the sidebar if it doesn't exist
  createSidebar();

  if (action === 'summarize-text' || action === 'generate-text') {
    // Show loading state in the sidebar
    postMessageToSidebar({ type: 'groqLoading' });
    try {
      const response = await fetchFromBackend(action, text, apiKey);
      // Send the result to the sidebar
      postMessageToSidebar({ type: 'groqResult', content: response.result });
    } catch (error) {
      console.error('Error:', error);
      postMessageToSidebar({ type: 'groqResult', content: `Error: ${error.message}` });
    }
  } else if (action === 'text-to-speech') {
    handleTextToSpeech(text);
  }
}

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
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, '*');
    }
}

// --- HELPER FUNCTIONS (UNCHANGED) ---

function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey'], (result) => resolve(result.apiKey));
  });
}

async function fetchFromBackend(action, text, apiKey) {
  const response = await fetch('http://127.0.0.1:5000/process-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, text, api_key: apiKey }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process text');
  }
  return response.json();
}

let currentUtterance = null;
function handleTextToSpeech(text) {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    if (currentUtterance && currentUtterance.text === text) {
      currentUtterance = null;
      return;
    }
  }
  currentUtterance = new SpeechSynthesisUtterance(text);
  // Optional: If you want to show an error in the sidebar for TTS issues.
  // currentUtterance.onerror = (event) => {
  //   createSidebar();
  //   postMessageToSidebar({ type: 'groqResult', content: `Text-to-Speech Error: ${event.error}` });
  // };
  speechSynthesis.speak(currentUtterance);
}