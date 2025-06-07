// --- Start Helper Functions ---

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

function sendMessageToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      console.warn(
        "Could not send message to tab " + tabId + ". This is expected on protected pages. Error: " +
        chrome.runtime.lastError.message
      );
    }
  });
}

// --- End Helper Functions ---


function handleContextMenuClick(info, tab) {
  (async () => {
    try {
      // --- FIX IS HERE ---
      // Define all variables at the top of the block
      const action = info.menuItemId;
      const text = info.selectionText;
      const tabId = tab.id;
      // -----------------

      if (action === 'text-to-speech') {
        // TTS is special and needs to be executed in the content script
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: execTts,
            args: [text]
        });
        return;
      }
      
      // All other actions follow this flow:
      // Immediately notify the content script to show the loading state
      sendMessageToTab(tabId, { type: 'showLoading' });

      const apiKey = await getApiKey();
      if (!apiKey) {
        throw new Error("API key is not set. Please set it in the extension's popup.");
      }

      const response = await fetchFromBackend(action, text, apiKey);
      // Send the final result back to the content script
      sendMessageToTab(tabId, { type: 'showResult', content: response.result });

    } catch (error) {
      console.error('Error in background script:', error);
      // If an error occurs, send it to the tab for display
      if (tab && tab.id) {
         sendMessageToTab(tab.id, { type: 'showResult', content: `Error: ${error.message}` });
      }
    }
  })();
}

// Main listener for messages from the POPUP (for API key validation)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'validateApiKey') {
    (async () => {
      const isValid = await validateApiKey(message.apiKey);
      sendResponse({ isValid });
    })();
    return true; // Async response
  }
});


// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);


function execTts(text) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}


// --- Extension Installation Logic (Unchanged) ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['apiKey'], (result) => {
    if (!result.apiKey) {
      chrome.action.setPopup({ popup: 'src/popup.html' });
    }
  });

  chrome.contextMenus.create({
    id: "summarize-text",
    title: "Summarize Text",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "generate-text",
    title: "Generate Text",
    contexts: ["selection"]
  });
  
  chrome.contextMenus.create({
    id: "find-meaning",
    title: "Find Meaning",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "text-to-speech",
    title: "Text-to-Speech",
    contexts: ["selection"]
  });
});

async function validateApiKey(apiKey) {
  try {
    const response = await fetch('http://127.0.0.1:5000/validate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}