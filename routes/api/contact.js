import express from 'express';
const router = express.Router();

// Xử lý khi có yêu cầu POST từ Form Liên hệ
router.post('/', (req, res) => {
    // Lấy thông tin khách hàng nhập vào từ form
    const { name, phone, course } = req.body;

    // Ở bước này, sau này bạn có thể thêm code để lưu vào Database hoặc gửi Email
    console.log(`[Khách hàng mới] Tên: ${name} | SĐT: ${phone} | Khóa: ${course}`);

    // Gửi phản hồi thành công về cho Frontend
    res.status(200).json({ 
        success: true, 
        message: 'Gửi thông tin thành công!' 
    });
});

export default router;