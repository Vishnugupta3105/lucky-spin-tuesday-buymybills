import React, { useState } from 'react';
import './App.css';
import SpinWheel from './components/SpinWheel';
import ResultModal from './components/ResultModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Star, Calendar } from 'lucide-react';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinResult = (spinResult) => {
    setResult(spinResult);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
  };

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const isThursday = new Date().getDay() === 4;

  return (
    <div className="app">
      <div className="app-background">
        <div className="floating-shapes">
          <motion.div
            className="shape shape-1"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="shape shape-2"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="shape shape-3"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      <div className="container">
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="title-container">
            <motion.div
              className="sparkle-icon"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={24} color="#60a5fa" />
            </motion.div>
            <h1 className="title">Lucky Spin Thursday</h1>
            <motion.div
              className="sparkle-icon"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={24} color="#60a5fa" />
            </motion.div>
          </div>
          <p className="subtitle">BuyMyBills</p>
          
          <motion.div
            className="current-day"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Calendar size={16} color="#60a5fa" />
            <span>Today is {getCurrentDay()}</span>
            {isThursday && (
              <motion.span
                className="thursday-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                🎉 Spin Day!
              </motion.span>
            )}
          </motion.div>
        </motion.header>

        <motion.div 
          className="spin-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="spin-text-container">
            <Gift className="gift-icon" size={20} />
            <p className="spin-text">
              {isThursday 
                ? "Spin me and get your BMB reward!" 
                : "Spin available only on Thursday!"
              }
            </p>
            <Star className="star-icon" size={20} />
          </div>
          
          <SpinWheel 
            onSpinResult={handleSpinResult}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </motion.div>

        <motion.div 
          className="footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="footer-text">
            {isThursday ? "🎉 Try your luck today! 🎉" : "⏰ Come back on Thursday!"}
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ResultModal 
            result={result} 
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
