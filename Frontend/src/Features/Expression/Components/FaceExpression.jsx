import { useEffect, useRef, useState } from "react";
import { detect, init } from '../../../utils/utils';

export default function FaceExpression({ onClick = () => { } }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Initializing camera...");
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                console.log("[FaceExpression] Initializing...");
                await init({ landmarkerRef, videoRef, streamRef });
                if (!cancelled) {
                    console.log("[FaceExpression] Init success");
                    setExpression("Ready - click Detect");
                }
            } catch (error) {
                // Treat AbortError from video.play() as a non-fatal warning
                if (error?.name === "AbortError") {
                    console.warn("[FaceExpression] AbortError from video.play(), continuing anyway", error);
                    if (!cancelled) {
                        setExpression("Ready - click Detect");
                    }
                    return;
                }

                console.error("[FaceExpression] Failed to initialize face detector", error);
                if (!cancelled) {
                    setExpression("Camera / model error");
                }
            }
        })();

        return () => {
            cancelled = true;

            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        console.log("[FaceExpression] Detect button clicked");

        if (!landmarkerRef.current || !videoRef.current) {
            console.warn("[FaceExpression] Missing landmarker/video on click");
            return;
        }

        setIsDetecting(true);
        setExpression("Detecting...");

        let finalExpression = null;

        // Try multiple times over ~2 seconds to get a stable expression
        for (let i = 0; i < 10 && !finalExpression; i++) {
            const result = detect({ landmarkerRef, videoRef, setExpression });
            console.log("[FaceExpression] detect() result", i, result);
            if (result) {
                finalExpression = result;
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        if (!finalExpression) {
            setExpression("Could not detect face");
        }

        setIsDetecting(false);
        console.log("[FaceExpression] Final expression sent to parent:", finalExpression);
        onClick(finalExpression);
    }

    // Hidden container: camera & button run, but UI is invisible.
    return (
        <div
            style={{
                position: "absolute",
                width: 1,
                height: 1,
                opacity: 0,
                overflow: "hidden",
                pointerEvents: "none"
            }}
        >
            <video
                ref={videoRef}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                }}
                playsInline
            />
            <div>{expression}</div>
            <button
                id="face-detect-button"
                onClick={handleClick}
                disabled={isDetecting || expression.startsWith("Initializing")}
            >
                {isDetecting ? "Detecting..." : "Detect expression"}
            </button>
        </div>
    );
}