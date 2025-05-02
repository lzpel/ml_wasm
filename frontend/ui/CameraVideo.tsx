'use client';

import React, {useEffect, useRef, useState} from 'react';
import {fetchArrayBuffer, recognition} from "@/utils";
import DetectionWrapper from "@/ui/DetectionWrapper";
import {Detection} from "@/output";

const CameraVideo = (props: React.VideoHTMLAttributes<HTMLVideoElement> & {interval: number, onInterval:(e:HTMLVideoElement)=>void}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
	const {interval, onInterval, ...props_inner}=props

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

	useEffect(() => {
		if(props.interval && props.interval > 0){
			const interval = setInterval(() => {
				if (videoRef.current)props.onInterval(videoRef.current)
			}, props.interval);
			return () => clearInterval(interval);
		}
	}, [props.onInterval]);
    return <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        {...props_inner}
    />
};

export default CameraVideo;
export const CapturedCameraVideo=(props: React.VideoHTMLAttributes<HTMLVideoElement> & {onnx: string})=>{
	const [detections, setDetections] = React.useState<Detection[]>([])
	const [onnxBuffer, setOnnxBuffer] = React.useState<ArrayBuffer>()
	const canvasRef = React.useRef<HTMLCanvasElement>(null)
	const {onnx, ...props_inner}= props

	useEffect(() => {
		console.log(onnx)
		fetchArrayBuffer(onnx).then((v)=>{
			setOnnxBuffer(v)
			console.log("ここには到達する1", v)
		})
	}, [onnx]);
	const onInterval=React.useCallback((video: HTMLVideoElement)=>{
		const image=new Promise<ArrayBuffer>((resolve, reject) => {
			if(!canvasRef.current)return
			const canvas=canvasRef.current
			const ctx = canvas.getContext('2d');
			if (!ctx) return reject('No canvas context');
			ctx.drawImage(video, 0, 0);
			//const data=ctx.getImageData(0, 0, canvas.width, canvas.height).data
			canvas.toBlob((blob) => {
				if (!blob) return reject(new Error('Failed to create JPEG blob'));
				blob.arrayBuffer().then(resolve).catch(reject);
			}, 'image/jpeg');
		})
		if(onnxBuffer){
			// promiseに変換
			recognition(Promise.resolve(onnxBuffer), image).then(v=>{
				setDetections(v)
				console.log(v)
			})
		}
	}, [onnxBuffer])
	return <>
		<CameraVideo {...props_inner} width={640} height={480} interval={1000} onInterval={onInterval}/>
		<DetectionWrapper detections={detections}>
			<canvas ref={canvasRef} width={640} height={480}></canvas>
		</DetectionWrapper>
	</>
}