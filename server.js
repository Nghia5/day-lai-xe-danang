import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs/promises';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Đường dẫn cố định tới file data.json
const DATA_FILE_PATH = path.join(__dirname, 'data.json');

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security 
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', credentials: true }));

// Compression
app.use(compression());

// Logging
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'src/assets/styles')));
app.use('/js', express.static(path.join(__dirname, 'src/js')));

// ============================================
// ROUTES
// ============================================

// Landing page
app.get('/', (req, res) => {
    res.render('index.ejs', {
        title: 'Trung Tâm Dạy Bằng Lái Xe - Đà Nẵng',
        description: 'Đơn vị đào tạo lái xe chuyên nghiệp tại Đà Nẵng'
    });
});

// Route hiển thị trang Chi tiết khóa học
app.get('/khoa-hoc/:id', (req, res) => {
    const courseId = req.params.id;
    
    const courseData = {
        'a': { 
            title: 'THI BẰNG LÁI XE MÁY HẠNG A', 
            price: '1.700.000đ',           // Giá mồi nổi bật ở đầu trang
            totalPrice: '2.195.000đ',      // Tổng chi phí thực tế cuối bảng
            duration: '2 - 3 Tuần', 
            desc: 'Học phí đào tạo cốt lõi chỉ 1.700.000đ, các khoản còn lại là lệ phí thu hộ nộp cho cơ quan nhà nước. Tổng chi phí trọn gói (khi chưa có bằng ô tô) là 2.195.000đ.',
            image: '/images/courses/chi-phi-hang-a.jpg',
            training: [
                '<b>Lý thuyết:</b> Học bộ câu hỏi luật giao thông đường bộ dành riêng cho xe mô tô hạng A.',
                '<b>Thực hành:</b> Làm quen xe nặng, tập chạy sa hình vòng số 8 bằng xe phân khối lớn (Rebel 250, CB300R...).',
                '<b>Thi thử:</b> Hướng dẫn kỹ năng giữ thăng bằng, chống chân và thi thử sa hình trực tiếp tại sân sát hạch.'
            ],
            pricing: [
                { name: '[PHẦN I] HỌC PHÍ + HỒ SƠ + TÀI LIỆU + KHÁM SỨC KHỎE', cost: '1.950.000đ' },
                { name: '1. Học phí', cost: '1.700.000đ' },
                { name: '2. Hồ sơ lái xe + Tài liệu + Khám sức khoẻ', cost: '250.000đ' },
                { name: '[PHẦN II] THU HỘ LỆ PHÍ THI & CẤP BẰNG CHO CÔNG AN', cost: '245.000đ' },
                { name: '1. Phí sát hạch lý thuyết', cost: '60.000đ' },
                { name: '2. Phí sát hạch thực hành', cost: '70.000đ' },
                { name: '3. Lệ phí cấp giấy phép lái xe', cost: '115.000đ' }
            ],
            specialOffer: 'ĐÃ CÓ BẰNG Ô TÔ: Miễn thi lý thuyết, GIẢM TRỰC TIẾP 270.000đ. Tổng chi phí trọn gói chỉ còn 1.925.000đ'
        },
        'a1': { 
            title: 'THI BẰNG LÁI XE MÁY HẠNG A1', 
            price: '500.000đ',            // Giá mồi nổi bật ở đầu trang
            totalPrice: '995.000đ',       // Tổng chi phí thực tế cuối bảng
            duration: '1 Tuần', 
            desc: 'Học phí đào tạo cốt lõi chỉ 500.000đ, các khoản còn lại là lệ phí thu hộ nộp cho cơ quan nhà nước. Tổng chi phí trọn gói (khi chưa có bằng ô tô) là 995.000đ.',
            image: '/images/courses/chi-phi-hang-a1.jpg',
            training: [
                '<b>Lý thuyết:</b> Học luật giao thông đường bộ dành cho xe máy, nhận diện biển báo cơ bản.',
                '<b>Thực hành:</b> Tập chạy sa hình vòng số 8, đường thẳng, đường quanh co và đường nhấp nhô.',
                '<b>Thi thử:</b> Hướng dẫn mẹo thi và thi thử sa hình trực tiếp tại sân sát hạch.'
            ],
            pricing: [
                { name: '[PHẦN I] HỌC PHÍ + HỒ SƠ + TÀI LIỆU + KHÁM SỨC KHỎE', cost: '750.000đ' },
                { name: '1. Học phí', cost: '500.000đ' },
                { name: '2. Hồ sơ lái xe + Tài liệu + Khám sức khoẻ', cost: '250.000đ' },
                { name: '[PHẦN II] THU HỘ LỆ PHÍ THI & CẤP BẰNG CHO CÔNG AN', cost: '245.000đ' },
                { name: '1. Phí sát hạch lý thuyết', cost: '60.000đ' },
                { name: '2. Phí sát hạch thực hành', cost: '70.000đ' },
                { name: '3. Lệ phí cấp giấy phép lái xe', cost: '115.000đ' }
            ],
            specialOffer: 'ĐÃ CÓ BẰNG Ô TÔ: Miễn thi lý thuyết, GIẢM TRỰC TIẾP 270.000đ. Tổng chi phí trọn gói chỉ còn 725.000đ'
        },
        'b1b2': { 
            title: 'BẰNG LÁI Ô TÔ HẠNG B1/B2', 
            price: 'LIÊN HỆ', 
            totalPrice: 'LIÊN HỆ QUA ZALO 0789852555',
            duration: '3.5 - 4 Tháng', 
            desc: 'Đào tạo lái xe ô tô số tự động và số sàn, xe chở người đến 9 chỗ ngồi.',
            image: '/images/courses/course-b1b2.jpg', 
            training: [
                '<b>Lý thuyết:</b> Học 600 câu hỏi luật GTĐB và thực hành mô phỏng 120 tình huống nguy hiểm.',
                '<b>Thực hành:</b> Kèm 1-1 lái xe sa hình 11 bài liên hoàn, chạy DAT đủ 810km đường trường thực tế.',
                '<b>Thi thử:</b> Thi thử lý thuyết trên máy tính và chạy xe gắn thiết bị chấm điểm tự động (xe chip).'
            ],
            pricing: [], 
            specialOffer: null
        }
    };

    const course = courseData[courseId];

    if (!course) {
        return res.status(404).render('404.ejs', { title: 'Không Tìm Thấy Khóa Học' });
    }

    res.render('course-detail.ejs', {
        title: course.title + ' - Trung Tâm Dạy Bằng Lái Xe - Đà Nẵng',
        course: course
    });
});

