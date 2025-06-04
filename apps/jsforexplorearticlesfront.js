   document.addEventListener('DOMContentLoaded', function() {
            const searchBox = document.querySelector('.search-box');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const articleCards = document.querySelectorAll('.article-card');
            const noResults = document.querySelector('.no-results');
            
            // فعال کردن اولین فیلتر
            filterButtons[0].classList.add('active');
            
            // جستجوی مقالات
            searchBox.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                let visibleCards = 0;
                
                articleCards.forEach(card => {
                    const title = card.querySelector('.article-title').textContent.toLowerCase();
                    const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
                    const isVisible = card.style.display !== 'none';
                    
                    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                        card.style.display = '';
                        visibleCards++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                updateNoResults(visibleCards);
            });

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

            
            // فیلتر کردن بر اساس دسته‌بندی
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // حذف کلاس active از همه دکمه‌ها
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // اضافه کردن کلاس active به دکمه کلیک شده
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    let visibleCards = 0;
                    
                    articleCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        const isSearchMatch = card.querySelector('.article-title').textContent.toLowerCase()
                            .includes(searchBox.value.toLowerCase()) || 
                            card.querySelector('.article-excerpt').textContent.toLowerCase()
                            .includes(searchBox.value.toLowerCase());
                        
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
            
            // تابع برای نمایش پیام عدم وجود نتایج
            function updateNoResults(visibleCount) {
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
            
            // انیمیشن hover برای کارت‌ها
            articleCards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    const x = e.clientX - this.getBoundingClientRect().left;
                    const y = e.clientY - this.getBoundingClientRect().top;
                    
                    const centerX = this.offsetWidth / 2;
                    const centerY = this.offsetHeight / 2;
                    
                    const angleX = (y - centerY) / 10;
                    const angleY = (centerX - x) / 10;
                    
                    this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
                    this.style.boxShadow = `${-angleY}px ${angleX}px 35px rgba(0, 0, 0, 0.4)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
                    this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
                });
            });
        });
        
        // بازنشانی فیلترها
        function resetFilters() {
            const searchBox = document.querySelector('.search-box');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const articleCards = document.querySelectorAll('.article-card');
            const noResults = document.querySelector('.no-results');
            
            searchBox.value = '';
            filterButtons.forEach(btn => btn.classList.remove('active'));
            filterButtons[0].classList.add('active');
            articleCards.forEach(card => card.style.display = '');
            noResults.style.display = 'none';
        }