import React, { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";

interface Settings {
  width: number;
  height: number;
  padding: number;
  backgroundColor: string;
  stickerEffect: boolean;
  stickerColor: string;
  stickerPadding: number;
}

interface PreviewProps {
  settings: Settings;
  setFile: (file: File | null) => void;
  file: File | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function Preview({ settings, setFile, file, canvasRef }: PreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/svg+xml": [".svg"],
    },
    maxFiles: 1,
  });

  // Load image from file
  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      imageRef.current = null;
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageUrl(url);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Draw to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = settings.width;
    canvas.height = settings.height;

    // 1. Draw Background
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill Background
    if (
      settings.backgroundColor &&
      settings.backgroundColor !== "transparent"
    ) {
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (!imageRef.current) return;

    const img = imageRef.current;

    // Calculate available area for the CONTENT (Icon + Sticker Background)
    const availWidth = settings.width - settings.padding * 2;
    const availHeight = settings.height - settings.padding * 2;

    if (availWidth <= 0 || availHeight <= 0) return;

    const centerX = settings.width / 2;
    const centerY = settings.height / 2;

    if (settings.stickerEffect) {
      // STICKER MODE: Outline/Contour

      // 1. Calculate scaling to fit the padded content
      const imgAspect = img.width / img.height;
      const availW = settings.width - settings.padding * 2;
      const availH = settings.height - settings.padding * 2;

      // We need to account for the sticker padding which effectively increases the distinct size of the object
      const safeW = availW - settings.stickerPadding * 2;
      const safeH = availH - settings.stickerPadding * 2;

      let renderW = safeW;
      let renderH = safeW / imgAspect;

      if (renderH > safeH) {
        renderH = safeH;
        renderW = safeH * imgAspect;
      }

      const drawX = centerX - renderW / 2;
      const drawY = centerY - renderH / 2;

      // 2. Create Offscreen Canvas for Silhouette
      const offCanvas = document.createElement("canvas");
      offCanvas.width = settings.width;
      offCanvas.height = settings.height;
      const offCtx = offCanvas.getContext("2d");

      if (offCtx) {
        // Draw image at correct position
        offCtx.drawImage(img, drawX, drawY, renderW, renderH);

        // Composite operation to turn opaque pixels into stickerColor
        offCtx.globalCompositeOperation = "source-in";
        offCtx.fillStyle = settings.stickerColor;
        offCtx.fillRect(0, 0, settings.width, settings.height);

        // 3. Draw Silhouette multiple times to create "Stroke"
        // We draw the silhouette in a circle around the original position
        const steps = 36; // Number of draws for smoothness (every 10deg)
        const radius = settings.stickerPadding;

        for (let i = 0; i < steps; i++) {
          const angle = (i * 2 * Math.PI) / steps;
          const xOff = Math.cos(angle) * radius;
          const yOff = Math.sin(angle) * radius;

          ctx.drawImage(offCanvas, xOff, yOff);
        }

        // Fill the gaps for large padding (optional, but circle draw usually covers strictly for small radius)
        // For better quality with large padding, we might need multiple rings, but we'll stick to one for performance
        // and visual style (usually stickers have uniform offset).

        // Draw the center filled silhouette to cover the "inside" if the stroke leaves holes?
        // Actually, 'source-in' keeps the inside. So drawing offCanvas at 0,0 covers the body.
        ctx.drawImage(offCanvas, 0, 0);
      }

      // 4. Draw Original Image on Top
      ctx.drawImage(img, drawX, drawY, renderW, renderH);
    } else {
      // NORMAL MODE
      // Just fit image in availWidth/Height
      const imgAspect = img.width / img.height;

      let renderW = availWidth;
      let renderH = availWidth / imgAspect;

      if (renderH > availHeight) {
        renderH = availHeight;
        renderW = availHeight * imgAspect;
      }

      ctx.drawImage(
        img,
        centerX - renderW / 2,
        centerY - renderH / 2,
        renderW,
        renderH,
      );
    }
  }, [settings, imageUrl, imageRef.current]); // Dependencies

  return (
    <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "w-96 h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 gap-4",
            isDragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50",
          )}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              Drop SVG here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">Supports SVG files</p>
          </div>
        </div>
      ) : (
        <div
          className="relative shadow-2xl rounded-sm overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-200"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        >
          {/* We display the canvas logic here */}
          {/* To show transparency, we can put a checkerboard pattern behind the canvas */}
          <div
            className="absolute inset-0 z-[-1] opacity-20"
            style={{
              backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          ></div>

          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[80vh] object-contain block mx-auto"
            style={{
              width: settings.width > 800 ? "auto" : settings.width,
              height: "auto",
            }}
          />

          {/* Reset Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 rounded-lg shadow-sm border border-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
