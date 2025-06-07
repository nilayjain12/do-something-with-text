# Do Something With Text

## Description
Do Something With Text is a browser extension integrated with a Flask backend that leverages the Groq API to provide advanced text processing capabilities. The extension allows users to summarize text, find meaning of text, generate text continuations, and convert text to speech directly from the browser context menu. The backend handles API key validation and communicates with the Groq API using the llama3-8b-8192 model.

## Features
- Summarize selected text concisely.
- Generate text continuation based on selected text.
- Find simple meaning of any selected word or phrase.
- Text-to-Speech functionality for selected text.
- Easy API key management via extension popup.
- Sidebar interface to display results and status.
- Backend API key validation and text processing.

## Prerequisites
- Python 3.7 or higher
- Flask
- Google Chrome or Chromium-based browser
- Valid GroqCloud API key

## Installation

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask backend server:
   ```bash
   python main.py
   ```
   The backend will start at `http://127.0.0.1:5000`.

### Extension Setup
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" (toggle in the top right).
3. Click "Load unpacked" and select the project root directory containing the `src` folder.
4. The extension will be added to Chrome.

## Usage

### Setting the API Key
- Click the extension icon to open the popup.
- Enter your GroqCloud API key and click "Save Key".
- The key will be validated against the backend. If valid, it will be saved for use.

### Using Context Menu Actions
- Select any text on a webpage.
- Right-click to open the context menu.
- Choose one of the following options:
  - **Summarize Text**: Get a concise summary of the selected text.
  - **Generate Text**: Generate a continuation of the selected text.
  - **Text-to-Speech**: Listen to the selected text read aloud.

### Sidebar Interface
- When using "Summarize Text" or "Generate Text", a sidebar will appear displaying the result.
- The sidebar can be closed by sending a message from the iframe or by closing the tab.

## Dependencies

  - Flask
  - flask-cors
  - groq (Groq API client)

## Future Development
#### Coming Soon   .   .   . 

---