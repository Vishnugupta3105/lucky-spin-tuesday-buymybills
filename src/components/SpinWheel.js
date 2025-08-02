import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Lock } from 'lucide-react';
import './SpinWheel.css';

const SpinWheel = ({ onSpinResult, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTuesday, setIsTuesday] = useState(false);
  const [timeUntilTuesday, setTimeUntilTuesday] = useState('');
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
    checkIfTuesday();
    checkIfAlreadySpun();
    const timer = setInterval(checkIfTuesday, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  const checkIfTuesday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 2 = Tuesday
    const isTodayTuesday = dayOfWeek === 2;
    setIsTuesday(isTodayTuesday);

    if (!isTodayTuesday) {
      calculateTimeUntilTuesday();
    }
  };

  const checkIfAlreadySpun = () => {
    const today = new Date().toDateString();
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const hasSpun = lastSpinDate === today;
    setHasSpunToday(hasSpun);
  };

  const calculateTimeUntilTuesday = () => {
    const now = new Date();
    const daysUntilTuesday = (2 - now.getDay() + 7) % 7;
    
    if (daysUntilTuesday === 0) {
      // It's Tuesday, but check if it's past midnight
      const hoursUntilMidnight = 24 - now.getHours();
      if (hoursUntilMidnight > 0) {
        setTimeUntilTuesday(`${hoursUntilMidnight} hours left`);
      } else {
        setTimeUntilTuesday('Today is Tuesday!');
      }
    } else {
      setTimeUntilTuesday(`${daysUntilTuesday} days left`);
    }
  };

  useEffect(() => {
    drawWheel();
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;

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
    if (isSpinning || isAnimating || !isTuesday || hasSpunToday) return;

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

  if (!isTuesday) {
    return (
      <div className="spin-wheel-container">
        <div className="tuesday-restriction">
          <motion.div
            className="restriction-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock size={48} color="#1e3a8a" />
          </motion.div>
          <h3 className="restriction-title">Spin Only on Tuesday!</h3>
          <p className="restriction-text">{timeUntilTuesday}</p>
          <div className="restriction-info">
            <p>🎯 Come back on Tuesday to spin and win rewards!</p>
            <p>⏰ One spin per Tuesday only</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasSpunToday) {
    return (
      <div className="spin-wheel-container">
        <div className="tuesday-restriction">
          <motion.div
            className="restriction-icon"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Lock size={48} color="#1e3a8a" />
          </motion.div>
          <h3 className="restriction-title">Already Spun Today!</h3>
          <p className="restriction-text">Come back next Tuesday!</p>
          <div className="restriction-info">
            <p>🎯 You've already used your Tuesday spin!</p>
            <p>⏰ One spin per Tuesday only</p>
            <p>📅 Next spin available: Next Tuesday</p>
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