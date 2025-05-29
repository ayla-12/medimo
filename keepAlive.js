const express = require("express");
const app = express();

// 루트 요청에 OK 응답
app.get("/", (req, res) => {
  res.send("✅ 메디모 봇은 살아있어요!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Keep-alive 서버 실행 중 (포트: ${PORT})`);
});
