import express from 'express';

const router = express.Router();

router.get('/config', (req, res) => {
  res.json({
    apiUrl: process.env.API_URL || 'not-set',
    frontendDomain: process.env.FRONTEND_DOMAIN || 'not-set'
  });
});

export default router;
