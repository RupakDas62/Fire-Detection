from ultralytics import YOLO

# Load the trained model
model = YOLO('best.pt')

# Export to ONNX format
model.export(format='onnx', imgsz=384)  # imgsz can be 256, 320, 640 etc.
