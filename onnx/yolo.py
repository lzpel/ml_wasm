from ultralytics import YOLO

def detection(path_input):
    # 1. 学習済みのYOLOv8nモデルをロード（自動的にダウンロードされる）
    model = YOLO("yolov8n.pt")

    # 2. 任意の画像で物体検出を実行（例: test.jpg）
    results = model(path_input, show=True)  # show=True で画像ウィンドウに表示される

    # 3. ONNX形式にエクスポート
    model.export(format="onnx")

def segmentation(path_input):
    # 1. セグメンテーションモデルをロード（初回は自動ダウンロードされます）
    model = YOLO("yolov8n-seg.pt")

    # 2. セグメンテーション推論（信頼度0.5に設定）
    results = model(path_input, conf=0.5, show=True)  # セグメンテーションマスクを含む

    # 3. ONNXにエクスポート（ファイル名を指定可能）
    model.export(format="onnx")
def pose11(path_input):
    # 1. ポーズ推定モデルをロード（初回時に自動ダウンロード）
    model = YOLO("yolo11n-pose.pt")

    # 2. 任意の画像でポーズ推定を実行（例: test.jpg）
    results = model(path_input, conf=0.5, show=True)

    # 3. ONNX形式でエクスポート（ファイル名指定可）
    model.export(format="onnx")

def main(path_input):
    detection(path_input)
    segmentation(path_input)
    pose11(path_input)

if __name__=="__main__":
    main("../input/baseball.jpg")