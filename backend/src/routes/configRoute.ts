import express from 'express';
import config from '../config/config.json';



const router = express.Router();

router.get('/config', (req, res) => {
  res.json(config);
});

export default router;
