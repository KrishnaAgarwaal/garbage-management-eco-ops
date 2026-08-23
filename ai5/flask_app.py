from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io, base64

app = Flask(__name__)
CORS(app)
MODEL_PATH = "weights/best.pt"
model = YOLO(MODEL_PATH)

def run_inference(file_bytes, conf=0.5):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    results = model.predict(img, conf=conf)

    annotated = results[0].plot()
    annotated_rgb = annotated[:, :, ::-1]
    annotated_img = Image.fromarray(annotated_rgb)
    buf = io.BytesIO()
    annotated_img.save(buf, format="PNG")
    img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    detections = []
    for box in results[0].boxes:
        detections.append({
            "label": results[0].names[int(box.cls)],
            "confidence": float(box.conf),
            "bbox": box.xyxy.tolist()
        })

    return img_b64, detections

@app.route("/detect", methods=["POST"])
def detect():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    conf = float(request.form.get("conf", 0.5))
    img_b64, detections = run_inference(file.read(), conf)
    return jsonify({"detections": detections, "image_base64": img_b64})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
