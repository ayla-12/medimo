const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("봇 살아있음! ✅");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🌐 Keep-alive 서버 실행 중");
});
