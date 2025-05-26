document.addEventListener('DOMContentLoaded', function () {
    // تنظیمات اولیه
    const body = document.body
    const textElement = document.getElementById('typing-text')
    const cursor = document.querySelector('.cursor')
    const professions = [
        'برنامه نویس فرانت',
        'برنامه نویس بک اند',
        'برنامه نویس اپلیکیشن',
    ]
    let professionIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typeSpeed = 100

    function typeWriter() {
        const currentText = professions[professionIndex]
        const displayText = currentText.substring(0, charIndex)

        textElement.textContent = displayText

        if (!isDeleting && charIndex === currentText.length) {
            cursor.classList.remove('inactive')
            isDeleting = true
            typeSpeed = 3000
        } else if (isDeleting && charIndex === 0) {
            cursor.classList.add('inactive')
            isDeleting = false
            professionIndex = (professionIndex + 1) % professions.length
            typeSpeed = 500
        } else {
            typeSpeed = isDeleting ? 50 : 100
            cursor.classList.remove('inactive')

            if (isDeleting) {
                charIndex--
            } else {
                charIndex++
            }
        }

        setTimeout(typeWriter, typeSpeed)
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            cursor.classList.remove('inactive')
            typeWriter()
        }, 1000)
    })


    // فیلتر نمونه کارها
    const filterBtns = document.querySelectorAll('.filter-btn')
    const portfolioItems = document.querySelectorAll('.portfolio-item')

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            // تغییر وضعیت فعال دکمه‌های فیلتر
            filterBtns.forEach((btn) => btn.classList.remove('active'))
            this.classList.add('active')

            const filterValue = this.getAttribute('data-filter')

            // فیلتر نمونه کارها
            portfolioItems.forEach((item) => {
                if (
                    filterValue === 'all' ||
                    item.getAttribute('data-category') === filterValue
                ) {
                    item.style.display = 'block'
                } else {
                    item.style.display = 'none'
                }
            })
        })
    })

    // فعال کردن انیمیشن مهارت‌ها هنگام اسکرول
    const skillBars = document.querySelectorAll('.skill-progress')

    function animateSkills() {
        skillBars.forEach((bar) => {
            const percent = bar.style.width
            bar.style.width = '0'

            setTimeout(() => {
                bar.style.width = percent
            }, 100)
        })
    }

    // مشاهده بخش مهارت‌ها
    const skillsSection = document.querySelector('#skills')
    const skillsObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                animateSkills()
                skillsObserver.unobserve(skillsSection)
            }
        },
        { threshold: 0.3 },
    )

    skillsObserver.observe(skillsSection)

    // تغییر فعال منو بر اساس اسکرول
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY

        document.querySelectorAll('.section').forEach((section) => {
            const sectionTop = section.offsetTop - 100
            const sectionHeight = section.offsetHeight
            const sectionId = section.getAttribute('id')

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                document.querySelectorAll('.nav-link').forEach((link) => {
                    link.classList.remove('active')
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active')

                        // تغییر وضعیت فعال بخش‌ها
                        document.querySelectorAll('.section').forEach((s) => {
                            s.classList.remove('active')
                        })
                        section.classList.add('active')
                    }
                })
            }
        })
    })


    // تنظیم ارتفاع هدر
    const headerHeight = document.querySelector('.header-container').offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.body.style.paddingTop = `${headerHeight}px`;

    // تنظیم scroll-margin برای سکشن‌ها
    document.querySelectorAll('section').forEach(section => {
        section.style.scrollMarginTop = `${headerHeight}px`;
    });

    // متغیرهای global
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const capsuleHeader = document.querySelector('.capsule-header');
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('section');

    // ایجاد منوی موبایل
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';

    // کپی آیتم‌های منو به منوی موبایل
    menuItems.forEach(item => {
        const clone = item.cloneNode(true);
        mobileMenu.appendChild(clone);
    });

    document.body.appendChild(mobileMenu);
    const mobileMenuItems = mobileMenu.querySelectorAll('.menu-item');

    // فعال کردن بخش صفحه اصلی به صورت پیش‌فرض
    document.querySelector('section#home').classList.add('active');

    // مدیریت کلیک روی دکمه منو در موبایل
    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // تابع تغییر بخش‌ها
    function changeSection(sectionId) {
        // مخفی کردن همه بخش‌ها
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // نمایش بخش انتخاب شده
        document.getElementById(sectionId).classList.add('active');

        // بستن منوی موبایل در حالت موبایل
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // اسکرول به بخش مورد نظر
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // اضافه کردن رویداد کلیک برای آیتم‌های منو
    function setupMenuItems(items) {
        items.forEach(item => {
            item.addEventListener('click', function () {
                const section = this.getAttribute('data-section');
                changeSection(section);

                // افزودن افکت فعال به آیتم انتخاب شده
                items.forEach(i => i.classList.remove('active-item'));
                this.classList.add('active-item');
            });
        });
    }

    setupMenuItems(menuItems);
    setupMenuItems(mobileMenuItems);

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

        // بروزرسانی آیتم منوی فعال
        if (currentSection) {
            menuItems.forEach(item => {
                item.classList.remove('active-item');
                if (item.getAttribute('data-section') === currentSection) {
                    item.classList.add('active-item');
                }
            });

            mobileMenuItems.forEach(item => {
                item.classList.remove('active-item');
                if (item.getAttribute('data-section') === currentSection) {
                    item.classList.add('active-item');
                }
            });
        }
    });

    if (window.innerWidth > 768) {
        const cursor = document.getElementById("glass-cursor");

        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        document.addEventListener("mouseleave", () => {
            cursor.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursor.style.opacity = "1";
        });

        document.querySelectorAll("a, button, div, [cursor='pointer']").forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.style.width = "30px";
                cursor.style.height = "30px";
            });

            el.addEventListener("mouseleave", () => {
                cursor.style.width = "50px";
                cursor.style.height = "50px";
            });
        });
    }
    let lastScroll = 0;
    const logo = document.querySelector(".logo");

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY || window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 200) {
            logo.classList.add("hidden");

        } else {
            // اسکرول به بالا
            logo.classList.remove("hidden");
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
