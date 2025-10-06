import { useEffect, useRef } from 'react';

export function GameCanvas({ character, obstacles, legs, width = 800, height = 600 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    render(ctx, character, obstacles, legs);
  });

  const render = (ctx, character, obstacles, legs) => {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Camera offset - follow the character
    const cameraX = Math.max(0, character.x - 200);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Draw ground
    ctx.fillStyle = '#16213e';
    ctx.fillRect(cameraX, 550, width, 50);

    // Draw obstacles
    ctx.fillStyle = '#0f3460';
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw legs
    if (legs && legs.length > 0) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3;
      legs.forEach(leg => {
        ctx.beginPath();
        ctx.moveTo(character.x + leg.x1, character.y + leg.y1);
        ctx.lineTo(character.x + leg.x2, character.y + leg.y2);
        ctx.stroke();
      });
    }

    // Draw character
    ctx.fillStyle = '#00d9ff';
    ctx.beginPath();
    ctx.arc(character.x, character.y, character.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw debug info (genome points as small circles)
    if (legs && legs.length > 0) {
      ctx.fillStyle = '#00ff88';
      legs.forEach(leg => {
        ctx.beginPath();
        ctx.arc(character.x + leg.x1, character.y + leg.y1, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(character.x + leg.x2, character.y + leg.y2, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-gray-700 rounded-lg"
    />
  );
}
