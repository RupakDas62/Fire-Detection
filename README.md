# 🔥 AI Fire Detection & Alert System

A real-time AI-based fire detection system that uses a YOLO model (converted to ONNX) to detect fire via webcam and automatically sends alerts to a backend server with location data.

---

## 🚀 Overview

This project combines:

* 🧠 Deep Learning (YOLOv8)
* ⚡ ONNX Runtime for fast inference
* 🎥 Real-time webcam detection (OpenCV)
* 🌍 IP-based geolocation
* 🌐 Backend API (Node.js)
* 📧 Notification system (Email alerts)

It creates a complete pipeline:

**Webcam → Detection → Image Capture → Location → Backend → Notification**

---

## 🏗️ Project Structure

```bash
fire-detection/
│
├── fire-detection/
│   ├── best.pt                # Trained YOLO model
│   ├── best.onnx              # Optimized ONNX model (used for inference)
│   ├── fire.py                # Real-time detection script
│   ├── convert_to_onnx.py     # Model conversion script
│   ├── New_Fire_Final.ipynb   # Training & dataset processing
│   └── results(50).csv        # Training results
│
└── server/
    ├── app.js
    ├── routes/
    │   ├── fireReportRoute.js
    │   └── createOfficeRoute.js
    ├── controllers/
    │   ├── fireController.js
    │   ├── createOfficeController.js
    │   └── Helpers/
    │       ├── geoService.js
    │       └── notificationService.js
    ├── models/
    │   └── fireOfficeSchema.js
    └── middlewares/
        └── uploadMiddleware.js
```

---

## 🧠 Core Features

* 🔥 Detects fire in real-time using webcam
* ⚡ Uses ONNX model for faster inference
* 📸 Captures frame when fire is detected
* 🌍 Automatically fetches location (IP-based)
* 📤 Sends report to backend API
* 📧 Notifies fire offices via email
* 🏢 Supports fire office registration

---

## 🧪 Machine Learning Pipeline

### 📊 Dataset Processing

From training notebook:

* Total training images: ~3936
* Validation images: ~985
* Classes:

  * `0 → no_fire`
  * `1 → fire`

### 🧹 Data Cleaning

* Removed orphan labels/images
* Handled empty label files (~49)
* Ensured YOLO format consistency

### 🏋️ Model Training

* Base model: `yolov8s.pt`
* Epochs: 50
* Image size: 640
* Final performance improved progressively (mAP ↑)

---

## 🔄 Model Conversion (PyTorch → ONNX)

```python
from ultralytics import YOLO

model = YOLO('best.pt')
model.export(format='onnx', imgsz=384)
```

---

## 🎥 Real-Time Detection Flow

Inside `fire.py` :

### Key Steps:

1. Load ONNX model:

```python
model = YOLO("best.onnx", task="detect")
```

2. Capture webcam feed (OpenCV)

3. Resize frame → 384x384

4. Run inference:

```python
results = model(frame, conf=0.25)
```

5. If fire detected:

* Save frame as `fire.jpg`
* Fetch location using `geocoder`
* Send report to backend

---

## 🌍 Location Handling

* Uses `geocoder.ip('me')`
* Returns GeoJSON format:

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

Fallback:

```json
[0.0, 0.0]
```

---

## 📡 Backend API

### 🔥 Fire Report Endpoint

**POST** `/api/fire-report`

**Functionality:**

* Receives image + location
* Finds nearest fire offices
* Sends email alerts

---

### 🏢 Create Fire Office

**POST** `/api/create-office`

```json
{
  "name": "Station A",
  "email": "station@email.com",
  "location": {
    "type": "Point",
    "coordinates": [lng, lat]
  }
}
```

---

## 📧 Notification System

Handled in:

```
controllers/Helpers/notificationService.js
```

* Sends alert emails to nearby fire stations
* Triggered automatically after fire detection

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo

```bash
git clone https://github.com/RupakDas62/fire-detection.git
cd fire-detection
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
npm start
```

---

### 3️⃣ Run Fire Detection

```bash
cd fire-detection
python fire.py
```

---

## 🔐 Environment Variables

Create `.env` inside `server/`:

```env
PORT=8080
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## ⚠️ Limitations

* ❌ IP-based location is not highly accurate
* ❌ False positives possible depending on environment
* ❌ Works on single webcam (no multi-camera support)
* ❌ Requires backend running locally

---

## 🔮 Future Improvements

* 📱 Mobile app integration
* 🎥 CCTV / RTSP stream support
* 📍 GPS-based accurate tracking
* ☁️ Cloud deployment (AWS / Docker)
* 🔔 SMS & push notifications
* 🗺️ Real-time dashboard

---

## 👨‍💻 Author

**Rupak Das**

* B.Tech CSE (AI & ML)
* Full Stack Developer (MERN)
* AI Enthusiast

---
