import WebcamVideo from "@/ui/WebcamVideo";
import React from "react";
import FetchDetectedImage from "@/ui/FetchDetectedImage";

export default function Home() {
	const image=`${process.env.NEXT_PUBLIC_PREFIX}/output/input/baseball.jpg`
	const onnx=`${process.env.NEXT_PUBLIC_PREFIX}/output/onnx/yolov8n.onnx`
	return (
		<>
			<ul>
				<li>yolov8の画像認識モデルをonnxに変換</li>
				<li>onnxによる推論とyoloの前処理・後処理をrust実装。推論の実装にはtract-onnx crateを使用。</li>
				<li>rustコード全体をwasm-packでWebAssemblyとしてコンパイルし、wasmファイルとglueコードを得る</li>
				<li>wasmファイルとglueコードをNextJsで読み込みフロントエンドに統合</li>
			</ul>
			<FetchDetectedImage src={image} onnx={onnx}/>
			<WebcamVideo width="100%" height="auto"/>
		</>
	);
}
