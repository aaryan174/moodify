import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceExpression() {

    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");

    const init = async () => {

        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );

        streamRef.current = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        const video = videoRef.current;
        video.srcObject = streamRef.current;

        video.onloadeddata = () => {
            detect();
        };

        await video.play();
    };

    const detect = () => {

        const video = videoRef.current;

        if (
            !landmarkerRef.current ||
            !video ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            animationRef.current = requestAnimationFrame(detect);
            return;
        }

        const results = landmarkerRef.current.detectForVideo(
            video,
            performance.now()
        );

        if (results.faceBlendshapes?.length > 0) {

            const blendshapes = results.faceBlendshapes[0].categories;

            const getScore = (name) =>
                blendshapes.find((b) => b.categoryName === name)?.score || 0;

            const smileLeft = getScore("mouthSmileLeft");
            const smileRight = getScore("mouthSmileRight");
            const jawOpen = getScore("jawOpen");
            const browUp = getScore("browInnerUp");
            const frownLeft = getScore("mouthFrownLeft");
            const frownRight = getScore("mouthFrownRight");

           let currentExpression = "Neutral";

if (smileLeft > 0.5 && smileRight > 0.5) {
    currentExpression = "Happy 😄";
}
else if (jawOpen > 0.35 && browUp > 0.2) {
    currentExpression = "Surprised 😲";
}
else if (frownLeft > 0.25 && frownRight > 0.25 && browUp > 0.2) {
    currentExpression = "Sad 😢";
}

            setExpression(currentExpression);
        }

        animationRef.current = requestAnimationFrame(detect);
    };

    useEffect(() => {

        init();

        return () => {

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };

    }, []);

    return (
        <div style={{ textAlign: "center" }}>

            <video
                ref={videoRef}
                style={{
                    width: "420px",
                    borderRadius: "12px",
                    transform: "scaleX(-1)"
                }}
                autoPlay
                playsInline
            />

            <h2>{expression}</h2>

        </div>
    );
}