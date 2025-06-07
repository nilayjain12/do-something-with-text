// Function to validate the Groq API key
async function validateApiKey(apiKey) {
  try {
    const response = await fetch('http://127.0.0.1:5000/validate-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: apiKey }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

// Listen for the initial installation of the extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['apiKey'], (result) => {
    if (!result.apiKey) {
      // If no API key is found, open the popup to ask for it
      chrome.action.setPopup({ popup: 'src/popup.html' });
    }
  });

  // Create context menus upon installation
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

// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: handleContextMenuClick,
      args: [info.menuItemId, info.selectionText]
    });
  }
});

// This function is injected and executed in the context of the web page
function handleContextMenuClick(menuItemId, selectedText) {
  const event = new CustomEvent('contextMenuAction', {
    detail: {
      action: menuItemId,
      text: selectedText
    }
  });
  document.dispatchEvent(event);
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'validateApiKey') {
    validateApiKey(request.apiKey).then(isValid => {
      sendResponse({ isValid });
    });
    return true; // Indicates that the response is sent asynchronously
  }
});