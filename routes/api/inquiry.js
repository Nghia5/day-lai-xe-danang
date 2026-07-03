import express from 'express';
const router = express.Router();

// Route test tạm thời
router.get('/', (req, res) => {
    res.send('API Inquiry (Giải đáp thắc mắc) đang hoạt động!');
});

export default router;