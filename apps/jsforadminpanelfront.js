/**
 * Admin Panel Frontend JS
 * Optimized and restructured version
 */

// ==================== CONFIGURATION ====================
const config = {
    apiUrl: '../apis/adminpanelapi.php',
    currentSection: 'messages-section',
    timeout: 8000,
    debugMode: false
};

// ==================== DOM CACHE ====================
const DOM = {
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    contentSections: document.querySelectorAll('.content-section'),
    
    // Buttons
    logoutBtn: document.querySelector('.logout-btn'),
    deleteBtns: document.querySelectorAll('.delete-btn'),
    commentsBtns: document.querySelectorAll('.comments-btn'),
    viewMoreBtns: document.querySelectorAll('.view-more'),
    closeModalBtns: document.querySelectorAll('.close-modal, .modal-close-btn'),
    
    // Forms
    forms: document.querySelectorAll('form'),
    fileInputs: document.querySelectorAll('.file-input'),
    
    // Modals
    messageModal: document.getElementById('messageModal'),
    fullMessageText: document.getElementById('fullMessageText'),
    
    // Tables
    messagesTable: document.querySelector('.messages-table'),
    portfolioGrid: document.querySelector('.portfolio-grid'),
    teamGrid: document.querySelector('.team-grid'),
    articlesList: document.querySelector('.articles-list')
};

