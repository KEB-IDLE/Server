const matchService = require('../services/matchService');

exports.joinQueue = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    await matchService.joinQueue(userId);
    res.json({ success: true, message: 'Joined queue' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.checkMatchStatus = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const matchData = await matchService.checkMatchStatus(userId);
    if (matchData) {
      res.json({ matched: true, opponentId: matchData.opponent, roomId: matchData.roomId });
    } else {
      res.json({ matched: false });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.startGame = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    // Additional logic can be added here
    res.json({ success: true, message: 'Game started' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.endGame = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    await matchService.clearMatch(userId);
    res.json({ success: true, message: 'Game ended' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
