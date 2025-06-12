/**
 * =============================================
 *               interactive-effects.js
 * =============================================
 * مدیریت اثرات تعاملی صفحه شامل:
 * - افکت پارالاکس پس‌زمینه
 * - انیمیشن‌های کارت‌های اعضا
 * - سیستم فیلتر دسته‌بندی
 * - انیمیشن‌های دکمه بازگشت
 * - انیمیشن ذرات تعاملی
 */

document.addEventListener('DOMContentLoaded', function () {
    // ██████████████████████████████████████████████
    // █████████ افکت پارالاکس پس‌زمینه █████████
    // ██████████████████████████████████████████████
    
    /**
     * ایجاد افکت پارالاکس بر اساس حرکت موس
     * پس‌زمینه با حرکت موس جابجا می‌شود
     */
    const setupParallax = () => {
        document.body.addEventListener('mousemove', function (e) {
            // محاسبه موقعیت نسبی موس
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // اعمال جابجایی به پس‌زمینه
            document.body.style.backgroundPosition = `
                ${x * 20}px ${y * 20}px
            `;
        });
    };

    // ██████████████████████████████████████████████
    // █████ انیمیشن ظهور تدریجی کارت‌ها █████
    // ██████████████████████████████████████████████
    
    /**
     * تنظیم انیمیشن‌های ظهور کارت‌ها هنگام اسکرول
     * از IntersectionObserver برای تشخیص ظاهر شدن در viewport استفاده می‌کند
     */
    const setupCardAnimations = () => {
        const observerOptions = {
            threshold: 0.1 // 10% از عنصر باید قابل مشاهده باشد
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // اعمال انیمیشن ظهور
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                }
            });
        }, observerOptions);

        // تنظیم حالت اولیه و شروع مشاهده کارت‌ها
        document.querySelectorAll('.member-card').forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            card.style.transitionDelay = `${index * 0.1}s`; // تأخیر برای اثر آبشاری
            observer.observe(card);
        });
    };

    // ██████████████████████████████████████████████
    // ███████ سیستم فیلتر دسته‌بندی‌ها ███████
    // ██████████████████████████████████████████████
    
    /**
     * تنظیم سیستم فیلتر کارت‌ها بر اساس دسته‌بندی
     */
    const setupFilterButtons = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const memberCards = document.querySelectorAll('.member-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // به‌روزرسانی وضعیت فعال بودن دکمه‌ها
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                memberCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        // نمایش کارت با انیمیشن
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        // مخفی کردن کارت با انیمیشن
                        card.style.opacity = 0;
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // مطابق با مدت زمان انیمیشن
                    }
                });
            });
        });
    };

    // ██████████████████████████████████████████████
    // ███████ انیمیشن‌های دکمه بازگشت ███████
    // ██████████████████████████████████████████████
    
    /**
     * تنظیم انیمیشن‌های تعاملی برای دکمه بازگشت
     */
    const setupBackButton = () => {
        const backButton = document.querySelector('.back-to-home');
        if (!backButton) return;

        // انیمیشن هنگام هاور موس
        backButton.addEventListener('mouseenter', () => {
            backButton.style.transform = 'translateX(-5px)';
        });

        backButton.addEventListener('mouseleave', () => {
            backButton.style.transform = 'translateX(0)';
        });

        // انیمیشن پالس برای جلب توجه پس از بارگذاری
        setTimeout(() => {
            backButton.style.boxShadow = '0 0 0 0 rgba(101, 117, 255, 0.7)';
            backButton.animate([
                { boxShadow: '0 0 0 0 rgba(101, 117, 255, 0.7)' },
                { boxShadow: '0 0 0 10px rgba(101, 117, 255, 0)' }
            ], {
                duration: 1500,
                iterations: 1
            });
        }, 2000); // اجرا پس از 2 ثانیه
    };

    // ██████████████████████████████████████████████
    // ██████████ مقداردهی اولیه سیستم ██████████
    // ██████████████████████████████████████████████
    
    /**
     * راه‌اندازی اولیه تمام سیستم‌ها
     */
    const init = () => {
        setupParallax();
        setupCardAnimations();
        setupFilterButtons();
        setupBackButton();

        // نمایش صفحه پس از بارگذاری کامل
        document.body.style.opacity = 1;
    };

    // شروع اجرای اسکریپت‌ها
    init();
});