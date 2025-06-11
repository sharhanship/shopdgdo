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
    // ████████ پیکربندی انیمیشن ذرات ████████
    // ██████████████████████████████████████████████
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,  // تعداد ذرات
                    "density": {
                        "enable": true,  // تراکم پویا
                        "value_area": 800  // مساحت توزیع
                    }
                },
                "color": {
                    "value": "#ffffff"  // رنگ سفید
                },
                "shape": {
                    "type": "circle",  // شکل دایره‌ای
                    "stroke": {
                        "width": 0,  // بدون حاشیه
                        "color": "#000000"  // رنگ حاشیه
                    }
                },
                "opacity": {
                    "value": 0.5,  // شفافیت 50%
                    "random": true,  // شفافیت تصادفی
                    "anim": {
                        "enable": true,  // انیمیشن شفافیت
                        "speed": 1,  // سرعت انیمیشن
                        "opacity_min": 0.1,  // حداقل شفافیت
                        "sync": false  // غیرهمزمان
                    }
                },
                "size": {
                    "value": 3,  // اندازه پایه
                    "random": true,  // اندازه تصادفی
                    "anim": {
                        "enable": true,  // انیمیشن اندازه
                        "speed": 2,  // سرعت انیمیشن
                        "size_min": 0.1,  // حداقل اندازه
                        "sync": false  // غیرهمزمان
                    }
                },
                "line_linked": {
                    "enable": true,  // فعال کردن خطوط اتصال
                    "distance": 150,  // حداکثر فاصله اتصال
                    "color": "#ffffff",  // رنگ خطوط
                    "opacity": 0.4,  // شفافیت خطوط
                    "width": 1  // ضخامت خطوط
                },
                "move": {
                    "enable": true,  // فعال کردن حرکت
                    "speed": 1,  // سرعت حرکت
                    "direction": "none",  // جهت حرکت
                    "random": true,  // حرکت تصادفی
                    "straight": false,  // حرکت غیر مستقیم
                    "out_mode": "out",  // رفتار هنگام خروج
                    "bounce": false,  // عدم برخورد با مرز
                    "attract": {
                        "enable": false,  // جذب غیرفعال
                        "rotateX": 600,  // جذب در محور X
                        "rotateY": 1200  // جذب در محور Y
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",  // تشخیص روی کانواس
                "events": {
                    "onhover": {
                        "enable": true,  // فعال با هاور
                        "mode": "grab"  // حالت جذب
                    },
                    "onclick": {
                        "enable": true,  // فعال با کلیک
                        "mode": "push"  // حالت پرتاب
                    },
                    "resize": true  // پاسخ به تغییر سایز
                },
                "modes": {
                    "grab": {
                        "distance": 140,  // شعاع جذب
                        "line_linked": {
                            "opacity": 1  // شفافیت خطوط هنگام جذب
                        }
                    },
                    "push": {
                        "particles_nb": 4  // تعداد ذرات تولیدی
                    }
                }
            },
            "retina_detect": true  // پشتیبانی از صفحه رتینا
        });
    }
    
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