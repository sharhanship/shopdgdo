document.addEventListener('DOMContentLoaded', function() {
    // ██████████████████████████████████████████████
    // ██████████ انتخاب عناصر اصلی DOM ██████████
    // ██████████████████████████████████████████████
    const searchBox = document.querySelector('.search-box');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articlesContainer = document.querySelector('.articles-container');
    const noResults = document.querySelector('.no-results');
    
    // پالت رنگ‌های شیک برای عناوین مقالات
    const titleColors = [
        '#2f39f5ff', '#9316ecff', '#8a22f1ff', '#ee1919ff',
        '#f36812ff', '#0b8ee6ff', '#bef00bff', '#ee3a0dff',
        '#0a64e2ff', '#00d2ff', '#5af804ff', '#03f0a9ff',
        '#eb0a77ff', '#f31212ff', '#6b06e7ff', '#0047eeff'
    ];

    // ██████████████████████████████████████████████
    // █████████████ دریافت مقالات از سرور █████████████
    // ██████████████████████████████████████████████
    function fetchArticles() {
        fetch('../apis/get_articles.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('خطا در دریافت داده‌ها');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // معکوس کردن ترتیب مقالات قبل از نمایش
                    const reversedArticles = data.articles.reverse();
                    renderArticles(reversedArticles);
                    setupEventListeners();
                } else {
                    noResults.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                noResults.style.display = 'block';
            });
    }

    // ██████████████████████████████████████████████
    // █████████████ رندر مقالات █████████████
    // ██████████████████████████████████████████████
    function renderArticles(articles) {
        articlesContainer.innerHTML = '';
        
        if (articles.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        articles.forEach((article, index) => {
            const card = document.createElement('div');
            card.className = 'article-card glass-card';
            card.setAttribute('data-category', article.category.toLowerCase());
            
            if (article.tags) {
                card.setAttribute('data-tags', article.tags);
            }
            
            // انتخاب رنگ از پالت بر اساس index مقاله
            const colorIndex = index % titleColors.length;
            const titleColor = titleColors[colorIndex];
            
            card.innerHTML = `
                <div class="article-content">
                    <h3 class="article-title" style="color: ${titleColor}">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt || article.key_point || ''}</p>
                    <a href="../pages/articles.html?id=${article.id}" class="article-link">ادامه مطلب <i class="fas fa-arrow-left"></i></a>
                </div>
            `;
            
            articlesContainer.appendChild(card);
        });
    }

    // ██████████████████████████████████████████████
    // █████████████ تنظیم رویدادها █████████████
    // ██████████████████████████████████████████████
    function setupEventListeners() {
        const articleCards = document.querySelectorAll('.article-card');
        
        // █████████████ سیستم جستجوی مقالات █████████████
        searchBox.addEventListener('input', function() {
            filterArticles();
        });
        
        // █████████ سیستم فیلتر دسته‌بندی‌ها █████████
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterArticles();
            });
        });
        
        // █████████████ انیمیشن‌های کارت‌ها █████████████
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
    }

    // ██████████████████████████████████████████████
    // █████████████ فیلتر کردن مقالات █████████████
    // ██████████████████████████████████████████████
    function filterArticles() {
        const searchTerm = searchBox.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const articleCards = document.querySelectorAll('.article-card');
        let visibleCards = 0;
        
        articleCards.forEach(card => {
            const title = card.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            
            if (matchesSearch && matchesFilter) {
                card.style.display = '';
                visibleCards++;
            } else {
                card.style.display = 'none';
            }
        });
        
        noResults.style.display = visibleCards === 0 ? 'block' : 'none';
    }

    // ██████████████████████████████████████████████
    // █████████████ شروع اجرای کد █████████████
    // ██████████████████████████████████████████████
    fetchArticles();
});

/**
 * بازنشانی تمام فیلترها و جستجوها
 */
function resetFilters() {
    const searchBox = document.querySelector('.search-box');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    searchBox.value = '';
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons[0].classList.add('active');
    
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => card.style.display = '');
    
    document.querySelector('.no-results').style.display = 'none';
}