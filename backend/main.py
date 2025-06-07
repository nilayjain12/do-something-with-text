from flask import Flask, request, jsonify
from flask_cors import CORS
import groq
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/')
def index():
    """Provides a simple status message to confirm the backend is running."""
    return jsonify({
        "status": "ok",
        "message": "DSFT backend is running. It's ready to receive requests from the Edge extension."
    }), 200

def validate_key(api_key: str):
    """Validates the Groq API key by making a lightweight call."""
    try:
        client = groq.Groq(api_key=api_key)
        client.chat.completions.create(
            messages=[{"role": "user", "content": "hello"}],
            model="llama3-8b-8192",
            max_tokens=2,
        )
        return True
    except Exception as e:
        print(f"API Key validation failed: {e}")
        return False

@app.route('/validate-key', methods=['POST'])
def validate_key_endpoint():
    data = request.get_json()
    api_key = data.get('api_key')
    if not api_key:
        return jsonify({"error": "API key is required"}), 400

    if validate_key(api_key):
        return jsonify({"message": "API key is valid"}), 200
    else:
        return jsonify({"error": "Invalid API key"}), 401

@app.route('/process-text', methods=['POST'])
def process_text():
    data = request.get_json()
    action = data.get('action')
    text = data.get('text')
    api_key = data.get('api_key')

    if not all([action, text, api_key]):
        return jsonify({"error": "Missing required parameters"}), 400

    if not validate_key(api_key):
        return jsonify({"error": "Invalid API key provided for processing"}), 401
    
    client = groq.Groq(api_key=api_key)
    model = "llama3-8b-8192"

    try:
        if action == 'summarize-text':
            prompt = f"Summarize the following text concisely. Format the output using Markdown for readability if needed (e.g., bolding key terms, using bullet points for lists):\n\n{text}"
        elif action == 'generate-text':
            prompt = f"Continue writing from the following text. Format the output using Markdown for readability if needed:\n\n{text}"
        elif action == 'find-meaning':
            prompt = f"Explain the meaning of the following word or phrase in simple, layman's terms. The definition should be easy to understand. Then, provide one clear example of how it is used in a sentence. Use Markdown for formatting (e.g., bold the word, use italics for the example).\n\nText: \"{text}\""
        else:
            return jsonify({"error": "Invalid action"}), 400

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=model,
        )
        result = chat_completion.choices[0].message.content
        return jsonify({"result": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting DSFT Backend Server at http://127.0.0.1:5000")
    app.run(port=5000, debug=True)