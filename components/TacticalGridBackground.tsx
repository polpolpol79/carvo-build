import React, { useEffect, useRef } from 'react';

interface TacticalGridBackgroundProps {
  darkMode: boolean;
}

export const TacticalGridBackground: React.FC<TacticalGridBackgroundProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkModeRef = useRef(darkMode);

  // Update ref when prop changes without triggering re-render of effect
  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;
    let dots: { x: number; y: number; baseOpacity: number; phase: number; offset: number }[] = [];
    
    // Internal color state for smooth transition
    // 0 = Dark dots (Light Mode), 1 = Light dots (Dark Mode)
    let colorState = darkModeRef.current ? 1 : 0; 
    
    // Density balanced for performance and visual clarity
    const spacing = 10; 
    let time = 0;
    let currentPattern = 0;
    let lastPatternShift = Date.now();

    const initDots = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      dots = [];

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const startX = (width - (cols - 1) * spacing) / 2;
      const startY = (height - (rows - 1) * spacing) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: startX + i * spacing,
            y: startY + j * spacing,
            baseOpacity: 0.4 + Math.random() * 0.4, 
            phase: Math.random() * Math.PI * 2,
            offset: (i + j) * 0.05 
          });
        }
      }
    };

    const draw = () => {
      time += 0.025; // Slightly faster for more "live" feel
      
      // Update color state smoothly
      const targetState = darkModeRef.current ? 1 : 0;
      // Lerp factor - adjust 0.05 for faster/slower color transition
      colorState += (targetState - colorState) * 0.05; 

      // Interpolate RGB values
      // Light Mode (Target 0): 0,0,0 (Black)
      // Dark Mode (Target 1): 255,255,255 (White)
      const r = Math.round(colorState * 255);
      const g = Math.round(colorState * 255);
      const b = Math.round(colorState * 255);
      const currentDotColor = `${r}, ${g}, ${b}`;

      // TRAIL EFFECT: Instead of full clear, we partially erase the previous frame
      // This creates the "fade out" sensation the user requested
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; // High value = shorter trails, Low value = long persistence
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      
      const now = Date.now();
      if (now - lastPatternShift > 12000) {
        currentPattern = (currentPattern + 1) % 3;
        lastPatternShift = now;
      }

      dots.forEach((dot) => {
        let patternIntensity = 0;
        let zOffset = 0;

        // Enhanced 3D topography with higher amplitude
        if (currentPattern === 0) {
          const dist = Math.sqrt(Math.pow(dot.x - width / 2, 2) + Math.pow(dot.y - height / 2, 2)) * 0.012;
          zOffset = Math.sin(time + dist) * 22; // Deeper waves
          patternIntensity = Math.sin(time + dist) * 0.5 + 0.5;
        } else if (currentPattern === 1) {
          zOffset = Math.sin(time + dot.x * 0.008) * Math.cos(time + dot.y * 0.008) * 30; // Rolling hills
          patternIntensity = (Math.sin(time + dot.x * 0.008) * Math.cos(time + dot.y * 0.008)) * 0.5 + 0.5;
        } else {
          const scan = (dot.x + dot.y) * 0.004;
          zOffset = Math.sin(time * 1.8 + scan) * 18; // Diagonal sweep
          patternIntensity = Math.sin(time + scan) * 0.5 + 0.5;
        }

        const breathing = Math.sin(time * 0.4 + dot.phase) * 0.5 + 0.5;
        // heightFactor determines visibility based on "altitude"
        const heightFactor = (zOffset + 30) / 60; 
        
        // Final alpha is smoother, no hard clipping
        const finalAlpha = patternIntensity * breathing * dot.baseOpacity * heightFactor * 1.2;

        if (finalAlpha > 0.02) {
          // Perspective projection simulation
          // Points move based on their height (zOffset)
          const renderX = dot.x + (zOffset * 0.4);
          const renderY = dot.y + (zOffset * 0.4);
          
          // Size also changes based on "height" to enhance 3D feel
          const radius = Math.max(0.4, 2.2 * heightFactor);

          ctx.beginPath();
          ctx.arc(renderX, renderY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${currentDotColor}, ${finalAlpha})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initDots();
    draw();

    const handleResize = () => {
      initDots();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures effect runs only once

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-80"
      // Removed mix-blend-mode multiply to allow white dots to show
    />
  );
};
