from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=key)  # Ensure you have the `openai` package installed

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)


# File path for saving the generated audio
speech_file_path = Path(__file__).parent / "speech.mp3"

# Input audio and receive gen AI response
@app.route('/text-to-speech', methods=['POST'])
def textToSpeech():
    # Parse the incoming JSON data
    data = request.get_json()
    message = data.get('message', '')

    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=message,
    )
    
    response.stream_to_file("output.mp3")

    # Save the audio data to a file
    # with open(speech_file_path, "wb") as audio_file:
    #     audio_file.write(response.audio_data)

    # Return a success response
    return jsonify({"reply": f"You said: {message}", "file_saved": str(speech_file_path)}), 200

if __name__ == '__main__':
    app.run(debug=True)
