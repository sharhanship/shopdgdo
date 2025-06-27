document.addEventListener('DOMContentLoaded', function() {
    fetchAboutData();

    async function fetchAboutData() {
        try {
            const response = await fetch('./apis/aboutusapi.php');
            const data = await response.json();

            if (data.status === 'success') {
                updateAboutSection(data.data);
            } else {
                console.error('Error:', data.message);
                showAlert('error', 'خطا در دریافت اطلاعات درباره ما');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            showAlert('error', 'خطا در ارتباط با سرور');
        }
    }

    function updateAboutSection(data) {
        // به‌روزرسانی متن درباره ما
        const aboutText = document.querySelector('.about-text p');
        if (aboutText && data.description) {
            aboutText.textContent = data.description;
        }

        // به‌روزرسانی آمار و ارقام
        const statsItems = document.querySelectorAll('.stats-item');
        if (statsItems.length >= 4) {
            statsItems[0].querySelector('.stats-number').textContent = `${data.work_experience}+`;
            statsItems[1].querySelector('.stats-number').textContent = data.completed_projects;
            statsItems[2].querySelector('.stats-number').textContent = data.happy_clients;
            statsItems[3].querySelector('.stats-number').textContent = data.published_articles;
        }
    }

    function showAlert(type, message) {
        // پیاده‌سازی مشابه بخش تماس با ما
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert ${type}`;
        alertDiv.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">${type === 'success' ? '✓' : '✗'}</span>
                <span class="alert-message">${message}</span>
                <button class="alert-close">&times;</button>
            </div>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
        
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.remove();
        });
    }
});