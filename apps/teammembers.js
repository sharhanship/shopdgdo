document.addEventListener('DOMContentLoaded', function() {
    loadTeamMembers();
});

async function loadTeamMembers() {
    try {
        const response = await fetch('../apis/teamapi.php');
        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'خطا در دریافت داده');
        }

        const membersGrid = document.querySelector('.team-members-grid');
        membersGrid.innerHTML = '';

        result.data.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card glass-card';
            card.dataset.category = member.role.toLowerCase().replace(' ', '-');
            
            const avatarPath = `../content/team/${member.avatar || 'default.jpg'}`;
            const resumePath = member.resume_file 
                ? `../apis/teamapi.php?download=true&id=${member.id}`
                : '#';

            card.innerHTML = `
                <div class="member-image-container">
                    <img src="${avatarPath}" alt="${member.first_name} ${member.last_name}" 
                         class="member-image" onerror="this.src='../content/team/default.jpg'">
                    <div class="image-border"></div>
                </div>
                <h2 class="member-name">${member.first_name} ${member.last_name}</h2>
                <p class="member-role">${member.role}</p>
                <div class="member-actions">
                    <a href="../pages/infomembersteam.html?id=${member.id}" class="resume-button">
                        <span>مشاهده رزومه</span>
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    ${member.resume_file ? `
                    <a href="${resumePath}" class="download-resume-button" download>
                        <span>دانلود رزومه</span>
                        <i class="fas fa-arrow-left"></i>
                    </a>` : ''}
                </div>
            `;
            
            membersGrid.appendChild(card);
        });

        initEffects();

    } catch (error) {
        console.error('Error:', error);
        showError('خطا در بارگذاری اعضا');
    }
}

function initEffects() {
    // انیمیشن کارت‌ها
    const cards = document.querySelectorAll('.member-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });

    // فیلترها
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            document.querySelectorAll('.member-card').forEach(card => {
                card.style.display = filter === 'all' || card.dataset.category === filter 
                    ? 'flex' : 'none';
            });
        });
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.querySelector('.team-explorer-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}