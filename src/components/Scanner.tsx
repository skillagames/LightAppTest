import { useRef, useEffect, useState } from 'react';
import { CameraOff, ScanLine } from 'lucide-react';
import { motion } from 'motion/react';

interface ScannerProps {
  onSimulateScan: () => void;
}

export default function Scanner({ onSimulateScan }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isActive = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (isActive && videoRef.current) {
          videoRef.current.srcObject = stream;
          // Play needed for some mobile browser policies
          videoRef.current.play().catch(e => console.error("Video play failed:", e));
          setHasPermission(true);
        }
      } catch (err) {
        console.warn("Camera fallback active (permission denied or unavailable)");
        if (isActive) setHasPermission(false);
      }
    };
    
    startCamera();
    
    return () => {
      isActive = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="px-6 pt-10 pb-4 flex justify-between items-center bg-white z-10 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Welcome back</span>
          <h1 className="text-2xl font-extrabold text-slate-800">QuickScan</h1>
        </div>
      </div>

      <div className="px-6 flex-1 space-y-6 mt-2 flex flex-col">
        <div className="relative group overflow-hidden rounded-3xl aspect-square bg-slate-900 shadow-2xl shrink-0">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>

          <video 
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10 ${hasPermission ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            muted
          />

          {hasPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center bg-slate-900/50 backdrop-blur-sm z-10">
              <CameraOff className="w-8 h-8 mb-3 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Mock Scanner</h2>
              <p className="text-[10px] text-slate-500 mt-2">Camera disabled. Using simulator.</p>
            </div>
          )}

          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
             <div className="w-48 h-48 border-2 border-blue-400/50 rounded-2xl flex items-center justify-center relative">
               {scanning && (
                 <motion.div
                   animate={{ top: ['0%', '100%', '0%'] }}
                   transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                   className="absolute left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_15px_#60a5fa]"
                 />
               )}
             </div>
             
             <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-lg" />
             <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-lg" />
             <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-lg" />
             <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-lg" />
             
             <div className="absolute bottom-8 left-0 right-0 text-center">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-[10px] font-mono text-white tracking-widest uppercase rounded">Align barcode with line</span>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end pb-8">
          <button
            onClick={() => {
              setScanning(false);
              onSimulateScan();
              setTimeout(() => setScanning(true), 2000);
            }}
            className="w-full bg-blue-600 active:bg-blue-700 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ScanLine className="w-5 h-5" />
            Simulate Scan
          </button>
        </div>
      </div>
    </div>
  );
}
