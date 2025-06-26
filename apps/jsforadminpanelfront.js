

// ================== بخش جدید: سیستم نمایش پیام‌های سفارشی ==================
function addCustomMessageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-message-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            font-family: 'Vazir', sans-serif;
        }
        
        .custom-message {
            padding: 15px 20px;
            margin-bottom: 15px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            animation: slideIn 0.3s forwards;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            direction: rtl;
            text-align: right;
        }
        
        .custom-message.success {
            background-color: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        
        .custom-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        
        .custom-message.warning {
            background-color: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
        }
        
        .custom-message.info {
            background-color: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
        }
        
        .custom-message .message-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .custom-message .close-btn {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: inherit;
            margin-left: 10px;
        }
        
        @keyframes slideIn {
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// اضافه کردن استایل‌ها به صفحه
addCustomMessageStyles();

/**
 * نمایش پیغام سفارشی
 * @param {string} type - نوع پیغام (success, error, warning, info)
 * @param {string} message - متن پیغام
 * @param {number} duration - مدت زمان نمایش به میلی‌ثانیه (0 برای نمایش دائمی)
 */

function showCustomMessage(type, message, duration = 5000) {
    // ایجاد کانتینر پیغام‌ها اگر وجود نداشته باشد
    let container = document.querySelector('.custom-message-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'custom-message-container';
        document.body.appendChild(container);
    }

    // ایجاد پیغام جدید
    const messageElement = document.createElement('div');
    messageElement.className = `custom-message ${type}`;

    // آیکون بر اساس نوع پیغام
    let icon;
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        default:
            icon = '';
    }

    messageElement.innerHTML = `
        <div class="message-content">
            ${icon}
            <span class="message-text">${message}</span>
        </div>
        <button class="close-btn">&times;</button>
    `;

    // اضافه کردن پیغام به کانتینر
    container.appendChild(messageElement);

    // بستن پیغام با کلیک روی دکمه
    const closeBtn = messageElement.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        messageElement.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => messageElement.remove(), 300);
    });

    // بستن خودکار پیغام پس از مدت مشخص
    if (duration > 0) {
        setTimeout(() => {
            messageElement.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => messageElement.remove(), 300);
        }, duration);
    }
}

