import { useState, useRef } from "react";
import { Controls } from "./components/Controls";
import { Preview } from "./components/Preview";

interface Settings {
  width: number;
  height: number;
  padding: number;
  backgroundColor: string;
  stickerEffect: boolean;
  stickerColor: string;
  stickerPadding: number;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [settings, setSettings] = useState<Settings>({
    width: 128,
    height: 128,
    padding: 4,
    backgroundColor: "#ffffff00", // transparent
    stickerEffect: false,
    stickerColor: "#ffffff",
    stickerPadding: 4,
  });

  const updateSettings = (
    key: keyof Settings,
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "icon.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
      <Preview
        settings={settings}
        file={file}
        setFile={setFile}
        canvasRef={canvasRef}
      />
      <Controls
        settings={settings}
        updateSettings={updateSettings}
        onDownload={handleDownload}
        hasFile={!!file}
      />
    </div>
  );
}

export default App;
