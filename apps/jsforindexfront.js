/**
 * =============================================
 *               main-interactions.js
 * =============================================
 * مدیریت تمام تعاملات اصلی صفحه شامل:
 * - تایپ خودکار متن
 * - انیمیشن ذرات پس‌زمینه
 * - سیستم فیلتر نمونه کارها
 * - انیمیشن مهارت‌ها
 * - نویگیشن اسکرولی
 * - منوی موبایل
 */

document.addEventListener('DOMContentLoaded', function () {
    // ██████████████████████████████████████████████
    // █████████ سیستم تایپ خودکار متن █████████
    // ██████████████████████████████████████████████
    
    // انتخاب عناصر مورد نیاز
    const textElement = document.getElementById('typing-text');
    const cursor = document.querySelector('.cursor');
    
    // لیست متون برای تایپ خودکار
    const professions = [
        'تیم توسعه دهنده سایت',
        'تیم توسعه اپلیکیشن',
        'تیم خدمات اینترنتی',
    ];
    
    // متغیرهای حالت
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    /**
     * تابع اصلی برای تایپ خودکار متن
     * به صورت بازگشتی فراخوانی می‌شود
     */
    function typeWriter() {
        const currentText = professions[professionIndex];
        const displayText = currentText.substring(0, charIndex);
        
        // به‌روزرسانی متن نمایش داده شده
        textElement.textContent = displayText;

        // مدیریت حالت‌های مختلف تایپ/پاک‌کردن
        if (!isDeleting && charIndex === currentText.length) {
            // توقف در پایان متن
            cursor.classList.remove('inactive');
            isDeleting = true;
            typeSpeed = 3000; // توقف 3 ثانیه‌ای
        } else if (isDeleting && charIndex === 0) {
            // شروع متن جدید
            cursor.classList.add('inactive');
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typeSpeed = 500; // تأخیر قبل از شروع متن جدید
        } else {
            // تنظیم سرعت بر اساس حالت
            typeSpeed = isDeleting ? 50 : 100;
            cursor.classList.remove('inactive');
            
            // افزایش یا کاهش اندیس کاراکتر
            isDeleting ? charIndex-- : charIndex++;
        }

        // فراخوانی مجدد با تأخیر
        setTimeout(typeWriter, typeSpeed);
    }

    // شروع انیمیشن پس از بارگذاری صفحه
    window.addEventListener('load', () => {
        setTimeout(() => {
            cursor.classList.remove('inactive');
            typeWriter();
        }, 1000); // تأخیر 1 ثانیه‌ای قبل از شروع
    });

    // ██████████████████████████████████████████████
    // ███████ سیستم فیلتر نمونه کارها ████████████
    // ██████████████████████████████████████████████
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            // به‌روزرسانی دکمه فعال
            filterBtns.forEach((btn) => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // اعمال فیلتر بر روی آیتم‌ها
            portfolioItems.forEach((item) => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block'; // نمایش آیتم
                } else {
                    item.style.display = 'none'; // مخفی کردن آیتم
                }
            });
        });
    });

    // ██████████████████████████████████████████████
    // ███████ سیستم نویگیشن اسکرولی ██████████████
    // ██████████████████████████████████████████████
    
    // تنظیم ارتفاع هدر و حاشیه‌ها
    const headerHeight = document.querySelector('.header-container').offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.body.style.paddingTop = `${headerHeight}px`;

    // تنظیم scroll-margin برای اسکرول دقیق به بخش‌ها
    document.querySelectorAll('section').forEach(section => {
        section.style.scrollMarginTop = `${headerHeight}px`;
    });

    // متغیرهای منوی موبایل
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const capsuleHeader = document.querySelector('.capsule-header');
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('section');

    // ایجاد منوی موبایل پویا
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';

    // کپی آیتم‌های منو به منوی موبایل
    menuItems.forEach(item => {
        const clone = item.cloneNode(true);
        mobileMenu.appendChild(clone);
    });

    document.body.appendChild(mobileMenu);
    const mobileMenuItems = mobileMenu.querySelectorAll('.menu-item');

    // فعال‌سازی بخش صفحه اصلی به صورت پیش‌فرض
    document.querySelector('section#home').classList.add('active');

    /**
     * مدیریت نمایش/مخفی کردن منوی موبایل
     */
    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    /**
     * تغییر به بخش مورد نظر
     * @param {string} sectionId - ID بخش هدف
     */
    function changeSection(sectionId) {
        // به‌روزرسانی وضعیت فعال بخش‌ها
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        // بستن منوی موبایل در حالت موبایل
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // اسکرول نرم به بخش مورد نظر
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    /**
     * تنظیم رویدادهای کلیک برای آیتم‌های منو
     * @param {NodeList} items - لیست آیتم‌های منو
     */
    function setupMenuItems(items) {
        items.forEach(item => {
            item.addEventListener('click', function () {
                const section = this.getAttribute('data-section');
                changeSection(section);

                // به‌روزرسانی وضعیت فعال آیتم‌ها
                items.forEach(i => i.classList.remove('active-item'));
                this.classList.add('active-item');
            });
        });
    }

    // راه‌اندازی منوهای دسکتاپ و موبایل
    setupMenuItems(menuItems);
    setupMenuItems(mobileMenuItems);

    // ██████████████████████████████████████████████
    // ███████ مدیریت اسکرول و نویگیشن ████████████
    // ██████████████████████████████████████████████
    
    // تشخیص بخش فعال بر اساس اسکرول
    window.addEventListener('scroll', function () {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        // به‌روزرسانی آیتم منوی فعال
        if (currentSection) {
            [menuItems, mobileMenuItems].forEach(itemList => {
                
                itemList.forEach(item => {
                    item.classList.remove('active-item');
                    if (item.getAttribute('data-section') === currentSection) {
                        item.classList.add('active-item');
                    }
                });
            });
        }
    });

    // مدیریت نمایش/مخفی کردن لوگو بر اساس اسکرول
    let lastScroll = 0;
    const logo = document.querySelector(".logo");

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY || window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 200) {
            logo.classList.add("hidden"); // مخفی کردن هنگام اسکرول به پایین
        } else {
            logo.classList.remove("hidden"); // نمایش هنگام اسکرول به بالا
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    // فعال‌سازی اسکرول صاف برای لینک‌های داخلی
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                changeSection(targetId);
            }
        });
    });
});