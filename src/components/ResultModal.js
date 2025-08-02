import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Star, Zap, Heart } from 'lucide-react';
import './ResultModal.css';

const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const getResultIcon = (text) => {
    if (text.includes('cashback')) return <Gift size={32} />;
    if (text.includes('free')) return <Star size={32} />;
    if (text.includes('Oops')) return <Heart size={32} />;
    return <Zap size={32} />;
  };

  const getResultColor = (text) => {
    if (text.includes('cashback') || text.includes('free')) {
      return '#10B981'; // Green for good results
    } else if (text.includes('Oops')) {
      return '#EF4444'; // Red for "next time"
    }
    return '#667eea'; // Blue for neutral
  };

  const getResultEmoji = (text) => {
    if (text.includes('50%')) return '🎉';
    if (text.includes('Rs 300')) return '🎊';
    if (text.includes('Rs 100')) return '🎁';
    if (text.includes('10%')) return '💎';
    if (text.includes('free')) return '⭐';
    if (text.includes('Oops')) return '💔';
    return '🎯';
  };

  const isGoodResult = result.text.includes('cashback') || result.text.includes('free');

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 50 
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 50 
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="close-button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>

          <div className="modal-header">
            <motion.div
              className="result-emoji"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {getResultEmoji(result.text)}
            </motion.div>
            
            <motion.h2
              className="modal-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isGoodResult ? 'Congratulations!' : 'Better luck next time!'}
            </motion.h2>
          </div>

          <motion.div
            className="modal-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="result-icon" style={{ color: getResultColor(result.text) }}>
              {getResultIcon(result.text)}
            </div>
            
            <motion.div
              className="result-text"
              style={{ color: getResultColor(result.text) }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {result.text}
            </motion.div>

            <motion.p
              className="result-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isGoodResult 
                ? "Your reward has been added to your account!"
                : "Don't worry, you can try again next time!"
              }
            </motion.p>
          </motion.div>

          <motion.div
            className="modal-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              className="close-modal-btn"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGoodResult ? 'Claim Reward' : 'Try Again'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultModal; 