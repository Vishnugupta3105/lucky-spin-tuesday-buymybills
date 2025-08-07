import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Lock } from 'lucide-react';
import './SpinWheel.css';

const SpinWheel = ({ onSpinResult, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isThursday, setIsThursday] = useState(false);
  const [timeUntilThursday, setTimeUntilThursday] = useState('');
  const [hasSpunToday, setHasSpunToday] = useState(false);

  const segments = [
    { text: "50% cashback", color: "#1F2937", bgColor: "#FFE5E5" },
    { text: "Rs 100 cashback", color: "#1F2937", bgColor: "#E0F7FA" },
    { text: "10% cashback", color: "#1F2937", bgColor: "#E3F2FD" },
    { text: "Oops! Next time", color: "#1F2937", bgColor: "#E8F5E8" },
    { text: "Rs 300 cashback", color: "#1F2937", bgColor: "#FFF8E1" },
    { text: "Buy 2 get 1 free", color: "#1F2937", bgColor: "#F3E5F5" }
  ];

  useEffect(() => {
    checkIfThursday();
    checkIfAlreadySpun();
    const timer = setInterval(checkIfThursday, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  const checkIfThursday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 4 = Thursday
    const isTodayThursday = dayOfWeek === 4;
    setIsThursday(isTodayThursday);

    if (!isTodayThursday) {
      calculateTimeUntilThursday();
    }
  };

  const checkIfAlreadySpun = () => {
    const today = new Date().toDateString();
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const hasSpun = lastSpinDate === today;
    setHasSpunToday(hasSpun);
  };

  const calculateTimeUntilThursday = () => {
    const now = new Date();
    const daysUntilThursday = (4 - now.getDay() + 7) % 7;
    
    if (daysUntilThursday === 0) {
      // It's Thursday, but check if it's past midnight
      const hoursUntilMidnight = 24 - now.getHours();
      if (hoursUntilMidnight > 0) {
        setTimeUntilThursday(`${hoursUntilMidnight} hours left`);
      } else {
        setTimeUntilThursday('Today is Thursday!');
      }
    } else {
      setTimeUntilThursday(`${daysUntilThursday} days left`);
    }
  };

  useEffect(() => {
    // Ensure canvas is properly sized and drawn
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas size to match CSS size
      canvas.width = 320;
      canvas.height = 320;
      drawWheel();
    } else {
      // Retry after a short delay
      setTimeout(() => {
        const retryCanvas = canvasRef.current;
        if (retryCanvas) {
          retryCanvas.width = 320;
          retryCanvas.height = 320;
          drawWheel();
        }
      }, 100);
    }
  }, []);

  // Additional useEffect to ensure wheel is drawn when component is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas && canvas.width > 0) {
        drawWheel();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    // Clear the canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segmentAngle = (2 * Math.PI) / segments.length;

    segments.forEach((segment, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.bgColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text with better visibility
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      
      // Set text properties for maximum visibility
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = segment.color;
      ctx.font = 'bold 12px Inter';
      
      // Add strong text shadow for better visibility
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Position text closer to center
      const textRadius = radius * 0.6;
      ctx.fillText(segment.text, textRadius, 0);
      
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const spinWheel = async () => {
    if (isSpinning || isAnimating || !isThursday || hasSpunToday) return;

    setIsSpinning(true);
    setIsAnimating(true);

    try {
      // Simulate API call with weighted probabilities
      const results = [
        { text: "50% cashback", probability: 0.05 },
        { text: "Rs 100 cashback", probability: 0.25 },
        { text: "10% cashback", probability: 0.15 },
        { text: "Oops! Next time", probability: 0.30 },
        { text: "Rs 300 cashback", probability: 0.15 },
        { text: "Buy 2 get 1 free", probability: 0.10 }
      ];

      const random = Math.random();
      let cumulativeProbability = 0;
      let selectedResult = results[0];

      for (const result of results) {
        cumulativeProbability += result.probability;
        if (random <= cumulativeProbability) {
          selectedResult = result;
          break;
        }
      }

      // Find the segment index for the result
      const resultIndex = segments.findIndex(segment => 
        segment.text === selectedResult.text
      );

      if (resultIndex !== -1) {
        const segmentAngle = 360 / segments.length;
        // Calculate the exact center of the winning segment
        const targetAngle = resultIndex * segmentAngle + segmentAngle / 2;
        // Add extra rotations and ensure pointer points to the center of the segment
        const spinAngle = 360 * 8 + targetAngle;

        // Animate the spin
        animateSpin(spinAngle, () => {
          setTimeout(() => {
            // Save the spin date to localStorage
            localStorage.setItem('lastSpinDate', new Date().toDateString());
            setHasSpunToday(true);
            onSpinResult(selectedResult);
            setIsSpinning(false);
            setIsAnimating(false);
          }, 500);
        });
      }
    } catch (error) {
      console.error('Error spinning:', error);
      setIsSpinning(false);
      setIsAnimating(false);
    }
  };

  const animateSpin = (targetRotation, callback) => {
    const startRotation = currentRotation;
    const startTime = performance.now();
    const duration = 2000; // Reduced from 3000 to 2000ms for faster spin

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      const newRotation = startRotation + (targetRotation - startRotation) * easeOut;
      setCurrentRotation(newRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };

    requestAnimationFrame(animate);
  };

  if (!isThursday) {
    return (
      <div className="spin-wheel-container">
        <div className="thursday-restriction">
          <motion.div
            className="restriction-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock size={48} color="#1e3a8a" />
          </motion.div>
          <h3 className="restriction-title">Spin Only on Thursday!</h3>
          <p className="restriction-text">{timeUntilThursday}</p>
          <div className="restriction-info">
            <p>🎯 Come back on Thursday to spin and win rewards!</p>
            <p>⏰ One spin per Thursday only</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasSpunToday) {
    return (
      <div className="spin-wheel-container">
        <div className="thursday-restriction">
          <motion.div
            className="restriction-icon"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Lock size={48} color="#1e3a8a" />
          </motion.div>
          <h3 className="restriction-title">Already Spun Today!</h3>
          <p className="restriction-text">Come back next Thursday!</p>
          <div className="restriction-info">
            <p>🎯 You've already used your Thursday spin!</p>
            <p>⏰ One spin per Thursday only</p>
            <p>📅 Next spin available: Next Thursday</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="spin-wheel-container">
      <div className="wheel-wrapper">
        <motion.canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="wheel-canvas"
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: isAnimating ? 'none' : 'transform 0.3s ease'
          }}
        />
        
        <motion.div
          className="spin-button"
          onClick={spinWheel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSpinning || isAnimating}
        >
          <Play size={24} color="#ffffff" />
        </motion.div>

        <motion.div 
          className="pointer"
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        />
      </div>

      <motion.div
        className="spin-instruction"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Tap to spin! (One time only)</p>
      </motion.div>
    </div>
  );
};

export default SpinWheel; 