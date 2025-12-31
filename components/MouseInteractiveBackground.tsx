import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const MouseInteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lightningRef = useRef<{ x: number, y: number, opacity: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const spawnSparks = (x: number, y: number) => {
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          life: 1.0,
          color: Math.random() > 0.5 ? '#00ffff' : '#ffffff'
        });
      }
    };

    const createLightning = () => {
      // Adjusted frequency to feel "charged" but not overwhelming
      if (Math.random() > 0.93) {
        const side = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0;
        if (side === 0) { startX = Math.random() * canvas.width; startY = -50; }
        else if (side === 1) { startX = canvas.width + 50; startY = Math.random() * canvas.height; }
        else if (side === 2) { startX = Math.random() * canvas.width; startY = canvas.height + 50; }
        else { startX = -50; startY = Math.random() * canvas.height; }
        
        lightningRef.current.push({ x: startX, y: startY, opacity: 1.0 });
        // Visual impact at target
        spawnSparks(mouseRef.current.x, mouseRef.current.y);
      }
    };

    const drawRealisticLightning = (
      ctx: CanvasRenderingContext2D, 
      x1: number, 
      y1: number, 
      x2: number, 
      y2: number, 
      opacity: number, 
      isBranch: boolean = false
    ) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      
      let curX = x1;
      let curY = y1;
      const segments = isBranch ? 6 : 14;
      const jag = isBranch ? 12 : 45;
      
      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const targetX = x1 + (x2 - x1) * t;
        const targetY = y1 + (y2 - y1) * t;
        
        // Add random jaggedness
        curX = targetX + (Math.random() - 0.5) * jag;
        curY = targetY + (Math.random() - 0.5) * jag;
        ctx.lineTo(curX, curY);

        // Branching logic for realism
        if (!isBranch && Math.random() > 0.94 && i < segments - 2) {
          const bAngle = (Math.random() - 0.5) * Math.PI;
          const bLen = Math.random() * 80 + 20;
          const bx = curX + Math.cos(bAngle) * bLen;
          const by = curY + Math.sin(bAngle) * bLen;
          drawRealisticLightning(ctx, curX, curY, bx, by, opacity * 0.4, true);
        }
      }
      
      ctx.lineTo(x2, y2);
      
      // Hyper-Neon Layering
      ctx.globalCompositeOperation = 'lighter';
      
      // 1. Extreme Outer Glow (Cyan)
      ctx.shadowBlur = isBranch ? 10 : 35;
      ctx.shadowColor = '#00ffff';
      ctx.strokeStyle = `rgba(0, 150, 255, ${opacity * 0.4})`;
      ctx.lineWidth = isBranch ? 1 : 4;
      ctx.stroke();

      // 2. Neon Middle (Deep Blue)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(0, 50, 255, ${opacity * 0.8})`;
      ctx.lineWidth = isBranch ? 0.8 : 2.5;
      ctx.stroke();

      // 3. Bright White Core
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = isBranch ? 0.4 : 1.2;
      ctx.stroke();
      
      ctx.globalCompositeOperation = 'source-over';
    };

    const updateParticles = () => {
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.life -= 0.02;
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    };

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
      ctx.globalCompositeOperation = 'lighter';
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const { x, y } = mouseRef.current;

      // Draw Denser Converging Hyper-Blue Lines
      const lineCount = 20;
      ctx.lineWidth = 1.0;
      
      const drawLineSet = (count: number, w: number, h: number, mx: number, my: number) => {
        for(let i = 0; i <= count; i++) {
          const tx = (w / count) * i;
          const ty = (h / count) * i;
          
          // Edges
          [ {sx: tx, sy: 0}, {sx: tx, sy: h}, {sx: 0, sy: ty}, {sx: w, sy: ty} ].forEach(p => {
            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.06)';
            ctx.stroke();
          });
        }
      };
      
      drawLineSet(lineCount, canvas.width, canvas.height, x, y);

      // Handle Energy Discharge
      createLightning();
      updateParticles();
      drawParticles(ctx);

      lightningRef.current = lightningRef.current.filter(l => l.opacity > 0.01);
      lightningRef.current.forEach(l => {
        drawRealisticLightning(ctx, l.x, l.y, x, y, l.opacity);
        l.opacity *= 0.86;
      });

      // Subtle mouse aura
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 100, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-90"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default MouseInteractiveBackground;