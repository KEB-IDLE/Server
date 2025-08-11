// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err); // 에러 로그 남기기

  const statusCode = err.status || 500;
  const message = err.message || '서버 에러가 발생했습니다.';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
