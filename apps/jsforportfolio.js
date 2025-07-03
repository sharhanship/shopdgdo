document.addEventListener('DOMContentLoaded', function() {
    // تشخیص نوع صفحه
    if (document.getElementById('portfolio')) {
        loadPortfolioItems();
    } else if (document.querySelector('.project-header')) {
        initProjectPage();
    }
});

// ██████████████████████████████████████████████████
// ████████████ صفحه اصلی - نمونه کارها █████████████
// ██████████████████████████████████████████████████

async function loadPortfolioItems() {
    try {
        const response = await fetch('./apis/portfolioapi.php');
        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message);
        }

        const portfolioGrid = document.querySelector('#portfolio .portfolio-grid');
        portfolioGrid.innerHTML = '';

        result.data.forEach(project => {
            portfolioGrid.innerHTML += `
                <div class="portfolio-item">
                    <div class="portfolio-image">
                        <img src="${project.first_image}" 
                             alt="${project.name}"
                             onerror="this.onerror=null;this.src='./content/default.jpg'">
                        <div class="portfolio-overlay">
                            <h3>${project.name}</h3>
                            <a href="pages/examlepworkpage.html?id=${project.id}" class="portfolio-link">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error('خطا در بارگذاری نمونه کارها:', error);
        showError('خطا در دریافت نمونه کارها');
    }
}

// ██████████████████████████████████████████████████
// ███████████ صفحه جزئیات پروژه ██████████████████
// ██████████████████████████████████████████████████

async function initProjectPage() {
    await loadProjectDetails();
    initSlider();
}

async function loadProjectDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (!projectId) {
            throw new Error('شناسه پروژه مشخص نشده');
        }

        const response = await fetch(`../apis/portfolioapi.php?project_id=${projectId}`);
        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message);
        }

        const project = result.data;

        // 1. به‌روزرسانی عنوان
        document.querySelector('.project-header h1').textContent = project.name;

        // 2. ایجاد اسلایدر
        const slider = document.querySelector('.slider');
        slider.innerHTML = '';
        
        project.image_urls.forEach((imgUrl, index) => {
            slider.innerHTML += `
                <div class="slide ${index === 0 ? 'active' : ''}">
                    <img src="${imgUrl}" 
                         alt="تصویر ${project.name} - ${index + 1}"
                         onerror="this.style.display='none'">
                </div>
            `;
        });

        // 3. ویدیو
        const videoContainer = document.querySelector('.video-container');
        if (project.video_url) {
            videoContainer.innerHTML = `
                <iframe src="${project.video_url}" frameborder="0" allowfullscreen></iframe>
            `;
            videoContainer.style.display = 'block';
        } else {
            videoContainer.style.display = 'none';
        }

        // 4. جزئیات پروژه
        document.querySelector('.project-details ul').innerHTML = `
            <li><strong>دسته‌بندی:</strong> ${project.category || '---'}</li>
            <li><strong>تکنولوژی‌ها:</strong> ${project.technologies || '---'}</li>
            <li><strong>زمان تحویل:</strong> ${project.delivery_time || '---'}</li>
            <li><strong>مشتری:</strong> ${project.client || '---'}</li>
        `;

        // 5. لینک پروژه
        const projectLink = document.querySelector('.project-link-btn');
        if (project.project_link) {
            projectLink.href = project.project_link;
            projectLink.style.display = 'inline-block';
        } else {
            projectLink.style.display = 'none';
        }

    } catch (error) {
        console.error('خطا در بارگذاری جزئیات:', error);
        showError('خطا در دریافت جزئیات پروژه');
    }
}

// ██████████████████████████████████████████████████
// ████████████ سیستم اسلایدر تصاویر ███████████████
// ██████████████████████████████████████████████████

function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;

    // ایجاد نقاط راهنما
    function createDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // پرش به اسلاید مشخص
    function goToSlide(slideIndex) {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });
        
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        currentSlide = slideIndex;
    }
    
    // اسلاید بعدی
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }
    
    // اسلاید قبلی
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }
    
    // رویدادهای دکمه‌ها
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // پیمایش با صفحه کلید
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') nextSlide();
        else if (e.key === 'ArrowLeft') prevSlide();
    });
    
    // راه‌اندازی اولیه
    createDots();
    goToSlide(0);
    
    // اسلاید خودکار (اختیاری)
    // setInterval(nextSlide, 5000);
}

// ██████████████████████████████████████████████████
// ██████████████ توابع کمکی عمومی █████████████████
// ██████████████████████████████████████████████████

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}