// این کد پس از بارگذاری کامل DOM اجرا می‌شود
document.addEventListener('DOMContentLoaded', function() {
    // فراخوانی تابع برای دریافت اطلاعات بخش "درباره ما"
    fetchAboutData();

    // تابع async برای دریافت داده‌های بخش "درباره ما" از سرور
    async function fetchAboutData() {
        try {
            // ارسال درخواست fetch به آدرس API مربوطه
            const response = await fetch('./apis/aboutusapi.php');
            // تبدیل پاسخ به فرمت JSON
            const data = await response.json();

            // بررسی وضعیت پاسخ دریافتی از سرور
            if (data.status === 'success') {
                // در صورت موفقیت‌آمیز بودن، بخش "درباره ما" را به‌روز می‌کند
                updateAboutSection(data.data);
            } else {
                // در صورت خطا، پیام خطا را در کنسول نمایش می‌دهد
                console.error('Error:', data.message);
                // نمایش پیام خطا به کاربر
                showAlert('error', 'خطا در دریافت اطلاعات درباره ما');
            }
        } catch (error) {
            // مدیریت خطاهای مربوط به fetch
            console.error('Fetch Error:', error);
            // نمایش پیام خطای ارتباط با سرور به کاربر
            showAlert('error', 'خطا در ارتباط با سرور');
        }
    }

    // تابع برای به‌روزرسانی بخش "درباره ما" در صفحه
    function updateAboutSection(data) {
        // به‌روزرسانی متن درباره ما
        const aboutText = document.querySelector('.about-text p');
        if (aboutText && data.description) {
            aboutText.textContent = data.description;
        }

        // به‌روزرسانی آمار و ارقام
        const statsItems = document.querySelectorAll('.stats-item');
        // بررسی وجود 4 آیتم آماری
        if (statsItems.length >= 4) {
            // به‌روزرسانی سال سابقه کار
            statsItems[0].querySelector('.stats-number').textContent = `${data.work_experience}+`;
            // به‌روزرسانی تعداد پروژه‌های تکمیل شده
            statsItems[1].querySelector('.stats-number').textContent = data.completed_projects;
            // به‌روزرسانی تعداد مشتریان راضی
            statsItems[2].querySelector('.stats-number').textContent = data.happy_clients;
            // به‌روزرسانی تعداد مقالات منتشر شده
            statsItems[3].querySelector('.stats-number').textContent = data.published_articles;
        }
    }

    // تابع برای نمایش پیام‌های اطلاع‌رسانی یا خطا به کاربر
    function showAlert(type, message) {
        // پیاده‌سازی مشابه بخش تماس با ما
        
        // ایجاد عنصر div برای پیام
        const alertDiv = document.createElement('div');
        // اضافه کردن کلاس‌های مربوطه بر اساس نوع پیام (موفقیت/خطا)
        alertDiv.className = `custom-alert ${type}`;
        // ساختار HTML پیام
        alertDiv.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">${type === 'success' ? '✓' : '✗'}</span>
                <span class="alert-message">${message}</span>
                <button class="alert-close">&times;</button>
            </div>
        `;
        // اضافه کردن پیام به بدنه سند
        document.body.appendChild(alertDiv);
        
        // تنظیم زمانبندی برای محو شدن خودکار پیام پس از 5 ثانیه
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
        
        // افزودن رویداد کلیک برای دکمه بستن پیام
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.remove();
        });
    }
});