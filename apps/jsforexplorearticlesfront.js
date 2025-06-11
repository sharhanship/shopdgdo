/**
 * =============================================
 *               search-filter.js
 * =============================================
 * سیستم جستجو و فیلتر مقالات با قابلیت‌های:
 * - جستجوی هوشمند در عنوان و محتوای مقالات
 * - فیلتر بر اساس دسته‌بندی‌های مختلف
 * - انیمیشن‌های تعاملی کارت مقالات
 * - نمایش ذرات پویا در پس‌زمینه
 */

document.addEventListener('DOMContentLoaded', function() {
    // ██████████████████████████████████████████████
    // ██████████ انتخاب عناصر اصلی DOM ██████████
    // ██████████████████████████████████████████████
    const searchBox = document.querySelector('.search-box');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const noResults = document.querySelector('.no-results');
    
    // فعال کردن اولین فیلتر به صورت پیش‌فرض
    filterButtons[0].classList.add('active');
    
    // ██████████████████████████████████████████████
    // █████████████ سیستم جستجوی مقالات █████████████
    // ██████████████████████████████████████████████
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let visibleCards = 0;
        
        articleCards.forEach(card => {
            const title = card.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
            const isVisible = card.style.display !== 'none';
            
            // نمایش/مخفی کردن کارت بر اساس تطبیق با عبارت جستجو
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = '';
                visibleCards++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // به‌روزرسانی وضعیت نمایش پیام "نتیجه‌ای یافت نشد"
        updateNoResults(visibleCards);
    });

    // ██████████████████████████████████████████████
    // █████████ پیکربندی انیمیشن ذرات █████████
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
                    "straight": false,  // حرکت غیرمستقیم
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
    // █████████ سیستم فیلتر دسته‌بندی‌ها █████████
    // ██████████████████████████████████████████████
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // به‌روزرسانی وضعیت فعال بودن دکمه‌های فیلتر
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            let visibleCards = 0;
            
            articleCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isSearchMatch = card.querySelector('.article-title').textContent.toLowerCase()
                    .includes(searchBox.value.toLowerCase()) || 
                    card.querySelector('.article-excerpt').textContent.toLowerCase()
                    .includes(searchBox.value.toLowerCase());
                
                // اعمال همزمان فیلتر دسته‌بندی و جستجو
                if ((filter === 'all' || category === filter) && isSearchMatch) {
                    card.style.display = '';
                    visibleCards++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            updateNoResults(visibleCards);
        });
    });
    
    /**
     * به‌روزرسانی وضعیت نمایش پیام "نتیجه‌ای یافت نشد"
     * @param {number} visibleCount - تعداد کارت‌های قابل مشاهده
     */
    function updateNoResults(visibleCount) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    // ██████████████████████████████████████████████
    // ███████ انیمیشن‌های تعاملی کارت‌ها ███████
    // ██████████████████████████████████████████████
    articleCards.forEach(card => {
        // انیمیشن هنگام حرکت موس روی کارت
        card.addEventListener('mousemove', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const centerX = this.offsetWidth / 2;
            const centerY = this.offsetHeight / 2;
            
            // محاسبه زاویه چرخش بر اساس موقعیت موس
            const angleX = (y - centerY) / 10;
            const angleY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
            this.style.boxShadow = `${-angleY}px ${angleX}px 35px rgba(0, 0, 0, 0.4)`;
        });
        
        // بازنشانی انیمیشن هنگام خروج موس
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
        });
    });
});

/**
 * بازنشانی تمام فیلترها و جستجوها
 * نمایش تمام مقالات و بازگشت به حالت پیش‌فرض
 */
function resetFilters() {
    const searchBox = document.querySelector('.search-box');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const noResults = document.querySelector('.no-results');
    
    // بازنشانی مقادیر
    searchBox.value = '';
    
    // بازنشانی فیلترها
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons[0].classList.add('active');
    
    // نمایش تمام کارت‌ها
    articleCards.forEach(card => card.style.display = '');
    
    // مخفی کردن پیام "نتیجه‌ای یافت نشد"
    noResults.style.display = 'none';
}