// ================== سیستم تایید سفارشی ==================
function addConfirmModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-confirm-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            font-family: 'Vazir', sans-serif;
        }
        
        .custom-confirm-content {
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            text-align: center;
            direction: rtl;
        }
        
        .custom-confirm-message {
            margin-bottom: 20px;
            font-size: 16px;
            color: #333;
        }
        
        .custom-confirm-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .custom-confirm-btn {
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .custom-confirm-btn.confirm {
            background-color: #dc3545;
            color: white;
        }
        
        .custom-confirm-btn.cancel {
            background-color: #6c757d;
            color: white;
        }
        
        .custom-confirm-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// اضافه کردن استایل‌های مودال تایید
addConfirmModalStyles();

/**
 * نمایش تاییدیه سفارشی
 * @param {string} message - متن سوال
 * @returns {Promise<boolean>} - نتیجه تایید کاربر
 */
async function showCustomConfirm(message) {
    // ایجاد عناصر مودال
    const modal = document.createElement('div');
    modal.className = 'custom-confirm-modal';
    modal.innerHTML = `
        <div class="custom-confirm-content">
            <div class="custom-confirm-message">
                <i class="fas fa-question-circle" style="color:#dc3545;font-size:24px;margin-left:8px;"></i>
                ${message}
            </div>
            <div class="custom-confirm-buttons">
                <button class="custom-confirm-btn confirm">تایید</button>
                <button class="custom-confirm-btn cancel">انصراف</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // برگشت نتیجه به صورت Promise
    return new Promise((resolve) => {
        const confirmBtn = modal.querySelector('.confirm');
        const cancelBtn = modal.querySelector('.cancel');

        confirmBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            resolve(false);
        });
    });
}

// ================== اصلاح تابع sendRequest ==================
async function sendRequest(action, data = {}, method = 'POST', showDefaultMessage = false) {
    try {
        let url = '../apis/adminpanelapi.php';
        let options = {
            method: method,
            headers: {
                'Accept': 'application/json'
            }
        };

        if (method === 'GET') {
            const params = new URLSearchParams();
            params.append('action', action);
            for (const key in data) {
                params.append(key, data[key]);
            }
            url += `?${params.toString()}`;
        } else {
            const formData = new FormData();
            formData.append('action', action);

            for (const key in data) {
                if (data[key] instanceof FileList) {
                    for (let i = 0; i < data[key].length; i++) {
                        formData.append(`${key}[]`, data[key][i]);
                    }
                } else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }

            options.body = formData;
        }

        const response = await fetch(url, options);

        // بررسی وضعیت پاسخ
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || 'خطا در ارتباط با سرور';
            showCustomMessage('error', errorMessage);
            throw new Error(errorMessage);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'عملیات ناموفق بود');
        }

        if (showDefaultMessage && result.message) {
            showCustomMessage('success', result.message);
        }

        return result;
    } catch (error) {
        console.error('Error in sendRequest:', error);
        showCustomMessage('error', error.message || 'خطای ناشناخته رخ داد');
        throw error;
    }
}

// تابع اصلاح شده برای بارگذاری داده‌ها از سرور
async function loadData(section) {
    try {
        let action;

        switch (section) {
            case 'messages-section':
                action = 'get_messages';
                break;
            case 'about-section':
                action = 'get_about';
                break;
            case 'portfolio-section':
                action = 'get_portfolio';
                break;
            case 'team-section':
                action = 'get_team';
                break;
            case 'articles-section':
                action = 'get_articles';
                break;
            default:
                return;
        }

        // تغییر به GET و ارسال بدون body
        const response = await sendRequest(action, {}, 'GET');
        return response.data;
    } catch (error) {
        console.error('Error in loadData:', error);
        throw error;
    }
}

// مدیریت پیام‌ها
function setupMessagesSection() {
    const messagesSection = document.getElementById('messages-section');
    if (!messagesSection) return;

    // بارگذاری پیام‌ها از سرور
    async function loadMessages() {
        try {
            const messages = await loadData('messages-section');
            const tbody = messagesSection.querySelector('tbody');
            tbody.innerHTML = '';

            messages.forEach((message, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.phone}</td>
                    <td>${message.subject}</td>
                    <td>
                        <span class="message-preview">${message.message.substring(0, 50)}...</span>
                        <span class="view-more" data-fulltext="${message.message}">مشاهده بیشتر</span>
                    </td>
                    <td><button class="delete-btn" data-id="${message.id}"><i class="fas fa-trash"></i> حذف</button></td>
                `;
                tbody.appendChild(tr);
            });

            // افزودن رویداد برای دکمه‌های حذف
            messagesSection.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const isConfirmed = await showCustomConfirm('آیا از حذف این پیام مطمئن هستید؟');
                    if (isConfirmed) {
                        try {
                            await sendRequest('delete_message', { id: btn.dataset.id }, 'POST', false);
                            showCustomMessage('success', 'پیام با موفقیت حذف شد');
                            await loadMessages();
                        } catch (error) {
                            console.error('Error deleting message:', error);
                        }
                    }
                });
            });

            // افزودن رویداد برای مشاهده کامل پیام
            messagesSection.querySelectorAll('.view-more').forEach(span => {
                span.addEventListener('click', () => {
                    const modal = document.getElementById('messageModal');
                    const fullText = span.dataset.fulltext;
                    document.getElementById('fullMessageText').textContent = fullText;
                    modal.style.display = 'block';
                });
            });

        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    // بستن مودال
    const modal = messagesSection.querySelector('.modal');
    if (modal) {
        modal.querySelector('.close-modal, .modal-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // بارگذاری اولیه پیام‌ها
    loadMessages();
}

// مدیریت بخش درباره ما
function setupAboutSection() {
    const aboutSection = document.getElementById('about-section');
    if (!aboutSection) return;

    const aboutForm = aboutSection.querySelector('#about-form');
    if (!aboutForm) return;

    // بارگذاری اطلاعات درباره ما
    async function loadAboutData() {
        try {
            const aboutData = await loadData('about-section');

            if (aboutData) {
                aboutForm.querySelector('#description').value = aboutData.description || '';
                aboutForm.querySelector('#work_experience').value = aboutData.work_experience || '';
                aboutForm.querySelector('#completed_projects').value = aboutData.completed_projects || '';
                aboutForm.querySelector('#happy_clients').value = aboutData.happy_clients || '';
            }
        } catch (error) {
            console.error('Error loading about data:', error);
        }
    }

    // ارسال فرم درباره ما
    aboutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            description: aboutForm.querySelector('#description').value,
            work_experience: aboutForm.querySelector('#work_experience').value,
            completed_projects: aboutForm.querySelector('#completed_projects').value,
            happy_clients: aboutForm.querySelector('#happy_clients').value
        };

        try {
            await sendRequest('save_about', formData);
            showCustomMessage('success', 'اطلاعات درباره ما با موفقیت ذخیره شد');
        } catch (error) {
            console.error('Error saving about data:', error);
        }
    });

    // بارگذاری اولیه داده‌ها
    loadAboutData();
}

