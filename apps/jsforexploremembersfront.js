        document.addEventListener('DOMContentLoaded', function () {
            // 1. افکت پارالاکس برای پس‌زمینه
            const setupParallax = () => {
                document.body.addEventListener('mousemove', function (e) {
                    const x = e.clientX / window.innerWidth;
                    const y = e.clientY / window.innerHeight;

                    document.body.style.backgroundPosition = `
                ${x * 20}px ${y * 20}px
            `;
                });
            };

            // 2. انیمیشن ظهور کارت‌ها هنگام اسکرول
            const setupCardAnimations = () => {
                const observerOptions = {
                    threshold: 0.1
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = 1;
                            entry.target.style.transform = 'translateY(0)';
                            entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        }
                    });
                }, observerOptions);

                document.querySelectorAll('.member-card').forEach((card, index) => {
                    card.style.opacity = 0;
                    card.style.transform = 'translateY(20px)';
                    card.style.transitionDelay = `${index * 0.1}s`;
                    observer.observe(card);
                });
            };

            // 3. سیستم فیلتر کردن کارت‌ها
            const setupFilterButtons = () => {
                const filterButtons = document.querySelectorAll('.filter-btn');
                const memberCards = document.querySelectorAll('.member-card');

                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // حذف کلاس active از همه دکمه‌ها
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        // اضافه کردن کلاس active به دکمه کلیک شده
                        button.classList.add('active');

                        const filterValue = button.getAttribute('data-filter');

                        memberCards.forEach(card => {
                            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                                card.style.display = 'flex';
                                setTimeout(() => {
                                    card.style.opacity = 1;
                                    card.style.transform = 'translateY(0)';
                                }, 50);
                            } else {
                                card.style.opacity = 0;
                                card.style.transform = 'translateY(20px)';
                                setTimeout(() => {
                                    card.style.display = 'none';
                                }, 300);
                            }
                        });
                    });
                });
            };

            // 5. انیمیشن دکمه بازگشت
            const setupBackButton = () => {
                const backButton = document.querySelector('.back-to-home');
                if (!backButton) return;

                backButton.addEventListener('mouseenter', () => {
                    backButton.style.transform = 'translateX(-5px)';
                });

                backButton.addEventListener('mouseleave', () => {
                    backButton.style.transform = 'translateX(0)';
                });

                // انیمیشن پالس برای جلب توجه
                setTimeout(() => {
                    backButton.style.boxShadow = '0 0 0 0 rgba(101, 117, 255, 0.7)';
                    backButton.animate([
                        { boxShadow: '0 0 0 0 rgba(101, 117, 255, 0.7)' },
                        { boxShadow: '0 0 0 10px rgba(101, 117, 255, 0)' }
                    ], {
                        duration: 1500,
                        iterations: 1
                    });
                }, 2000);
            };

                // Initialize Particles.js
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }


            // 6. مقداردهی اولیه تمام توابع
            const init = () => {
                setupParallax();
                setupCardAnimations();
                setupFilterButtons();
                setupTextAnimation();
                setupBackButton();

                // نمایش صفحه پس از بارگذاری کامل
                document.body.style.opacity = 1;
            };

            // شروع اجرای اسکریپت‌ها
            init();
        });
        