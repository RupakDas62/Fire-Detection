import cv2
import requests
import json
import os
import time
from ultralytics import YOLO
from datetime import datetime
import geocoder

# ---------------- CONFIG ----------------
MODEL_PATH = "./best.pt"  # change this
BACKEND_URL = "http://localhost:8080/api/fire-report"
DESCRIPTION = "🔥 Fire detected via YOLOv8 model from live webcam"
DETECTION_THRESHOLD = 0.9  # confidence threshold
FRAME_SAVE_PATH = "fire_frame.jpg"  # temporary image
# ----------------------------------------

def get_geo_location():
    try:
        g = geocoder.ip('me')
        if g.ok:
            return {
                "type": "Point",
                "coordinates": [g.lng, g.lat]
            }
    except Exception as e:
        print("⚠️ Could not fetch geolocation:", e)
    return {
        "type": "Point",
        "coordinates": [0.0, 0.0]  # fallback
    }

def send_fire_report(image_path, location, description):
    try:
        with open(image_path, "rb") as image_file:
            files = {'image': image_file}
            data = {
                'description': description,
                'location': json.dumps(location)
            }
            response = requests.post(BACKEND_URL, data=data, files=files)
            print("📤 Fire report sent. Status:", response.status_code)
            print("🧾 Response:", response.json())
    except Exception as e:
        print("❌ Error sending report:", e)

def main():
    print("🚀 Loading YOLOv8 model...")
    model = YOLO(MODEL_PATH)

    cap = cv2.VideoCapture(0)  # webcam

    if not cap.isOpened():
        print("❌ Cannot access webcam.")
        return

    print("✅ Webcam ready. Starting detection...")
    already_reported = False

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)[0]
        fire_detected = False

        for box in results.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            # Assuming class 1 = fire
            if cls_id == 1 and conf >= DETECTION_THRESHOLD:
                fire_detected = True
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, f"🔥 Fire {conf:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

        cv2.imshow("🔥 Fire Detection", frame)

        # Send fire report only once per session to avoid spamming
        if fire_detected and not already_reported:
            print("🔥 Fire detected! Preparing report...")
            cv2.imwrite(FRAME_SAVE_PATH, frame)
            location = get_geo_location()
            send_fire_report(FRAME_SAVE_PATH, location, DESCRIPTION)
            already_reported = True

        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
