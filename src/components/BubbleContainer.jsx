import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Bubble from './Bubble';

const BubbleContainer = ({ bubbles, onPop }) => {
  return (
    <div className="fixed inset-0 pointer-events-auto overflow-hidden">
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            id={bubble.id}
            text={bubble.text}
            x={bubble.x}
            y={bubble.y}
            size={bubble.size}
            duration={bubble.duration}
            sender={bubble.sender}
            onPop={onPop}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BubbleContainer;
