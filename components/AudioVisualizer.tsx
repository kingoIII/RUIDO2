
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  color: string;
  audioElement?: HTMLAudioElement | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, color, audioElement }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !isPlaying) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 128;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (!sourceRef.current) {
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      sourceRef.current = source;
    }

    analyzerRef.current = analyzer;
    dataArrayRef.current = dataArray;

    return () => {
      if (audioContext.state !== 'closed') {
        // We don't close the context here to avoid issues with the global player
        // but we stop the animation
      }
    };
  }, [audioElement, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isPlaying && analyzerRef.current && dataArrayRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
        const barWidth = (canvas.width / dataArrayRef.current.length) * 2;
        let x = 0;

        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const barHeight = (dataArrayRef.current[i] / 255) * canvas.height;
          
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.4;
          
          // Draw symmetric bars
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, 4);
          ctx.fill();
          
          x += barWidth;
        }
      } else {
        // Idle animation
        const barCount = 40;
        const barWidth = canvas.width / barCount;
        for (let i = 0; i < barCount; i++) {
          const barHeight = Math.sin(Date.now() * 0.002 + i * 0.2) * 10 + 15;
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.1;
          ctx.beginPath();
          ctx.roundRect(i * barWidth, canvas.height - barHeight, barWidth - 4, barHeight, 4);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={150} 
      className="w-full h-full"
    />
  );
};

export default AudioVisualizer;
