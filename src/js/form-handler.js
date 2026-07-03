document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            // 1. Ngăn chặn hành vi load lại trang và đưa dữ liệu lên URL
            e.preventDefault(); 

            // 2. Lấy dữ liệu người dùng đã nhập
            const nameInput = contactForm.querySelector('input[name="name"]');
            const phoneInput = contactForm.querySelector('input[name="phone"]');
            const courseSelect = contactForm.querySelector('select[name="course"]');

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const course = courseSelect.value;

            // --- BƯỚC NÂNG CẤP: KIỂM TRA TÍNH HỢP LỆ (VALIDATION) ---
            // Kiểm tra định dạng số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(phone)) {
                alert('⚠️ Vui lòng nhập đúng số điện thoại (10 số) để trung tâm có thể liên hệ nhé!');
                phoneInput.focus();
                return; // Dừng lại, không gửi đi
            }

            if (!course) {
                alert('⚠️ Bạn quên chọn khóa học quan tâm rồi kìa!');
                courseSelect.focus();
                return;
            }
            // --------------------------------------------------------

            const data = { name, phone, course };

            // 3. Đổi chữ trên nút thành "Đang gửi..." để báo hiệu cho người dùng
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';
            submitBtn.disabled = true;

            try {
                // 4. Gửi dữ liệu xuống Backend (API) một cách ngầm định
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                // 5. Xử lý khi gửi thành công
                if (result.success) {
                    alert('🎉 TUYỆT VỜI!\nThông tin của bạn đã được gửi thành công. Trung tâm sẽ liên hệ qua Zalo hoặc SĐT với bạn trong thời gian sớm nhất nhé!');
                    contactForm.reset(); // Xóa trắng các ô nhập liệu
                } else {
                    alert('⚠️ Có lỗi xảy ra: ' + (result.message || 'Vui lòng thử lại sau.'));
                }
            } catch (error) {
                console.error('Lỗi:', error);
                alert('🔌 Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp Hotline/Zalo: 0789.852.555');
            } finally {
                // 6. Trả lại trạng thái ban đầu cho nút bấm
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    } 
});