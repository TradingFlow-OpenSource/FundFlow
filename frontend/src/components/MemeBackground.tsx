import React, { useEffect, useState, useRef } from 'react';

interface MemeItem {
  id: number;
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  rotate: number;
}

const MEMES: MemeItem[] = [
  { id: 1, content: '🐸', x: 10, y: 20, size: 120, rotate: -15 }, // Pepe
  { id: 2, content: '🐕', x: 85, y: 15, size: 100, rotate: 15 }, // Doge
  { id: 3, content: '🙀', x: 15, y: 80, size: 90, rotate: -10 }, // Cat/Hakimi
  { id: 4, content: '🗿', x: 92, y: 85, size: 110, rotate: 5 }, // Gigachad
  { id: 5, content: '🤡', x: 50, y: 50, size: 140, rotate: 0 }, // Clown
  { id: 6, content: '🦍', x: 80, y: 50, size: 130, rotate: -20 }, // Harambe
  { id: 7, content: '💎', x: 25, y: 45, size: 80, rotate: 45 }, // Diamond
  { id: 8, content: '🚀', x: 70, y: 30, size: 90, rotate: -45 }, // Moon
  { id: 9, content: '🌚', x: 40, y: 10, size: 100, rotate: 0 }, // Moon face
  { id: 10, content: '👺', x: 60, y: 90, size: 95, rotate: 20 }, // Goblin
  { id: 11, content: '📉', x: 5, y: 50, size: 80, rotate: -10 }, // Panic
  { id: 12, content: '🧠', x: 35, y: 70, size: 85, rotate: 30 }, // Big Brain
];

export const MemeBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initialize window size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {MEMES.map((meme) => {
        // Calculate absolute position
        const memeX = (meme.x / 100) * windowSize.width;
        const memeY = (meme.y / 100) * windowSize.height;
        
        // Calculate distance
        const dist = Math.sqrt(Math.pow(mousePos.x - memeX, 2) + Math.pow(mousePos.y - memeY, 2));
        
        // Interaction radius
        const VISIBILITY_RADIUS = 350;
        
        let opacity = 0.03; // Base visibility (very faint)
        let blur = 10; // Base blur
        let scale = 1;

        if (dist < VISIBILITY_RADIUS) {
            const factor = 1 - (dist / VISIBILITY_RADIUS); // 0 to 1 based on closeness
            opacity = 0.03 + (factor * 0.8); // Max opacity ~0.8
            blur = 10 - (factor * 10); // Clear blur as you get closer
            scale = 1 + (factor * 0.3); // Slight zoom
        }

        return (
          <div
            key={meme.id}
            className="absolute transition-all duration-100 ease-out will-change-transform select-none flex items-center justify-center"
            style={{
              left: `${meme.x}%`,
              top: `${meme.y}%`,
              width: `${meme.size}px`,
              height: `${meme.size}px`,
              fontSize: `${meme.size}px`,
              transform: `translate(-50%, -50%) rotate(${meme.rotate}deg) scale(${scale})`,
              opacity: opacity,
              filter: `blur(${blur}px) grayscale(0.2)`,
              textShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}
          >
            {meme.content}
          </div>
        );
      })}
    </div>
  );
};