const express = require('express');
const router = express.Router();

// 라우터 불러오기
const authRoutes = require('./auth/auth');
const globalRankingRoutes = require('./ranking/ranking');
const userIconRoutes = require('./user/icons');
const userProfileRoutes = require('./user/profile');
const userRecordRoutes = require('./user/record');

// 경로에 등록
router.use('/auth', authRoutes);                 // /api/auth/*
router.use('/ranking', globalRankingRoutes); // /api/ranking/global/*
router.use('/user/icons', userIconRoutes);        // /api/user/icon/*
router.use('/user/profile', userProfileRoutes);  // /api/user/profile/*
router.use('/user/record', userRecordRoutes);    // /api/user/record/*

module.exports = router;
