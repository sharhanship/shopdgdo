document.addEventListener('DOMContentLoaded', function () {
    // تشخیص نوع صفحه
    if (document.getElementById('portfolio')) {
        loadPortfolioItems();
        setupPortfolioSearch();
    } else if (document.querySelector('.project-header')) {
        initProjectPage();
    }
});

// ██████████████████████████████████████████████
// ███████ سیستم فیلتر و جستجو نمونه کارها ████████████
// ██████████████████████████████████████████████

function setupPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // ذخیره فیلتر انتخاب شده در localStorage
            localStorage.setItem('portfolioFilter', this.getAttribute('data-filter'));
            
            filterPortfolioItems();
        });
    });
    
    // بازیابی فیلتر از localStorage در صورت وجود
    const savedFilter = localStorage.getItem('portfolioFilter');
    if (savedFilter) {
        const activeBtn = document.querySelector(`.filter-btn[data-filter="${savedFilter}"]`);
        if (activeBtn) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    }
}

function setupPortfolioSearch() {
    const searchInput = document.getElementById('portfolio-search');
    
    searchInput.addEventListener('input', function() {
        // ذخیره عبارت جستجو در localStorage
        localStorage.setItem('portfolioSearch', this.value);
        filterPortfolioItems();
    });
    
    // بازیابی جستجو از localStorage در صورت وجود
    const savedSearch = localStorage.getItem('portfolioSearch');
    if (savedSearch) {
        searchInput.value = savedSearch;
    }
}

function filterPortfolioItems() {
    const filterValue = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const searchValue = document.getElementById('portfolio-search').value.toLowerCase();
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const categoryMatch = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
        const title = item.querySelector('.portfolio-overlay h3').textContent.toLowerCase();
        const searchMatch = title.includes(searchValue) || 
                          (item.getAttribute('data-category') || '').includes(searchValue);
        
        if (categoryMatch && searchMatch) {
            item.style.display = 'block';
            item.classList.add('visible');
        } else {
            item.style.display = 'none';
            item.classList.remove('visible');
        }
    });
    
    // اعمال افکت برای آیتم‌های قابل مشاهده
    animateVisibleItems();
}

function animateVisibleItems() {
    const visibleItems = document.querySelectorAll('.portfolio-item.visible');
    
    visibleItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'none';
            
            // Force reflow
            void item.offsetHeight;
            
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ██████████████████████████████████████████████████
// ████████████ صفحه اصلی - نمونه کارها █████████████
// ██████████████████████████████████████████████████

async function loadPortfolioItems() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const portfolioGrid = document.querySelector('#portfolio .portfolio-grid');
    
    try {
        loadingState.style.display = 'flex';
        errorState.style.display = 'none';
        portfolioGrid.innerHTML = '';
        
        const response = await fetch('./apis/portfolioapi.php');
        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message);
        }

        // ابتدا همه آیتم‌ها را ایجاد می‌کنیم
        result.data.forEach(project => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.setAttribute('data-category', project.category);
            
            item.innerHTML = `
                <div class="portfolio-image">
                    <img src="${project.first_image}" 
                         alt="${project.name}"
                         loading="lazy"
                         onerror="this.onerror=null;this.src='./content/default.jpg'"
                         onload="adjustCardSize(this)">
                    <div class="portfolio-overlay">
                        <h3 class="portfolio-title">${project.name}</h3>
                        <a href="pages/examlepworkpage.html?id=${project.id}" class="portfolio-link" aria-label="مشاهده ${project.name}">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
            
            portfolioGrid.appendChild(item);
        });

        // تابعی برای تنظیم اندازه کارت بر اساس عکس
      window.adjustCardSize = function(img) {
    const item = img.closest('.portfolio-item');
    if (item) {
        // تنظیم ابعاد بر اساس عکس
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const maxWidth = window.innerWidth <= 768 ? window.innerWidth - 20 : img.naturalWidth;
        
        item.style.width = `${Math.min(img.naturalWidth, maxWidth)}px`;
        item.style.height = 'auto'; // ارتفاع خودکار بر اساس نسبت
        
        // حفظ نسبت ابعاد
        item.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
        
        // برای موبایل
        if (window.innerWidth <= 768) {
            item.style.maxWidth = '100%';
        }
    }
};
        
        // تنظیم فیلتر و جستجو
        setupPortfolioFilter();
        setupPortfolioSearch();
        filterPortfolioItems();
        
    } catch (error) {
        console.error('خطا در بارگذاری نمونه کارها:', error);
        errorState.querySelector('.error-message').textContent = 'خطا در دریافت نمونه کارها: ' + error.message;
        errorState.style.display = 'flex';
    } finally {
        loadingState.style.display = 'none';
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
    document.addEventListener('keydown', function (e) {
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