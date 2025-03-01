
import React, { useEffect, useRef } from "react";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Particle properties
    const particlesArray: Particle[] = [];
    const particleCount = 70; // Increased particle count
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      pulse: boolean;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1; // Slightly larger particles
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        
        // More vibrant and varied colors with low opacity
        const hue = Math.floor(Math.random() * 60) + 220; // Blue-purple range
        this.color = `hsla(${hue}, 70%, 60%, ${Math.random() * 0.2 + 0.1})`;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() > 0.5;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
        
        // Pulse effect
        if (this.pulse) {
          this.opacity += Math.sin(Date.now() * 0.001) * 0.01;
          this.opacity = Math.max(0.1, Math.min(0.5, this.opacity));
        }
      }
      
      draw() {
        if (!ctx) return;
        
        // Create a gradient for each particle
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Create particles
    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    initParticles();
    
    // Connection lines between particles
    const connect = () => {
      if (!ctx) return;
      const maxDistance = 180; // Increased connection distance
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(147, 112, 219, ${opacity})`;
            ctx.lineWidth = (1 - distance / maxDistance) * 2;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Add some decorative elements
    const drawDecorativeElements = () => {
      if (!ctx) return;
      
      // Subtle grid pattern
      ctx.strokeStyle = 'rgba(147, 112, 219, 0.05)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 50;
      const time = Date.now() * 0.0005;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Floating circles that pulse
      const circleCount = 5;
      for (let i = 0; i < circleCount; i++) {
        const x = canvas.width * (i / circleCount) + Math.sin(time + i) * 50;
        const y = canvas.height / 2 + Math.cos(time * 0.8 + i) * 100;
        const size = 120 + Math.sin(time * 0.5 + i) * 40;
        const opacity = 0.03 + Math.sin(time + i) * 0.01;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgba(147, 112, 219, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(147, 112, 219, ${opacity / 2})`);
        gradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw decorative elements
      drawDecorativeElements();
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connect();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70"
    />
  );
};

export default AnimatedBackground;
