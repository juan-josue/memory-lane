from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
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
@cross_origin()
def textToSpeech():
    # Parse the incoming JSON data
    data = request.get_json()
    message = data.get('message', '')
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        store=True,
        messages=[
            {"role": "system", "content": "You are tasked with facilitating reminiscence therapy as a care taker for dementia patients. Kindly ask your patient questions to recall events from their life, you will be given a moment from their life."},
            {"role": "user", "content": message}
        ]
    )
    response = completion.choices[0].message.content

    audio = client.audio.speech.create(
        model="tts-1",
        voice="echo",
        input=response,
    )
    
    audio.stream_to_file("speech.mp3")


    # Return a success response
    response = jsonify({"reply": f"{str(response)}", "file_url": '/get-audio'}), 200
    return response

# Endpoint to serve the audio file
@app.route('/get-audio', methods=['GET'])
def getAudio():
    return send_file(speech_file_path, as_attachment=False)

if __name__ == '__main__':
    app.run(debug=True)
