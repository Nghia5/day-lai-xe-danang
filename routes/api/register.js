import express from 'express';
const router = express.Router();

// Route test tạm thời
router.get('/', (req, res) => {
    res.send('API Register (Đăng ký khóa học) đang hoạt động!');
});

export default router;