const express = require('express');
const router = express.Router();

// 라우터 불러오기
const authRoutes = require('./auth.routes');
const matchRoutes = require('./match.routes');
const rankingRoutes = require('./ranking.routes');
const userRoutes = require('./user.routes');

// 경로에 등록
router.use('/auth', authRoutes);         // /api/auth/*
router.use('/match', matchRoutes);       // /api/match/*
router.use('/ranking', rankingRoutes);   // /api/ranking/*
router.use('/user', userRoutes);         // /api/user/*

module.exports = router;