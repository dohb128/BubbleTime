import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Bubble = ({ id, text, x, y, size, duration, sender, onPop }) => {
  const startY = y ?? window.innerHeight;
  
  return (
    <motion.div
      initial={{ y: startY, x, scale: 0 }}
      animate={{ y: -size, x: [x, x + 30, x - 30, x], scale: 1 }}
      exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
      transition={{
        y: { duration: duration, ease: "linear" },
        x: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.5, ease: "easeOut" },
        exit: { duration: 0.3 }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPop(id);
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onPop(id);
      }}
      className="absolute rounded-full cursor-pointer flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20 backdrop-blur-[4px] overflow-hidden group"
      style={{
        width: size,
        height: size,
        left: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.3) 100%)',
        boxShadow: 'inset 0 0 15px rgba(255,255,255,0.3), inset 10px 0 30px rgba(238,130,238,0.3), inset -10px 0 30px rgba(0,255,255,0.3), 0 0 10px rgba(255,255,255,0.2)'
      }}
    >
      {text && (
        <div className="flex flex-col items-center justify-center pointer-events-none z-10 px-4">
          <span className="text-white/90 text-center font-medium break-words drop-shadow-md text-sm sm:text-base selection:bg-transparent">
            {text}
          </span>
          {sender && (
            <span className="text-white/40 text-[10px] mt-1 font-light italic">
              from. {sender}
            </span>
          )}
        </div>
      )}
      {/* Glossy reflection */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[20%] bg-white/40 rounded-[50%] rotate-[-45deg] blur-[2px] pointer-events-none" />
    </motion.div>
  );
};

export default Bubble;