// ==================== UTILITY FUNCTIONS ====================
const utils = {
    log: function(...args) {
        if(config.debugMode) {
            console.log('[AdminPanel]', ...args);
        }
    },
    
    showNotification: function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    },
    
    debounce: function(func, wait = 300) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    fetchWithTimeout: async function(url, options = {}, timeout = config.timeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch(error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    },
    
    confirmAction: function(message) {
        return new Promise((resolve) => {
            if (confirm(message)) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
};

// ==================== MODAL FUNCTIONS ====================
const modal = {
    show: function(message) {
        if (DOM.fullMessageText && DOM.messageModal) {
            DOM.fullMessageText.textContent = message;
            DOM.messageModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },
    
    hide: function() {
        if (DOM.messageModal) {
            DOM.messageModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
};

// ==================== DATA LOADING FUNCTIONS ====================
const dataLoader = {
    loadSectionData: async function(sectionId) {
        try {
            utils.log(`Loading data for section: ${sectionId}`);
            config.currentSection = sectionId;
            
            const data = await utils.fetchWithTimeout(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=get_${sectionId.replace('-section', '')}`
            });
            
            switch(sectionId) {
                case 'messages-section':
                    this.renderMessages(data);
                    break;
                case 'about-section':
                    this.renderAbout(data);
                    break;
                case 'portfolio-section':
                    this.renderPortfolio(data);
                    break;
                case 'team-section':
                    this.renderTeam(data);
                    break;
                case 'articles-section':
                    this.renderArticles(data);
                    break;
                default:
                    utils.log(`Unknown section: ${sectionId}`);
            }
        } catch(error) {
            utils.log(`Error loading ${sectionId}:`, error);
            utils.showNotification(`خطا در بارگذاری داده‌های بخش`, 'error');
        }
    },
    
    renderMessages: function(messages) {
        if (!DOM.messagesTable) return;
        
        const tbody = DOM.messagesTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = messages.map((message, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${message.name || '-'}</td>
                <td>${message.email || '-'}</td>
                <td>${message.phone || '-'}</td>
                <td>${message.subject || '-'}</td>
                <td>
                    <span class="message-preview">${message.message ? message.message.substring(0, 50) + '...' : 'بدون متن'}</span>
                    <span class="view-more" data-fulltext="${message.message || ''}">مشاهده بیشتر</span>
                </td>
                <td>
                    <button class="delete-btn" data-id="${message.id}" data-type="message">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `).join('');
        
        this.bindViewMoreButtons();
        this.bindDeleteButtons();
    },
    
    renderAbout: function(aboutData) {
        if (!document.getElementById('about-form')) return;
        
        document.getElementById('about-description').value = aboutData.description || '';
        document.getElementById('work-experience').value = aboutData.work_experience || 0;
        document.getElementById('completed-projects').value = aboutData.completed_projects || 0;
        document.getElementById('happy-clients').value = aboutData.happy_clients || 0;
    },
    
    renderPortfolio: function(portfolioItems) {
        if (!DOM.portfolioGrid) return;
        
        DOM.portfolioGrid.innerHTML = portfolioItems.map(item => {
            const categoryClass = item.category === 'frontend' ? 'frontend' : 
                               item.category === 'backend' ? 'backend' : 'fullstack';
            
            const categoryText = item.category === 'frontend' ? 'فرانت‌اند' : 
                              item.category === 'backend' ? 'بک‌اند' : 'فول استک';
            
            const mainImage = item.images && item.images.length > 0 ? 
                `<img src="${item.images[0]}" alt="${item.project_name || 'پروژه'}">` : 
                `<i class="fas fa-image"></i>`;
            
            return `
                <div class="portfolio-card">
                    <div class="portfolio-img">${mainImage}</div>
                    <div class="portfolio-info">
                        <h3 class="portfolio-title">${item.project_name || 'بدون عنوان'}</h3>
                        <span class="portfolio-category ${categoryClass}">${categoryText}</span>
                        <div class="portfolio-actions">
                            <button class="delete-btn" data-id="${item.id}" data-type="portfolio">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.bindDeleteButtons();
    },
    
    renderTeam: function(teamMembers) {
        if (!DOM.teamGrid) return;
        
        DOM.teamGrid.innerHTML = teamMembers.map(member => {
            const roleClass = member.role === 'frontend' ? 'frontend' :
                            member.role === 'backend' ? 'backend' :
                            member.role === 'designer' ? 'designer' : 'editor';
            
            const roleText = member.role === 'frontend' ? 'فرانت‌اند' :
                           member.role === 'backend' ? 'بک‌اند' :
                           member.role === 'designer' ? 'طراح' : 'تدوین‌گر';
            
            const avatar = member.avatar_path ? 
                `<img src="${member.avatar_path}" alt="${member.first_name || ''} ${member.last_name || ''}">` : 
                `<i class="fas fa-user"></i>`;
            
            return `
                <div class="team-card">
                    <div class="team-avatar">${avatar}</div>
                    <h3 class="team-name">${member.first_name || ''} ${member.last_name || ''}</h3>
                    <span class="team-role ${roleClass}">${roleText}</span>
                    <div class="team-actions">
                        <button class="delete-btn" data-id="${member.id}" data-type="team">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        this.bindDeleteButtons();
    },
    
    renderArticles: function(articles) {
        if (!DOM.articlesList) return;
        
        DOM.articlesList.innerHTML = articles.map(article => {
            let starsHtml = '';
            const rating = article.rating || 0;
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            
            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i === fullStars + 1 && hasHalfStar) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            return `
                <div class="article-item">
                    <div class="article-info">
                        <h3>${article.title || 'بدون عنوان'}</h3>
                        <div class="article-rating">${starsHtml}</div>
                    </div>
                    <div class="article-actions">
                        <button class="comments-btn" data-id="${article.id}">
                            <i class="fas fa-comments"></i> نظرات
                        </button>
                        <button class="delete-btn" data-id="${article.id}" data-type="article">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        this.bindCommentsButtons();
        this.bindDeleteButtons();
    },
    
    bindViewMoreButtons: function() {
        document.querySelectorAll('.view-more').forEach(btn => {
            btn.addEventListener('click', () => {
                const fullMessage = btn.getAttribute('data-fulltext');
                if (fullMessage) {
                    modal.show(fullMessage);
                }
            });
        });
    },
    
    bindDeleteButtons: function() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const type = btn.getAttribute('data-type');
                const confirmMessage = {
                    'message': 'آیا از حذف این پیام مطمئن هستید؟',
                    'portfolio': 'آیا از حذف این نمونه کار مطمئن هستید؟',
                    'team': 'آیا از حذف این عضو تیم مطمئن هستید؟',
                    'article': 'آیا از حذف این مقاله مطمئن هستید؟'
                }[type] || 'آیا از حذف این آیتم مطمئن هستید؟';
                
                const confirmed = await utils.confirmAction(confirmMessage);
                if (confirmed) {
                    try {
                        const response = await utils.fetchWithTimeout(config.apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `action=delete_${type}&id=${id}`
                        });
                        
                        if (response.success) {
                            utils.showNotification('آیتم با موفقیت حذف شد');
                            this.loadSectionData(config.currentSection);
                        }
                    } catch(error) {
                        utils.log('Delete error:', error);
                        utils.showNotification('خطا در حذف آیتم', 'error');
                    }
                }
            });
        });
    },
    
    bindCommentsButtons: function() {
        document.querySelectorAll('.comments-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const articleId = btn.getAttribute('data-id');
                alert(`نظرات مقاله با ID ${articleId} نمایش داده می‌شود`);
            });
        });
    }
};

// ==================== FORM HANDLERS ====================
const formHandlers = {
    handleFormSubmit: async function(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append('action', form.id.replace('-form', ''));
        
        try {
            utils.log('Submitting form:', form.id);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ذخیره...';
            
            const response = await utils.fetchWithTimeout(config.apiUrl, {
                method: 'POST',
                body: formData
            });
            
            if (response.success) {
                utils.showNotification('اطلاعات با موفقیت ذخیره شد');
                form.reset();
                
                // Reload section data if needed
                if (form.id === 'portfolio-form' || form.id === 'team-form' || form.id === 'article-form') {
                    dataLoader.loadSectionData(config.currentSection);
                }
            } else {
                utils.showNotification(response.message || 'خطا در ذخیره اطلاعات', 'error');
            }
        } catch(error) {
            utils.log('Form submit error:', error);
            utils.showNotification('خطا در ارتباط با سرور', 'error');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText || 'ذخیره';
            }
        }
    },
    
    handleFileInputChange: function(e) {
        const input = e.target;
        const label = input.nextElementSibling;
        
        if (input.files.length > 0) {
            if (input.files.length > 1) {
                label.innerHTML = `<i class="fas fa-check"></i> ${input.files.length} فایل انتخاب شد`;
            } else {
                label.innerHTML = `<i class="fas fa-check"></i> ${input.files[0].name}`;
            }
        } else {
            label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> انتخاب فایل';
        }
    }
};

// ==================== EVENT LISTENERS ====================
const eventListeners = {
    initNavLinks: function() {
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links and sections
                DOM.navLinks.forEach(el => el.classList.remove('active'));
                DOM.contentSections.forEach(el => el.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding section
                const sectionId = link.getAttribute('data-section');
                document.getElementById(sectionId).classList.add('active');
                
                // Load section data with debounce
                utils.debounce(() => {
                    dataLoader.loadSectionData(sectionId);
                }, 200)();
            });
        });
    },
    
    initLogoutButton: function() {
        if (DOM.logoutBtn) {
            DOM.logoutBtn.addEventListener('click', async () => {
                const confirmed = await utils.confirmAction('آیا مطمئن هستید که می‌خواهید خارج شوید؟');
                if (confirmed) {
                    utils.showNotification('با موفقیت خارج شدید.');
                    // window.location.href = 'login.html';
                }
            });
        }
    },
    
    initForms: function() {
        DOM.forms.forEach(form => {
            form.addEventListener('submit', utils.debounce(formHandlers.handleFormSubmit, 300));
        });
    },
    
    initFileInputs: function() {
        DOM.fileInputs.forEach(input => {
            input.addEventListener('change', formHandlers.handleFileInputChange);
        });
    },
    
    initModalEvents: function() {
        // Close modal buttons
        DOM.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', modal.hide);
        });
        
        // Close modal when clicking outside
        if (DOM.messageModal) {
            DOM.messageModal.addEventListener('click', (e) => {
                if (e.target === DOM.messageModal) {
                    modal.hide();
                }
            });
        }
        
        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.messageModal && DOM.messageModal.classList.contains('show')) {
                modal.hide();
            }
        });
    }
};

// ==================== INITIALIZATION ====================
function init() {
    utils.log('Initializing admin panel...');
    
    // Initialize event listeners
    eventListeners.initNavLinks();
    eventListeners.initLogoutButton();
    eventListeners.initForms();
    eventListeners.initFileInputs();
    eventListeners.initModalEvents();
    
    // Load initial data
    dataLoader.loadSectionData(config.currentSection);
    
    utils.log('Admin panel initialized');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}