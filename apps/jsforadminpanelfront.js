// Switch between sections
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all links and sections
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Show corresponding section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });    
});

// Logout button
document.querySelector('.logout-btn').addEventListener('click', function () {
    if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
        // Redirect to login page or perform logout
        alert('با موفقیت خارج شدید.');
        // window.location.href = 'login.html';
    }
});

// Delete buttons
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (confirm('آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟')) {
            // In a real app, you would send a request to the server here
            this.closest('tr, .portfolio-card, .team-card, .article-item').remove();
            alert('آیتم با موفقیت حذف شد.');
        }
    });
});

// Form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // In a real app, you would send the form data to the server here
        alert('اطلاعات با موفقیت ذخیره شد.');
        this.reset();
    });
});

// Comments button
document.querySelectorAll('.comments-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        alert('بخش مدیریت نظرات برای این مقاله نمایش داده می‌شود.');
        // You would typically show a modal with comments here
    });
});

// Modal نمایش متن کامل پیام
const messageModal = document.getElementById('messageModal');
const fullMessageText = document.getElementById('fullMessageText');
const viewMoreButtons = document.querySelectorAll('.view-more');
const closeModalButtons = document.querySelectorAll('.close-modal, .modal-close-btn');

// تابع برای نمایش Modal
function showModal(message) {
    fullMessageText.textContent = message;
    messageModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// تابع برای بستن Modal
function closeModal() {
    messageModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// اضافه کردن event listener برای دکمه‌های مشاهده بیشتر
viewMoreButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        const fullMessage = this.getAttribute('data-fulltext');
        showModal(fullMessage);
    });
});

// اضافه کردن event listener برای دکمه‌های بستن Modal
closeModalButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// بستن Modal با کلیک خارج از محتوا
messageModal.addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// بستن Modal با کلید ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && messageModal.classList.contains('show')) {
        closeModal();
    }
});



// File input display
document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', function () {
        const label = this.nextElementSibling;
        if (this.files.length > 0) {
            if (this.files.length > 1) {
                label.innerHTML = `<i class="fas fa-check"></i> ${this.files.length} فایل انتخاب شد`;
            } else {
                label.innerHTML = `<i class="fas fa-check"></i> ${this.files[0].name}`;
            }
        } else {
            label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> انتخاب فایل';
        }
    });
});