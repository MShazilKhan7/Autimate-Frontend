import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Volume2, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControlsProps {
  word: string;
  onRecordingComplete: () => void;
  hasRecording: boolean;
}

export default function AudioControls({ word, onRecordingComplete, hasRecording }: AudioControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlayingChild, setIsPlayingChild] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount or word change
  useEffect(() => {
    return () => {
      stopAndCleanup();
    };
  }, []);

  // Reset when word changes
  useEffect(() => {
    stopAndCleanup();
    setAudioUrl(null);
    audioBlobRef.current = null;
    setRecordingDuration(0);
    setIsPlayingChild(false);
    setIsPlayingRef(false);
  }, [word]);

  const stopAndCleanup = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick best supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        audioBlobRef.current = blob;

        // Revoke old URL
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop mic stream
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        onRecordingComplete();
      };

      recorder.start(100); // collect chunks every 100ms
      setIsRecording(true);
      setRecordingDuration(0);

      // Duration timer
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - start) / 1000));
      }, 200);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
      }
    }
  }, [isRecording, onRecordingComplete, audioUrl]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const playChildRecording = useCallback(() => {
    if (!audioUrl || isPlayingChild) return;
    const audio = new Audio(audioUrl);
    audioElRef.current = audio;
    setIsPlayingChild(true);
    audio.onended = () => setIsPlayingChild(false);
    audio.onerror = () => setIsPlayingChild(false);
    audio.play();
  }, [audioUrl, isPlayingChild]);

  const playReference = useCallback(() => {
    if (isPlayingRef) return;
    setIsPlayingRef(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.5;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
        || voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (preferred) utterance.voice = preferred;
      utterance.onend = () => setIsPlayingRef(false);
      utterance.onerror = () => setIsPlayingRef(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingRef(false), 1500);
    }
  }, [isPlayingRef, word]);

  /** Expose the recorded blob for later API submission */
  const getRecordedBlob = useCallback(() => audioBlobRef.current, []);

  // Attach to window for external access if needed
  useEffect(() => {
    (window as any).__getLastRecordedBlob = getRecordedBlob;
    return () => { delete (window as any).__getLastRecordedBlob; };
  }, [getRecordedBlob]);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-4">
      {/* Permission denied warning */}
      {permissionDenied && (
        <div className="text-center text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-2">
          Microphone access denied. Please allow microphone permissions in your browser settings.
        </div>
      )}

      {/* Record Button */}
      <div className="flex flex-col items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative w-20 h-20 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-destructive hover:bg-destructive text-destructive-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            size="lg"
          >
            {isRecording ? <Square className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>

          {isRecording && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-4 border-destructive pointer-events-none"
            />
          )}
        </motion.div>

        <p className="text-sm text-muted-foreground mt-2">
          {isRecording ? (
            <span className="text-destructive font-medium">Recording {formatDuration(recordingDuration)} — tap to stop</span>
          ) : (
            'Tap to record'
          )}
        </p>
      </div>

      {/* Playback Buttons */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={playChildRecording}
          disabled={!audioUrl || isPlayingChild}
          className="rounded-xl gap-2"
        >
          {isPlayingChild ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlayingChild ? 'Playing...' : 'My Voice'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={playReference}
          disabled={isPlayingRef}
          className="rounded-xl gap-2"
        >
          <Volume2 className="w-4 h-4" />
          {isPlayingRef ? 'Playing...' : 'Correct Sound'}
        </Button>
      </div>
    </div>
  );
}
