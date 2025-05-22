from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename
from PIL import Image
import os

app = Flask(__name__)

UPLOAD_FOLDER_ORIGINAL = 'static/uploads/originals'
UPLOAD_FOLDER_UPSCALED = 'static/uploads/upscaled'
app.config['UPLOAD_FOLDER_ORIGINAL'] = UPLOAD_FOLDER_ORIGINAL
app.config['UPLOAD_FOLDER_UPSCALED'] = UPLOAD_FOLDER_UPSCALED

os.makedirs(UPLOAD_FOLDER_ORIGINAL, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_UPSCALED, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.files['image']
    scale = int(request.form['scale'])

    filename = secure_filename(image.filename)
    original_path = os.path.join(app.config['UPLOAD_FOLDER_ORIGINAL'], filename)
    upscaled_path = os.path.join(app.config['UPLOAD_FOLDER_UPSCALED'], f"upscaled_{filename}")

    image.save(original_path)

    # Image Upscaling
    img = Image.open(original_path)
    upscaled = img.resize((img.width * scale, img.height * scale), Image.LANCZOS)
    upscaled.save(upscaled_path)

    return {
        'original_url': f"/{original_path}",
        'upscaled_url': f"/{upscaled_path}"
    }

@app.route('/static/uploads/<folder>/<filename>')
def uploaded_file(folder, filename):
    return send_from_directory(f'static/uploads/{folder}', filename)

if __name__ == '__main__':
    app.run(debug=True)

