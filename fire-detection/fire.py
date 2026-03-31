from ultralytics import YOLO
import cv2
import requests
import json
import geocoder
import time

# -------- CONFIG --------
MODEL_PATH = "best.onnx"
BACKEND_URL = "http://localhost:8080/api/fire-report"
DESCRIPTION = "🔥 Fire detected from webcam"
FRAME_SAVE_PATH = "fire.jpg"
# -----------------------

def get_location():
    try:
        g = geocoder.ip('me')
        if g.ok:
            return {"type": "Point", "coordinates": [g.lng, g.lat]}
    except:
        pass
    return {"type": "Point", "coordinates": [0.0, 0.0]}


def send_report(image_path, location):
    try:
        with open(image_path, "rb") as f:
            files = {"image": f}
            data = {
                "description": DESCRIPTION,
                "location": json.dumps(location)
            }
            res = requests.post(BACKEND_URL, data=data, files=files)
            print("Report sent:", res.status_code)
    except Exception as e:
        print("Error sending report:", e)


# Load model (explicit task to avoid warning)
model = YOLO(MODEL_PATH, task="detect")

# Start webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Camera not working. Congratulations.")
    exit()

reported = False
prev_time = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # -------- FPS CALCULATION --------
    curr_time = time.time()
    fps = 1 / (curr_time - prev_time) if prev_time != 0 else 0
    prev_time = curr_time
    # --------------------------------

    # Resize to match ONNX input (384x384)
    resized_frame = cv2.resize(frame, (384, 384))

    # Run detection
    results = model(resized_frame, conf=0.25, imgsz=384)

    # Draw detections
    annotated = results[0].plot()

    # Check if fire detected
    for box in results[0].boxes:
        cls_id = int(box.cls[0])

        if cls_id == 1:  # fire class
            print("🔥 FIRE DETECTED")

            if not reported:
                cv2.imwrite(FRAME_SAVE_PATH, frame)
                location = get_location()
                send_report(FRAME_SAVE_PATH, location)
                reported = True

    # -------- DRAW FPS --------
    cv2.putText(
        annotated,
        f"FPS: {int(fps)}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    # Show output
    cv2.imshow("Fire Detection", annotated)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
