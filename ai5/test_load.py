from ultralytics import YOLO
from PIL import Image

model = YOLO("weights/best.pt")
print("Model loaded:", model)

# try a sample image inside your repo or weights/images folder
img_path = "images/def1.jpg"  # adjust if needed
img = Image.open(img_path).convert("RGB")
results = model.predict(img, conf=0.5)
print("Got results, number of boxes:", len(results[0].boxes))
for b in results[0].boxes:
    print("cls/conf/xyxy:", int(b.cls), float(b.conf), b.xyxy.tolist())
