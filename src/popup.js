document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const statusEl = document.getElementById('status');

  // Load saved API key if it exists
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  saveBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      statusEl.textContent = 'API Key cannot be empty.';
      statusEl.style.color = 'red';
      return;
    }

    statusEl.textContent = 'Validating...';
    statusEl.style.color = 'orange';

    try {
      // Use the background script for validation by sending a message
      const response = await chrome.runtime.sendMessage({
        action: 'validateApiKey',
        apiKey: apiKey
      });

      if (response.isValid) {
        chrome.storage.local.set({ apiKey: apiKey }, () => {
          statusEl.textContent = 'API Key saved successfully!';
          statusEl.style.color = 'green';
          setTimeout(() => window.close(), 1500);
        });
      } else {
        statusEl.textContent = 'Invalid API Key. Please try again.';
        statusEl.style.color = 'red';
      }
    } catch (error) {
      console.error('Error during validation:', error);
      statusEl.textContent = 'Validation failed. Ensure backend is running.';
      statusEl.style.color = 'red';
    }
  });
});