import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Volume2, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import { useScoreSpeech } from "@/hooks/useSpeechAce";

interface AudioControlsProps {
  word: string;
  onRecordingComplete: () => void;
  hasRecording: boolean;
  setSpeechPronunciationScore: (score: any) => void;
}

export default function AudioControls({
  word,
  onRecordingComplete,
  setSpeechPronunciationScore,
}: AudioControlsProps) {
  console.log("Word in AudioControls:", word);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlayingChild, setIsPlayingChild] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { scoreSpeech, isError, isScoring, pronunciationScore, isSuccess } =
    useScoreSpeech();

  // Cleanup
  useEffect(() => {
    return () => stopAll();
  }, []);

  useEffect(() => {
    stopAll();
    setAudioUrl(null);
    audioBlobRef.current = null;
  }, [word]);

  useEffect(() => {
    if (isSuccess && Object.keys(pronunciationScore).length > 0) {
      console.log("Received pronunciation score:", pronunciationScore);
      setSpeechPronunciationScore(pronunciationScore);
    }
  }, [isSuccess, pronunciationScore, setSpeechPronunciationScore]);

  const stopAll = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsRecording(false);
  };

  // 🔥 Convert to WAV (16kHz)
  const convertToWav = async (blob: Blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new AudioContext();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);

    const offlineCtx = new OfflineAudioContext(
      1,
      16000 * decoded.duration,
      16000,
    );
    const source = offlineCtx.createBufferSource();
    source.buffer = decoded;
    source.connect(offlineCtx.destination);
    source.start(0);

    const rendered = await offlineCtx.startRendering();

    const buffer = rendered.getChannelData(0);
    const wavBuffer = encodeWAV(buffer, 16000);

    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  const encodeWAV = (samples: Float32Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s * 0x7fff, true);
    }

    return buffer;
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      // 1️⃣ Convert webm to wav
      const webmBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const wavBlob = await convertToWav(webmBlob);
      audioBlobRef.current = wavBlob;

      // 2️⃣ Create URL for playback
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      // 3️⃣ Notify parent
      onRecordingComplete();

      // await   scoreSpeech({ text: word, audio: wavBlob });
    };
    recorder.start();
    setIsRecording(true);

    const start = Date.now();
    timerRef.current = setInterval(() => {
      setRecordingDuration(Math.floor((Date.now() - start) / 1000));
    }, 200);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const playChildRecording = () => {
    if (!audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    setIsPlayingChild(true);

    audio.onended = () => setIsPlayingChild(false);
    audio.onerror = () => setIsPlayingChild(false);

    audio.play().catch(() => {
      setIsPlayingChild(false);
    });
  };

  const playReference = () => {
    setIsPlayingRef(true);
    const utter = new SpeechSynthesisUtterance(word);
    utter.rate = 0.6;
    utter.onend = () => setIsPlayingRef(false);
    window.speechSynthesis.speak(utter);
  };

  const getRecordedBlob = () => audioBlobRef.current;

  useEffect(() => {
    (window as any).__getLastRecordedBlob = getRecordedBlob;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className="w-20 h-20 rounded-full"
        >
          {isRecording ? <Square /> : <Mic />}
        </Button>
        <p>
          {isRecording ? `Recording ${recordingDuration}s` : "Tap to record"}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={playChildRecording} disabled={!audioUrl}>
          {isPlayingChild ? <Pause /> : <Play />}
          My Voice
        </Button>

        <Button onClick={playReference}>
          <Volume2 />
          Correct Sound
        </Button>
      </div>
    </div>
  );
}
