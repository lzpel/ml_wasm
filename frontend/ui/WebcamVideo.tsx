'use client';

import React, {useEffect, useRef, useState} from 'react';

const WebcamVideo = (props: React.VideoHTMLAttributes<HTMLVideoElement>) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				});
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (err: any) {
				setError('カメラへのアクセスに失敗しました: ' + err.message);
			}
		};

		startCamera();

		return () => {
			// クリーンアップ: ストリームを停止
			if (videoRef.current?.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream.getTracks().forEach(track => track.stop());
			}
		};
	}, []);

	return error ? (
		<div>{error}</div>
	) : (
		<video
			ref={videoRef}
			autoPlay
			playsInline
			muted
			{...props}
		/>
	)
};

export default WebcamVideo;