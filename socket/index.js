const WebSocket = require('ws');

const PORT = 8080; // 원하는 포트로 설정

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('클라이언트 접속');

  ws.on('message', (message) => {
    console.log(`받은 메시지: ${message}`);

    // 받은 메시지를 그대로 클라이언트에게 다시 보내기 (에코)
    ws.send(`서버에서 응답: ${message}`);
  });

  ws.on('close', () => {
    console.log('클라이언트 연결 종료');
  });

  ws.send('서버에 연결되었습니다!');
});

console.log(`웹소켓 서버가 포트 ${PORT}에서 실행 중입니다.`);
