
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Loader2 } from 'lucide-react';
import { extractTextFromImage } from '../services/geminiService';

interface ScannerModalProps {
  onScanComplete: (text: string) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ onScanComplete, onClose, isDarkMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Erreur caméra:", err);
      alert("Impossible d'accéder à la caméra. Vérifie tes permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleScan = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    try {
      const base64 = capturedImage.split(',')[1];
      const extractedText = await extractTextFromImage(base64, 'image/jpeg');
      onScanComplete(extractedText);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'extraction du texte.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {!capturedImage ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-contain"
            />
          ) : (
            <img src={capturedImage} className="w-full h-full object-contain" />
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 animate-spin text-indigo-400" />
                <div className="absolute inset-0 w-16 h-1 w-full bg-white/20 animate-scan pointer-events-none"></div>
              </div>
              <h3 className="text-xl font-bold font-display mb-2">Analyse de ta plume...</h3>
              <p className="text-indigo-200 text-sm italic">Gemini déchiffre tes écrits pour les transformer en texte numérique.</p>
            </div>
          )}

          {!capturedImage && !isProcessing && (
            <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-80 border-2 border-dashed border-white/40 rounded-lg"></div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-950 flex items-center justify-center gap-6">
          {!capturedImage ? (
            <button 
              onClick={captureFrame}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 border-4 border-slate-950 rounded-full"></div>
            </button>
          ) : (
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={resetCapture}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5" /> Refaire
              </button>
              <button 
                onClick={handleScan}
                disabled={isProcessing}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/40"
              >
                <Check className="w-5 h-5" /> Utiliser ce texte
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-4 text-slate-400 text-sm font-medium">Cadre ta rédaction dans le viseur pour un scan optimal.</p>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