function setupPortfolioSection() {
    const portfolioSection = document.getElementById('portfolio-section');
    if (!portfolioSection) return;

    const portfolioForm = portfolioSection.querySelector('#portfolio-form');
    const portfolioGrid = portfolioSection.querySelector('.portfolio-grid');

    // بارگذاری نمونه کارها
    async function loadPortfolio() {
        try {
            const portfolioItems = await loadData('portfolio-section');
            portfolioGrid.innerHTML = '';

            portfolioItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'portfolio-card';

                const categoryClass = item.category === 'frontend' ? 'frontend' :
                    item.category === 'backend' ? 'backend' : 'fullstack';

                card.innerHTML = `
                    <div class="portfolio-img">
                        ${item.images && item.images.length ?
                        `<img src="../content/uploads/${item.images[0]}" alt="${item.name}">` :
                        `<i class="fas fa-image"></i>`}
                    </div>
                    <div class="portfolio-info">
                        <h3 class="portfolio-title">${item.name}</h3>
                        <span class="portfolio-category ${categoryClass}">
                            ${item.category === 'frontend' ? 'فرانت‌اند' :
                        item.category === 'backend' ? 'بک‌اند' : 'فول استک'}
                        </span>
                        <div class="portfolio-actions">
                            <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i> حذف</button>
                        </div>
                    </div>
                `;

                portfolioGrid.appendChild(card);
            });

            portfolioSection.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const isConfirmed = await showCustomConfirm('آیا از حذف این پروژه مطمئن هستید؟');
                    if (isConfirmed) {
                        try {
                            await sendRequest('delete_portfolio', { id: btn.dataset.id }, 'POST', false);
                            showCustomMessage('success', 'پروژه با موفقیت حذف شد');
                            await loadPortfolio();
                        } catch (error) {
                            console.error('Error deleting portfolio item:', error);
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Error loading portfolio:', error);
        }
    }

    portfolioForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(portfolioForm);
            formData.append('action', 'add_portfolio');

            console.log('آماده‌سازی داده‌ها برای ارسال...');

            const response = await fetch('../apis/adminpanelapi.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `خطای سرور: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'خطا در ثبت نمونه کار');
            }

            showCustomMessage('success', 'نمونه کار با موفقیت ذخیره شد');
            portfolioForm.reset();
            await loadPortfolio();
        } catch (error) {
            console.error('خطا:', error);
            showCustomMessage('error', error.message || 'خطا در ارتباط با سرور');
        }
    });

    // نمایش نام فایل‌های انتخاب شده
    portfolioSection.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const label = input.nextElementSibling;
            if (input.files && input.files.length > 0) {
                if (input.multiple) {
                    label.innerHTML = `<i class="fas fa-check-circle"></i> ${input.files.length} فایل انتخاب شده`;
                } else {
                    label.innerHTML = `<i class="fas fa-check-circle"></i> ${input.files[0].name}`;
                }
            } else {
                label.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> ${label.textContent.trim()}`;
            }
        });
    });

    loadPortfolio();
}

// مدیریت تیم
function setupTeamSection() {
    const teamSection = document.getElementById('team-section');
    if (!teamSection) return;

    const teamForm = teamSection.querySelector('#team-form');
    const teamGrid = teamSection.querySelector('.team-grid');

    async function loadTeamMembers() {
        try {
            const teamMembers = await loadData('team-section');
            teamGrid.innerHTML = '';

            teamMembers.forEach(member => {
                const card = document.createElement('div');
                card.className = 'team-card';

                // تعیین کلاس نقش و متن فارسی
                const roleClass = member.role === 'frontend' ? 'frontend' :
                    member.role === 'backend' ? 'backend' :
                        member.role === 'designer' ? 'designer' : 'editor';

                const roleText = member.role === 'frontend' ? 'فرانت‌اند' :
                    member.role === 'backend' ? 'بک‌اند' :
                        member.role === 'designer' ? 'طراح' : 'تدوین‌گر';

                card.innerHTML = `
                <div class="team-avatar">
                    ${member.avatar ?
                        `<img src="../content/team/${member.avatar}" alt="${member.first_name} ${member.last_name}">` :
                        `<i class="fas fa-user"></i>`}
                </div>
                <h3 class="team-name">${member.first_name} ${member.last_name}</h3>
                <span class="team-role ${roleClass}">${roleText}</span>
                ${member.resume_file ?
                        `<a href="../content/resumes/${member.resume_file}" target="_blank" class="resume-link">
                        <i class="fas fa-file-pdf"></i> مشاهده رزومه
                    </a>` : ''}
                <div class="portfolio-actions">
                    <button class="delete-btn" data-id="${member.id}"><i class="fas fa-trash"></i> حذف عضو</button>
                </div>
            `;

                teamGrid.appendChild(card);
            });

            // افزودن رویداد برای دکمه‌های حذف
            teamSection.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const isConfirmed = await showCustomConfirm('آیا از حذف این عضو تیم مطمئن هستید؟');
                    if (isConfirmed) {
                        try {
                            await sendRequest('delete_team_member', { id: btn.dataset.id }, 'POST', false);
                            showCustomMessage('success', 'عضو تیم با موفقیت حذف شد');
                            await loadTeamMembers();
                        } catch (error) {
                            console.error('Error deleting team member:', error);
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Error loading team members:', error);
            showCustomMessage('error', 'خطا در بارگذاری اعضای تیم');
        }
    }

    // در تابع setupTeamSection این کد را اضافه کنید:
    const resumeInput = teamSection.querySelector('#member-resume');
    if (resumeInput) {
        resumeInput.addEventListener('change', (e) => {
            const label = resumeInput.nextElementSibling;
            if (resumeInput.files && resumeInput.files.length > 0) {
                label.innerHTML = `<i class="fas fa-check-circle"></i> ${resumeInput.files[0].name}`;
                label.setAttribute('data-file-name', resumeInput.files[0].name);
            } else {
                label.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> انتخاب فایل PDF`;
                label.removeAttribute('data-file-name');
            }
        });
    }

    teamForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(teamForm);

        // اضافه کردن action به FormData
        formData.append('action', 'add_team_member');

        // دیباگ محتویات FormData
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
        }

        try {
            const response = await fetch('../apis/adminpanelapi.php', {
                method: 'POST',
                body: formData,
                // توجه: نباید Content-Type را تنظیم کنید وقتی از FormData استفاده می‌کنید
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'خطای سرور');
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'عملیات ناموفق بود');
            }

            showCustomMessage('success', 'عضو جدید با موفقیت به تیم اضافه شد');
            teamForm.reset();
            await loadTeamMembers();
        } catch (error) {
            console.error('Error adding team member:', error);
            showCustomMessage('error', error.message || 'خطا در ارتباط با سرور');
        }
    });

    // نمایش نام فایل انتخاب شده برای آواتار
    const avatarInput = teamSection.querySelector('#member-avatar');
    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const label = avatarInput.nextElementSibling;
            if (avatarInput.files && avatarInput.files.length > 0) {
                label.innerHTML = `<i class="fas fa-check-circle"></i> ${avatarInput.files[0].name}`;
            } else {
                label.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> ${label.textContent.trim()}`;
            }
        });
    }

    // بارگذاری اولیه اعضای تیم
    loadTeamMembers();
}

// مدیریت مقالات
function setupArticlesSection() {
    const articlesSection = document.getElementById('articles-section');
    if (!articlesSection) return;

    const articleForm = articlesSection.querySelector('#article-form');
    const articlesList = articlesSection.querySelector('.articles-list');

    // بارگذاری مقالات
    async function loadArticles() {
        try {
            const articles = await loadData('articles-section');
            articlesList.innerHTML = '';

            articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.className = 'article-item';

                // تبدیل نام دسته‌بندی به فارسی
                let categoryName;
                switch (article.category) {
                    case 'programming': categoryName = 'برنامه‌نویسی'; break;
                    case 'technology': categoryName = 'تکنولوژی'; break;
                    case 'design': categoryName = 'طراحی'; break;
                    case 'ai': categoryName = 'هوش مصنوعی'; break;
                    default: categoryName = article.category;
                }

                articleItem.innerHTML = `
                    <div class="article-info">
                        <h3>${article.title}</h3>
                        <span class="article-category">${categoryName}</span>
                    </div>
                    <div class="article-actions">
                        <button class="delete-btn" data-id="${article.id}"><i class="fas fa-trash"></i> حذف</button>
                    </div>
                `;

                articlesList.appendChild(articleItem);
            });

            // افزودن رویداد برای دکمه‌های حذف
            articlesSection.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const isConfirmed = await showCustomConfirm('آیا از حذف این مقاله مطمئن هستید؟');
                    if (isConfirmed) {
                        try {
                            await sendRequest('delete_article', { id: btn.dataset.id }, 'POST', false);
                            showCustomMessage('success', 'مقاله با موفقیت حذف شد');
                            await loadArticles();
                        } catch (error) {
                            console.error('Error deleting article:', error);
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Error loading articles:', error);
        }
    }

    // ارسال فرم مقاله جدید
    if (articleForm) {
        articleForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                title: articleForm.querySelector('#article-title').value,
                category: articleForm.querySelector('#article-category').value,
                key_point: articleForm.querySelector('#article-keypoint').value,
                content: articleForm.querySelector('#article-content').value
            };

            try {
                await sendRequest('add_article', formData);
                showCustomMessage('success', 'مقاله جدید با موفقیت منتشر شد');
                articleForm.reset();
                await loadArticles();
            } catch (error) {
                console.error('Error adding article:', error);
            }
        });
    }

    // بارگذاری اولیه مقالات
    loadArticles();
}

// مدیریت تغییر بخش‌ها
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // حذف کلاس active از همه لینک‌ها
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // اضافه کردن کلاس active به لینک انتخاب شده
            link.classList.add('active');

            // مخفی کردن همه بخش‌ها
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // نمایش بخش انتخاب شده
            const sectionId = link.dataset.section;
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // بررسی توکن
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const savedToken = localStorage.getItem('admin_token');
    
    if (!token || token !== savedToken) {
        alert('دسترسی غیرمجاز! لطفاً از طریق صفحه لاگین وارد شوید.');
        window.location.href = '../';
        return;
    }
    
    // مدیریت دکمه خروج
    document.getElementById('logout-btn')?.addEventListener('click', function() {
        localStorage.removeItem('admin_token');
        window.location.href = '../';
    });
});

// مقداردهی اولیه زمانی که DOM کاملاً بارگذاری شد
document.addEventListener('DOMContentLoaded', () => {
    setupMessagesSection();
    setupAboutSection();
    setupPortfolioSection();
    setupTeamSection();
    setupArticlesSection();
    setupNavigation();

    // نمایش بخش پیام‌ها به صورت پیش‌فرض
    document.getElementById('messages-section').classList.add('active');
});