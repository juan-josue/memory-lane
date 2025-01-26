from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from pathlib import Path
from openai import OpenAI
import os
from dotenv import load_dotenv
from pydantic import BaseModel

messages = []

load_dotenv()
key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=key)

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# File path for saving the generated audio
speech_file_name = "speech" + str(len(messages)) + ".mp3"
speech_file_path = Path(__file__).parent / speech_file_name
intro_file_path = Path(__file__).parent / "intro.mp3"

# Input audio and receive gen AI response
@app.route('/text-to-speech', methods=['POST'])
@cross_origin()
def textToSpeech():
    # Parse the incoming JSON data
    data = request.get_json()
    message = data.get('message', '')
    
    # Keep track of all messages sent
    messages.append(message)
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        store=True,
        messages=[
            {"role": "system", "content": "You are tasked with facilitating reminiscence therapy as a care taker for dementia patients. Kindly ask your patient questions to recall events from their life, you will be given a moment from their life."},
            {"role": "system", "content": "Here are the patients past messages with you: " + "/".join(messages)},
            {"role": "user", "content": message}
        ]
    )
    response = completion.choices[0].message.content

    audio = client.audio.speech.create(
        model="tts-1",
        voice="echo",
        input=response,
        speed=1.2,
    )
    
    audio.stream_to_file("speech" + str(len(messages)) + ".mp3")


    # Return a success response
    response = jsonify({"reply": f"{str(response)}", "file_url": '/get-audio'}), 200
    return response

# Endpoint to serve the audio file
@app.route('/get-audio', methods=['GET'])
def getAudio():
    speech_file_name = "speech" + str(len(messages)) + ".mp3"
    print("sendinging mp3: ", speech_file_name)
    speech_file_path = Path(__file__).parent / speech_file_name
    response = send_file(speech_file_path, as_attachment=False)
    return response

# Endpoint to serve the audio file
@app.route('/get-intro', methods=['GET'])
def getIntro():
    return send_file(intro_file_path, as_attachment=False)

# custom return type
class Narrative(BaseModel):
    chapters: list[str]

# Endpoint to serve the audio file
@app.route('/get-narrative', methods=['GET'])
def getNarrative():
    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        store=True,
        messages=[
            {"role": "system", "content": "Here are the patients past messages with you: " + " ".join(messages)},
            {"role": "user", "content": "Craft a concise recap broken into distinct events/chapters essentially recapping the coversation. Your response for each chapter should be 2 sentences. Keep it concise. Keep the number of chapters low. Dot not title each section just give me the body text."}
        ],
        response_format=Narrative,
    )
    response = completion.choices[0].message.content
    
    # Return a success response
    response = jsonify({"chapters": response}), 200
    return response

if __name__ == '__main__':
    app.run(debug=True)
