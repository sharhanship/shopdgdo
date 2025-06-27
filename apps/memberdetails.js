document.addEventListener('DOMContentLoaded', function() {
    loadMemberDetails();
});

async function loadMemberDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const memberId = urlParams.get('id');
        
        if (!memberId) throw new Error('شناسه عضو مشخص نشده');

        const response = await fetch(`../apis/teamapi.php?member_id=${memberId}`);
        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'خطا در دریافت داده');
        }

        const member = result.data;
        
        // پر کردن اطلاعات عضو
        document.querySelector('.avatar').src = `../content/team/${member.avatar || 'default.jpg'}`;
        document.querySelector('.header-info h1').textContent = `${member.first_name} ${member.last_name}`;
        document.querySelector('.header-info h2').textContent = member.role;
        document.querySelector('.contact-info').innerHTML = `
            <span><i class="fas fa-envelope"></i> ${member.email || '---'}</span>
            <span><i class="fas fa-phone"></i> ${member.phone || '---'}</span>
        `;
        
        // بخش درباره من
        document.querySelector('.about p').textContent = member.about || 'اطلاعاتی وارد نشده است';
        
        // بخش پروژه‌ها
        const projectsContainer = document.querySelector('.projects');
        projectsContainer.innerHTML = '<h3><i class="fas fa-project-diagram"></i> پروژه‌ها</h3>';
        
        if (member.projects) {
            try {
                const projects = JSON.parse(member.projects);
                projects.forEach(proj => {
                    projectsContainer.innerHTML += `
                        <div class="project-item">
                            <h4>${proj.title || 'پروژه بدون عنوان'}</h4>
                            <p>${proj.description || 'توضیحاتی وجود ندارد'}</p>
                        </div>
                    `;
                });
            } catch {
                projectsContainer.innerHTML += `<p class="no-projects">${member.projects}</p>`;
            }
        } else {
            projectsContainer.innerHTML += '<p class="no-projects">پروژه‌ای ثبت نشده است</p>';
        }

        // لینک‌های اجتماعی
        if (member.social_links) {
            try {
                const socialLinks = JSON.parse(member.social_links);
                let socialHtml = '<div class="social-links">';
                for (const [platform, url] of Object.entries(socialLinks)) {
                    if (url) {
                        socialHtml += `<a href="${url}" target="_blank"><i class="fab fa-${platform}"></i></a>`;
                    }
                }
                socialHtml += '</div>';
                document.querySelector('.header-info').insertAdjacentHTML('beforeend', socialHtml);
            } catch (e) {
                console.error('Error parsing social links:', e);
            }
        }

    } catch (error) {
        console.error('Error:', error);
        showError('خطا در بارگذاری اطلاعات عضو');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.querySelector('.resume-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}