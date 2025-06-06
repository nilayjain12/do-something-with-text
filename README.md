# Do Something With Text - Microsoft Edge Extension

This is a simple, robust, and effective Microsoft Edge extension that provides AI-powered text manipulation tools directly in your browser. It uses the GroqCloud API for fast text summarization and generation.

## Features

-   **Secure API Key Management**: Your GroqCloud API key is stored securely in your browser's local storage.
-   **Context Menu Integration**: Simply highlight text on any webpage to bring up the tool options.
-   **AI-Powered Tools**:
    -   **Summarize Text**: Get a concise summary of any selected text.
    -   **Generate Text**: Use the selected text as a prompt to generate more content.
    -   **Text-to-Speech**: Listen to the selected text read aloud.
-   **Minimalistic UI**: A clean and non-intrusive user interface ensures a smooth experience.
-   **Copy to Clipboard**: Easily copy the results with a single click.

## Setup Instructions

### Step 1: Get a GroqCloud API Key

1.  Go to the [GroqCloud Console](https://console.groq.com/keys).
2.  Sign up or log in to your account.
3.  Navigate to the **API Keys** section and create a new secret key.
4.  Copy the key. You will need it in a later step.

### Step 2: Set Up and Run the Python Backend

This extension uses a local Python backend to securely handle API requests to GroqCloud.

1.  **Prerequisites**: Make sure you have Python 3.6+ and `pip` installed.
2.  **Navigate to the Backend Directory**:
    Open a terminal or command prompt and navigate to the `backend` folder within the project directory.
    ```sh
    cd /path/to/groq-text-manipulator-edge/backend
    ```
3.  **Create a Virtual Environment** (Recommended):
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
4.  **Install Dependencies**:
    ```sh
    pip install -r requirements.txt
    ```
5.  **Run the Backend Server**:
    ```sh
    python main.py
    ```
    You should see a message indicating that the server is running on `http://127.0.0.1:5000`. Keep this terminal window open while you use the extension.

### Step 3: Load the Extension in Microsoft Edge

1.  Open Microsoft Edge and navigate to `edge://extensions`.
2.  Enable **Developer mode** by toggling the switch in the bottom-left corner.
3.  Click on the **Load unpacked** button.
4.  Select the entire `groq-text-manipulator-edge` folder (the root directory of this project).
5.  The extension "Groq Text Manipulator" should now appear in your list of extensions.

### Step 4: Configure the Extension

1.  Click on the Groq Text Manipulator icon in the Edge toolbar. A pop-up will appear.
2.  Paste your GroqCloud API key into the input field and click **Save Key**.
3.  The extension will validate the key. If it's valid, the key will be saved, and you are ready to go!

## How to Use

1.  Navigate to any webpage with text.
2.  Highlight the text you want to work with.
3.  **Right-click** on the selected text.
4.  From the context menu, choose one of the options:
    -   **Summarize Text**
    -   **Generate Text**
    -   **Text-to-Speech**
5.  A pop-up will appear in the top-right corner of the page with the result.