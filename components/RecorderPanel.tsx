'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, CheckCircle } from 'lucide-react';

interface RecorderPanelProps {
  onComplete: (blob: Blob) => void;
  isLoading: boolean;
}

export default function RecorderPanel({ onComplete, isLoading }: RecorderPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordedBlob(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      setAudioUrl(null);
      setRecordedBlob(null);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('无法获取麦克风权限');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-200 p-8">
      <div className="flex flex-col items-center gap-6">
        {!audioUrl && !isRecording && (
          <button
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-200 transition-all hover:scale-105"
          >
            <Mic size={32} />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse shadow-lg shadow-red-200 transition-all"
          >
            <Square size={32} fill="currentColor" />
          </button>
        )}

        {audioUrl && !isRecording && (
          <div className="flex items-center gap-4">
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-100 rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              重新录音
            </button>
            <button
              onClick={() => recordedBlob && onComplete(recordedBlob)}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <CheckCircle size={18} />
              )}
              提交评分
            </button>
          </div>
        )}

        <div className="text-center">
          <p className={`text-lg font-mono font-bold ${isRecording ? 'text-red-500' : 'text-gray-600'}`}>
            {isRecording ? formatTime(duration) : audioUrl ? '录音完成' : '准备好后，点击开始跟练'}
          </p>
          {audioUrl && (
            <audio src={audioUrl} controls className="mt-4 h-10 w-64" />
          )}
        </div>
      </div>
    </div>
  );
}
