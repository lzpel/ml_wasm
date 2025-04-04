import FetchDetectedImage from "@/ui/FetchDetectedImage";

export default function Home() {
	return (
		<>
			<ul>
				<li>yolov8の画像認識モデルをonnxに変換</li>
				<li>onnxによる推論とyoloの前処理・後処理をrust実装。推論の実装にはtract-onnx crateを使用。</li>
				<li>rustコード全体をwasm-packでWebAssemblyとしてコンパイルし、wasmファイルとglueコードを得る</li>
				<li>wasmファイルとglueコードをNextJsで読み込みフロントエンドに統合</li>
				<li>フロントエンド画像認識が実現（エッジML・サーバーMLに続く第3の選択肢）</li>
				<li>process.env.NEXT_PUBLIC_PREFIX=`${process.env.NEXT_PUBLIC_PREFIX}`</li>
			</ul>
			<FetchDetectedImage
				src={`${process.env.NEXT_PUBLIC_PREFIX}/output/input/baseball.jpg`}
				onnx={`${process.env.NEXT_PUBLIC_PREFIX}/output/onnx/yolov8n.onnx`}
			/>
		</>
	);
}
