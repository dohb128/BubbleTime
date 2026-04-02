import React, { useState, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import BubbleContainer from './components/BubbleContainer';
import InputSection from './components/InputSection';

// Vite 프록시 서버를 통해 로컬 3001번 포트와 소켓 통신 연결
const socket = io();


function App() {
  const [bubbles, setBubbles] = useState([]);
  const [myNickname, setMyNickname] = useState('');
  const [userCount, setUserCount] = useState(0);


  // Auto clean up off-screen bubbles and WebSocket listener
  useEffect(() => {
    socket.on('init', (data) => {
      setMyNickname(data.nickname);
      setUserCount(data.userCount);
    });

    socket.on('userCountUpdate', (count) => {
      setUserCount(count);
    });

    socket.on('bubble', (bubbleData) => {
      // 다른 화면에서 날아온 비눗방울 추가
      setBubbles((prev) => [...prev, { ...bubbleData, id: `ext-${Date.now()}-${bubbleData.id}` }]);
    });

    const interval = setInterval(() => {
      setBubbles((prev) => 
        prev.filter(b => Date.now() - b.createdAt < b.duration * 1000)
      );
    }, 2000);
    return () => {
      clearInterval(interval);
      socket.off('init');
      socket.off('userCountUpdate');
      socket.off('bubble');
    };
  }, []);

  const handleAddBubble = useCallback((text) => {
    // Generate random X position between 10% and 90% of screen width
    const minX = window.innerWidth * 0.1;
    const maxX = window.innerWidth * 0.9;
    const randomX = Math.random() * (maxX - minX) + minX;
    
    // Size based on text length (between 120 and 250px)
    const sizeBase = Math.min(250, Math.max(120, text.length * 8 + 80));
    
    const newBubble = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      x: randomX,
      size: sizeBase,
      duration: Math.random() * 5 + 10, // 10-15 seconds flight time
      createdAt: Date.now()
    };

    setBubbles((prev) => [...prev, newBubble]);
    socket.emit('bubble', { ...newBubble, sender: myNickname });
  }, [myNickname]);

  const handlePop = useCallback((id) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
  }, []);

  // Handle empty clicks for nameless bubbles
  const handleBackgroundClick = (e) => {
    // Ignore clicks on input, buttons, or active form elements
    if (
      e.target.tagName.toLowerCase() === 'input' || 
      e.target.tagName.toLowerCase() === 'button' ||
      e.target.closest('form')
    ) {
      return;
    }
    
    const x = e.clientX;
    const size = Math.random() * 60 + 40; // 40-100px random empty bubble
    const newBubble = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: '',
      x: Math.max(0, Math.min(x - size / 2, window.innerWidth - size)),
      size,
      duration: Math.random() * 4 + 7, // 7-11 seconds
      createdAt: Date.now()
    };
    
    setBubbles((prev) => [...prev, newBubble]);
    socket.emit('bubble', newBubble);
  };

  const wandIntervalRef = useRef(null);

  const spawnWandBubbles = useCallback(() => {
    // 막대기를 중앙 하단으로 옮겼으므로 중앙(X)에서 퍼지도록 설정
    const startX = window.innerWidth / 2;

    const count = Math.floor(Math.random() * 3) + 2; // 한 틱당 2~4개 생성
    const newBubbles = Array.from({ length: count }).map(() => {
      const size = Math.random() * 50 + 30; // 30-80px 크기
      const randomX = Math.max(0, Math.min(startX - 100 + Math.random() * 200, window.innerWidth - size));
      
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: '',
        x: randomX,
        size,
        duration: Math.random() * 4 + 5, // 5-9초
        createdAt: Date.now()
      };
    });

    setBubbles((prev) => [...prev, ...newBubbles]);
    newBubbles.forEach(b => socket.emit('bubble', b));
  }, []);

  const handleWandPressStart = useCallback((e) => {
    e.stopPropagation();
    spawnWandBubbles(); // 누르는 즉시 생성
    if (!wandIntervalRef.current) {
      wandIntervalRef.current = setInterval(spawnWandBubbles, 200); // 0.2초마다 뿜어져 나옴
    }
  }, [spawnWandBubbles]);

  const handleWandPressEnd = useCallback((e) => {
    if (e) e.stopPropagation();
    if (wandIntervalRef.current) {
      clearInterval(wandIntervalRef.current);
      wandIntervalRef.current = null;
    }
  }, []);

  return (
    <div 
      className="min-h-screen w-full bg-[#1a1a1a] relative overflow-hidden flex flex-col font-sans"
      onClick={handleBackgroundClick}
    >
      <BubbleContainer bubbles={bubbles} onPop={handlePop} />
      
      {/* 사용자 정보 배지 */}
      <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white/80 text-sm font-medium shadow-lg">
          실시간 접속: <span className="text-cyan-400">{userCount}</span>명
        </div>
        {myNickname && (
          <div className="bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 text-white/50 text-xs tracking-tight">
            당신은 <span className="text-white/80 font-semibold">{myNickname}</span> 입니다
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end pb-24 z-20 pointer-events-none">

        <div className="pointer-events-auto w-full">
          <InputSection onAddBubble={handleAddBubble} />
        </div>
      </div>

      <img
        src="/wand.png"
        alt="Bubble Wand"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] lg:w-[640px] max-h-[90vh] object-contain cursor-pointer transition-transform duration-300 origin-bottom z-0 touch-none hover:scale-105 active:scale-95"
        onPointerDown={handleWandPressStart}
        onPointerUp={handleWandPressEnd}
        onPointerLeave={handleWandPressEnd}
        onPointerCancel={handleWandPressEnd}
        title="꾹 누르고 있으면 비눗방울이 계속 나옵니다!"
      />
    </div>
  );
}

export default App;
