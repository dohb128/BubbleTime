import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// 배포된 완성본(dist) 폴더를 서비스합니다.
app.use(express.static(path.join(__dirname, 'dist')));

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const animals = [
  '두루미', '사자', '호랑이', '토끼', '고양이', '강아지', '펭귄', '판다', '여우', '곰',
  '다람쥐', '기린', '코끼리', '원숭이', '사슴', '늑대', '독수리', '올빼미', '고래', '거북이'
];

let userCount = 0;

io.on('connection', (socket) => {
  userCount++;
  const nickname = `익명의 ${animals[Math.floor(Math.random() * animals.length)]}`;
  socket.nickname = nickname;

  console.log(`${nickname} connected! (ID: ${socket.id}) - Total: ${userCount}`);

  // 자신에게 닉네임 전송 및 모두에게 사용자 수 업데이트
  socket.emit('init', { nickname, userCount });
  io.emit('userCountUpdate', userCount);

  socket.on('bubble', (bubbleData) => {
    // 텍스트가 있는 경우 닉네임을 포함해서 브로드캐스트
    const dataWithNickname = { ...bubbleData, sender: socket.nickname };
    socket.broadcast.emit('bubble', dataWithNickname);
  });

  socket.on('disconnect', () => {
    userCount--;
    console.log(`${socket.nickname} disconnected - Total: ${userCount}`);
    io.emit('userCountUpdate', userCount);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO Server listening on port ${PORT}`);
});
