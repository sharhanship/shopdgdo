/**
 * =============================================
 *                  article.js
 * =============================================
 * مدیریت کپی کردن کدها و سیستم امتیازدهی در مقالات
 */

document.addEventListener('DOMContentLoaded', function() {
  // ==================== سیستم کپی کردن کدها ====================
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      // یافتن بلوک کد مربوطه و محتوای آن
      const codeBlock = this.closest('.code-block-container').querySelector('code');
      const textToCopy = codeBlock.textContent;
      
      // عملیات کپی به کلیپ‌بورد
      navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('کد با موفقیت کپی شد!');
      }).catch(err => {
        console.error('خطا در کپی کردن: ', err);
      });
    });
  });

  // ==================== سیستم امتیازدهی ====================
  const stars = document.querySelectorAll('.rating-stars i');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = this.getAttribute('data-rating');
      
      // ریست کردن تمام ستاره‌ها به حالت خالی
      stars.forEach(s => {
        s.classList.remove('fas');
        s.classList.add('far');
      });
      
      // پر کردن ستاره‌ها تا امتیاز انتخاب شده
      for (let i = 0; i < rating; i++) {
        stars[i].classList.remove('far');
        stars[i].classList.add('fas');
      }
      
      // نمایش پیام امتیازدهی (در حالت واقعی به سرور ارسال می‌شود)
      showNotification(`امتیاز ${rating} از 5 ثبت شد!`);
    });
  });

  /**
   * تابع نمایش نوتیفیکیشن موقت
   * @param {string} message - پیام نمایشی
   */
  function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.querySelector('.notification-message').textContent = message;
      notification.classList.add('show');
      
      // مخفی کردن خودکار پس از 3 ثانیه
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }
});

/**
 * =============================================
 *                  main.js
 * =============================================
 * اسکریپت‌های اصلی سایت شامل:
 * - دکمه بازگشت به بالا
 * - پیکربندی particles.js
 */

document.addEventListener('DOMContentLoaded', function() {
  // ==================== دکمه بازگشت به بالا ====================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    // نمایش/مخفی کردن دکمه بر اساس موقعیت اسکرول
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    });

    // اسکرول نرم به بالای صفحه
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==================== پیکربندی particles.js ====================
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 80 },  // تعداد ذرات
        "color": { "value": "#ffffff" },  // رنگ سفید
        "shape": { "type": "circle" },  // شکل دایره‌ای
        "opacity": { 
          "value": 0.5,  // نیمه شفاف
          "random": true,
          "anim": { "enable": true, "speed": 1 }
        },
        "size": {
          "value": 3,  // اندازه متوسط
          "random": true,
          "anim": { "enable": true, "speed": 2 }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,  // فاصله اتصال خطوط
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1,  // سرعت حرکت آهسته
          "direction": "none",
          "random": true
        }
      },
      "interactivity": {
        "events": {
          "onhover": { "enable": true, "mode": "grab" },  // حالت جذب هنگام هاور
          "onclick": { "enable": true, "mode": "push" },  // حالت پرتاب هنگام کلیک
          "resize": true
        },
        "modes": {
          "grab": { "distance": 140 },  // شعاع جذب
          "push": { "particles_nb": 4 }  // تعداد ذرات تولیدی هنگام کلیک
        }
      },
      "retina_detect": true  // پشتیبانی از صفحه‌های رتینا
    });
  }
});