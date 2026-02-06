import { Settings } from "lucide-react";
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

interface ControlsProps {
  settings: Settings;
  updateSettings: (
    key: keyof Settings,
    value: string | number | boolean,
  ) => void;
  onDownload: () => void;
  hasFile: boolean;
}

export function Controls({
  settings,
  updateSettings,
  onDownload,
  hasFile,
}: ControlsProps) {
  return (
    <div className="w-full lg:w-80 bg-white border-l border-gray-100 p-6 flex flex-col gap-8 shadow-sm overflow-y-auto">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">Config</h2>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Dimensions</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500">Width (px)</label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => updateSettings("width", Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500">Height (px)</label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => updateSettings("height", Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Spacing</h3>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 flex justify-between">
            Padding <span>{settings.padding}px</span>
          </label>
          <input
            type="range"
            min="0"
            max={Math.min(settings.width, settings.height) / 2}
            value={settings.padding}
            onChange={(e) => updateSettings("padding", Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      {/* Background */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Details</h3>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) =>
                updateSettings("backgroundColor", e.target.value)
              }
              className="h-9 w-9 p-0.5 rounded-md border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) =>
                updateSettings("backgroundColor", e.target.value)
              }
              className="flex-1 px-3 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sticker Effect */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <label
            className="text-sm font-medium text-gray-900 cursor-pointer select-none"
            htmlFor="sticker-toggle"
          >
            Sticker Effect
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="sticker-toggle"
              id="sticker-toggle"
              checked={settings.stickerEffect}
              onChange={(e) =>
                updateSettings("stickerEffect", e.target.checked)
              }
              className={cn(
                "toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0",
                settings.stickerEffect
                  ? "right-0 border-indigo-600 left-5"
                  : "border-gray-300",
              )}
            />
            <label
              htmlFor="sticker-toggle"
              className={cn(
                "toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-all duration-300",
                settings.stickerEffect ? "bg-indigo-600" : "bg-gray-300",
              )}
            ></label>
          </div>
        </div>

        {settings.stickerEffect && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">Sticker Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.stickerColor}
                  onChange={(e) =>
                    updateSettings("stickerColor", e.target.value)
                  }
                  className="h-8 w-8 p-0.5 rounded-md border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.stickerColor}
                  onChange={(e) =>
                    updateSettings("stickerColor", e.target.value)
                  }
                  className="flex-1 px-3 py-1.5 bg-white border-gray-200 rounded-lg text-xs font-mono uppercase outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 flex justify-between">
                Sticker Padding <span>{settings.stickerPadding}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.stickerPadding}
                onChange={(e) =>
                  updateSettings("stickerPadding", Number(e.target.value))
                }
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onDownload}
          disabled={!hasFile}
          className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
