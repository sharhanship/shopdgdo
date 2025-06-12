/**
 * =============================================
 *               slider-particles.js
 * =============================================
 * مدیریت اسلایدر تصاویر و انیمیشن ذرات در پس‌زمینه
 * قابلیت‌ها شامل:
 * - اسلایدر با قابلیت حرکت به چپ و راست
 * - پیمایش با دکمه‌ها، نقاط و صفحه کلید
 * - انیمیشن ذرات تعاملی با particles.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // ██████████████████████████████████████████████
    // ████████████ سیستم اسلایدر تصاویر ████████████
    // ██████████████████████████████████████████████
    
    // انتخاب عناصر اصلی اسلایدر
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // متغیرهای حالت اسلایدر
    let currentSlide = 0;
    const slideCount = slides.length;

    // ██████████████████████████████████████████████
    // ███████████ توابع مدیریت اسلایدر ███████████
    // ██████████████████████████████████████████████
    
    /**
     * ایجاد نقاط راهنما برای اسلایدر
     * هر نقطه نمایانگر یک اسلاید است
     */
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            
            // فعال کردن نقطه مربوط به اسلاید فعلی
            if (index === currentSlide) dot.classList.add('active');
            
            // افزودن رویداد کلیک برای پرش به اسلاید مربوطه
            dot.addEventListener('click', () => goToSlide(index));
            
            dotsContainer.appendChild(dot);
        });
    }
    
    /**
     * پرش به اسلاید مشخص
     * @param {number} slideIndex - اندیس اسلاید مورد نظر
     */
    function goToSlide(slideIndex) {
        // به روزرسانی اسلایدهای مرئي
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        
        // به روزرسانی نقاط راهنما
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        currentSlide = slideIndex;
    }
    
    /**
     * رفتن به اسلاید بعدی
     * در صورت رسیدن به آخرین اسلاید، به ابتدا بازمی‌گردد
     */
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    /**
     * رفتن به اسلاید قبلی
     * در صورت رسیدن به اولین اسلاید، به انتها می‌رود
     */
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    // ██████████████████████████████████████████████
    // ██████████ رویدادهای تعاملی اسلایدر ██████████
    // ██████████████████████████████████████████████
    
    // رویداد کلیک برای دکمه بعدی
    nextBtn.addEventListener('click', nextSlide);
    
    // رویداد کلیک برای دکمه قبلی
    prevBtn.addEventListener('click', prevSlide);
    
    // پیمایش با صفحه کلید
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();  // فلش راست برای اسلاید بعدی
        } else if (e.key === 'ArrowLeft') {
            prevSlide();  // فلش چپ برای اسلاید قبلی
        }
    });
    
    // ██████████████████████████████████████████████
    // ██████████ راه‌اندازی اولیه اسلایدر ██████████
    // ██████████████████████████████████████████████
    
    createDots();  // ایجاد نقاط راهنما
    goToSlide(0);  // نمایش اولین اسلاید
    
    // فعال کردن اسلاید خودکار (اختیاری)
    // setInterval(nextSlide, 5000);  // هر 5 ثانیه اسلاید بعدی
});