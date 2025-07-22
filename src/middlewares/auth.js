const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: '토큰 없음' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '토큰 유효하지 않음' });

    req.user = user;  // 디코딩된 사용자 정보 저장
    next();
  });
}

module.exports = authenticateToken;
