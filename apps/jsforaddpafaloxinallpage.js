    // ██████████████████████████████████████████████
    // ███████ پیکربندی انیمیشن ذرات ███████
    // ██████████████████████████████████████████████
    
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80, // تعداد ذرات
                    "density": {
                        "enable": true, // تراکم پویا
                        "value_area": 800 // مساحت توزیع
                    }
                },
                "color": {
                    "value": "#ffffff" // رنگ سفید
                },
                "shape": {
                    "type": "circle", // شکل دایره‌ای
                    "stroke": {
                        "width": 0, // بدون حاشیه
                        "color": "#000000" // رنگ حاشیه
                    }
                },
                "opacity": {
                    "value": 0.5, // شفافیت 50%
                    "random": true, // شفافیت تصادفی
                    "anim": {
                        "enable": true, // انیمیشن شفافیت
                        "speed": 1, // سرعت انیمیشن
                        "opacity_min": 0.1, // حداقل شفافیت
                        "sync": false // غیرهمزمان
                    }
                },
                "size": {
                    "value": 3, // اندازه پایه
                    "random": true, // اندازه تصادفی
                    "anim": {
                        "enable": true, // انیمیشن اندازه
                        "speed": 2, // سرعت انیمیشن
                        "size_min": 0.1, // حداقل اندازه
                        "sync": false // غیرهمزمان
                    }
                },
                "line_linked": {
                    "enable": true, // فعال کردن خطوط اتصال
                    "distance": 150, // حداکثر فاصله اتصال
                    "color": "#ffffff", // رنگ خطوط
                    "opacity": 0.4, // شفافیت خطوط
                    "width": 1 // ضخامت خطوط
                },
                "move": {
                    "enable": true, // فعال کردن حرکت
                    "speed": 1, // سرعت حرکت
                    "direction": "none", // جهت حرکت
                    "random": true, // حرکت تصادفی
                    "straight": false, // حرکت غیرمستقیم
                    "out_mode": "out", // رفتار هنگام خروج
                    "bounce": false, // عدم برخورد با مرز
                    "attract": {
                        "enable": false, // جذب غیرفعال
                        "rotateX": 600, // جذب در محور X
                        "rotateY": 1200 // جذب در محور Y
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas", // تشخیص روی کانواس
                "events": {
                    "onhover": {
                        "enable": true, // فعال با هاور
                        "mode": "grab" // حالت جذب
                    },
                    "onclick": {
                        "enable": true, // فعال با کلیک
                        "mode": "push" // حالت پرتاب
                    },
                    "resize": true // پاسخ به تغییر سایز
                },
                "modes": {
                    "grab": {
                        "distance": 140, // شعاع جذب
                        "line_linked": {
                            "opacity": 1 // شفافیت خطوط هنگام جذب
                        }
                    },
                    "push": {
                        "particles_nb": 4 // تعداد ذرات تولیدی
                    }
                }
            },
            "retina_detect": true // پشتیبانی از صفحه رتینا
        });
    }
