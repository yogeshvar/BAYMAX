from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from transformers import AutoTokenizer, AutoModelWithLMHead
from dotenv import dotenv_values

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

access_token = dotenv_values("../.env")['access_token']

tokenizer = AutoTokenizer.from_pretrained('gpt2-medium')
model = AutoModelWithLMHead.from_pretrained(
    dotenv_values('../.env')['model_name'], use_auth_token=access_token)


@app.route("/")
def hello_world():
    return "Hello, World! From Flask"


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin',
                         '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


@app.route("/runModel", methods=['POST'])
@cross_origin()
def runModel():
    # get a request body from the client
    req = request.get_json()

    # get the input data from the request body
    seeker_post = req['seeker']
    response_post = req['response']
    return_original = req['return_original']
    input_ids = tokenizer.encode(seeker_post, return_tensors='pt')
    output = model.generate(input_ids, max_length=100,
                            repetition_penalty=1.2,
                            pad_token_id=tokenizer.eos_token_id,
                            no_repeat_ngram_size=3,
                            do_sample=True,
                            top_k=100,
                            top_p=0.7,
                            temperature=0.8)
    # get only the output and ignore the input_text
    if return_original:
        output_text = output[0]
    else:
        output_text = output[:, input_ids.shape[-1]:][0]
    output_decoded = tokenizer.decode(output_text)
    if output_decoded == "<|endoftext|>":
        output_decoded = "I don't know what to say... Can you be more specific? <|endoftext|>"

    return jsonify({'output': output_decoded})


if __name__ == "__main__":
    app.run(debug=True, port=9000)
