import express from 'express';
import SiteStats from '../models/SiteStats.js';

const router = express.Router();

router.get('/visits', async (req, res, next) => {
  try {
    const stats = await SiteStats.findOne({ key: 'main' }).lean();
    res.json({ totalVisits: stats?.totalVisits ?? 0 });
  } catch (error) {
    next(error);
  }
});

router.post('/visits', async (req, res, next) => {
  try {
    const stats = await SiteStats.findOneAndUpdate(
      { key: 'main' },
      { $inc: { totalVisits: 1 }, $setOnInsert: { key: 'main' } },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    ).lean();
    res.json({ totalVisits: stats.totalVisits });
  } catch (error) {
    next(error);
  }
});

export default router;