// ROUTE QUẢN TRỊ NỘI BỘ (ĐỌC DATA.JSON)
app.get('/admin/danh-sach', async (req, res) => {
    try {
        let listContacts = [];
        try {
            const fileData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
            listContacts = JSON.parse(fileData);
        } catch (readError) {
            if (readError.code !== 'ENOENT') {
                console.error('Lỗi đọc dữ liệu quản trị:', readError);
            }
        }
        res.render('admin-dashboard.ejs', {
            title: 'Hệ Thống Quản Lý Học Viên - STC Đà Nẵng',
            contacts: listContacts.reverse()
        });
    } catch (error) {
        console.error('Lỗi tải trang quản trị:', error);
        res.status(500).send('Lỗi máy chủ nội bộ không thể tải dữ liệu.');
    }
});

// ============================================
// API ROUTES
// ============================================

app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, course } = req.body;
        
        // 1. Lưu file JSON
        let listContacts = [];
        try {
            const fileData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
            listContacts = JSON.parse(fileData);
        } catch (readError) {
            if (readError.code !== 'ENOENT') {
                console.error('Lỗi khi đọc file JSON:', readError);
            }
        }

        const newReg = {
            name,
            phone,
            course,
            createdAt: new Date().toLocaleString('vi-VN')
        };
        
        listContacts.push(newReg);
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(listContacts, null, 2), 'utf-8');
        console.log(`\n[HỌC VIÊN MỚI] Tên: ${name} | SĐT: ${phone} | Khóa: ${course}`);

        // 2. Gửi thông báo qua Telegram
        const TELEGRAM_BOT_TOKEN = '8679907890:AAEjRZaL83ln9xBAFNQJSjgN-n3kvZ8pSOk';
        const TELEGRAM_CHAT_ID = '5944322082'; // <--- NHỚ THAY SỐ ID VÀO ĐÂY NHÉ

        const message = `
🚨 <b>CÓ HỌC VIÊN MỚI ĐĂNG KÝ!</b> 🚨
-----------------------------------
👤 <b>Họ tên:</b> ${name}
📞 <b>SĐT:</b> ${phone}
🏍️ <b>Khóa:</b> ${course}
🕒 <b>Lúc:</b> ${new Date().toLocaleString('vi-VN')}
-----------------------------------
👉 <a href="tel:${phone}">Bấm để gọi ngay</a>
        `;

        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        } catch (telegramError) {
            console.error('Lỗi gửi Telegram:', telegramError);
        }

        res.status(200).json({ 
            success: true, 
            message: 'Đã nhận và lưu dữ liệu thành công!' 
        });
    } catch (error) {
        console.error('Lỗi xử lý API Contact:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: NODE_ENV 
    });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
    res.status(404).render('404.ejs', {
        title: 'Không Tìm Thấy'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Lỗi máy chủ nội bộ';
    res.status(status).json({
        error: {
            status,
            message,
            ...(NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   DRIVING SCHOOL LANDING PAGE          ║
║   Server running on http://localhost:${PORT}    ║
║   Environment: ${NODE_ENV.toUpperCase()}              ║
╚════════════════════════════════════════╝
    `);
});

export default app;