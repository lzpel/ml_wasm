"use client"
// 一個のelementをpropsから受け取り、そのelementを子に持ち、子の描画内容をjpegのバイナリデータとして取得しconsoleに表示するコンポーネントを買い手
import React, {useEffect, useRef, useState} from 'react';
type ImageOrVideoElement = React.ReactElement<
  React.ImgHTMLAttributes<HTMLImageElement> | React.VideoHTMLAttributes<HTMLVideoElement>,
  'img' | 'video'
>;
const CaptureElement = (props: { element: ImageOrVideoElement }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [buffer, setBuffer] = useState<ArrayBuffer>()

	useEffect(() => {
		const img = imgRef.current;
		const canvas = canvasRef.current;
		if (!img || !canvas) return;

		img.onload = () => {
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.drawImage(img, 0, 0);

			canvas.toBlob((blob) => {
				blob?.arrayBuffer().then((buffer) => {
					setBuffer(buffer)
				})
			}, 'image/jpeg');
		};
	}, []);
	// あるコンポーネントを買いて、このコンポーネントは
	return (
		<>
			{React.cloneElement(props.element, {ref: imgRef})}
			<canvas ref={canvasRef} style={{display: 'none'}}/>
		</>
	);
};

export default CaptureElement;