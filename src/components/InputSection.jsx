import React, { useState } from 'react';
import { Wind } from 'lucide-react';

const InputSection = ({ onAddBubble }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddBubble(text);
    setText('');
  };

  return (
    <div className="relative z-50 flex flex-col items-center gap-4 w-full max-w-md mx-auto px-4 mt-[calc(100vh-200px)]">
      <p className="text-white/60 font-light tracking-wider text-sm sm:text-base animate-pulse text-center">
        당신의 고민을 적어주세요
      </p>
      <form onSubmit={handleSubmit} className="w-full relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="고민을 입력하고 비눗방울로 날려보세요..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-12 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-300 backdrop-blur-md"
        />
        <button 
          type="submit"
          disabled={!text.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white/50"
        >
          <Wind size={20} />
        </button>
      </form>
    </div>
  );
};

export default InputSection;
