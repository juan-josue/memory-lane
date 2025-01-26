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

# Endpoint to serve the audio file
@app.route('/get-narrative', methods=['GET'])
def getNarrative():
    completion = client.chat.completions.create(
        model="gpt-4o",
        store=True,
        messages=[
            {"role": "system", "content": "Here are the patients past messages with you: " + "--".join(messages)},
            {"role": "user", "content": "summary description: You are a compassionate storyteller and reminiscence therapist. Your task is to craft a deeply personal and heartfelt narrative based on the provided memories and experiences below. Write in a warm, conversational tone, as if you’re speaking directly to the individual. Highlight moments of joy, pride, love, and connection, focusing on the emotions and the essence of the memories rather than just the facts. However, you want to make sure to keep it concise, two sentences per subject. Where details are missing, gently explore the feelings or broader themes, keeping the narrative meaningful, relatable and concise. Reflect the person’s unique perspective and make it feel like their story, celebrating their resilience, growth, and the little things that bring them happiness. The final story should feel comforting, affirming, and deeply personal, as though it were written just for them. You must serperate story sections with -- symbols."}
        ],
    )
    response = completion.choices[0].message.content
    
    chapters = response.split("--")
    
    # Return a success response
    response = jsonify({ "chapters": chapters }), 200
    return response

if __name__ == '__main__':
    app.run(debug=True)
