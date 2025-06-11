/**
 * =============================================
 *                  article.js
 * =============================================
 * مدیریت کدهای مربوط به مقالات شامل:
 * - سیستم کپی کردن کدهای نمونه
 * - سیستم امتیازدهی به مقالات
 * - نمایش نوتیفیکیشن‌های تعاملی
 * 
 * @created 2023-05-15
 */

// منتظر می‌مانیم تا DOM کاملاً بارگذاری شود
document.addEventListener('DOMContentLoaded', function() {
  // ██████████████████████████████████████████████
  // ███ سیستم کپی کردن کدها (Copy to Clipboard) ███
  // ██████████████████████████████████████████████
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      // یافتن عنصر کد مربوطه در نزدیکترین والد با کلاس code-block-container
      const codeBlock = this.closest('.code-block-container').querySelector('code');
      
      // استخراج متن خالص از بلوک کد (بدون تگ‌های HTML)
      const textToCopy = codeBlock.textContent;
      
      // استفاده از Clipboard API برای کپی کردن متن
      navigator.clipboard.writeText(textToCopy).then(() => {
        // نمایش پیام موفقیت در صورت کپی موفق
        showNotification('کد با موفقیت کپی شد!');
      }).catch(err => {
        // نمایش خطا در کنسول در صورت مشکل
        console.error('خطا در کپی کردن: ', err);
      });
    });
  });

  // ██████████████████████████████████████████████
  // ███ سیستم امتیازدهی (Star Rating System) ███
  // ██████████████████████████████████████████████
  const stars = document.querySelectorAll('.rating-stars i');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      // دریافت مقدار امتیاز از data-attribute
      const rating = this.getAttribute('data-rating');
      
      // ریست کردن تمام ستاره‌ها به حالت خالی (far = ستاره خالی در FontAwesome)
      stars.forEach(s => {
        s.classList.remove('fas'); // حذف آیکون پر
        s.classList.add('far');   // اضافه کردن آیکون خالی
      });
      
      // پر کردن ستاره‌ها تا امتیاز انتخاب شده
      for (let i = 0; i < rating; i++) {
        stars[i].classList.remove('far'); // حذف آیکون خالی
        stars[i].classList.add('fas');    // اضافه کردن آیکون پر
      }
      
      // نمایش پیام امتیازدهی (در حالت واقعی اینجا درخواست AJAX به سرور ارسال می‌شد)
      showNotification(`امتیاز ${rating} از 5 ثبت شد!`);
    });
  });

  /**
   * ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
   * ▒▒ نمایش نوتیفیکیشن موقت (Flash Message) ▒▒
   * ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
   * 
   * @param {string} message - پیامی که باید نمایش داده شود
   * @returns {void}
   * 
   * @example
   * showNotification('عملیات با موفقیت انجام شد!');
   */
  function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
      // تنظیم متن پیام
      notification.querySelector('.notification-message').textContent = message;
      
      // نمایش نوتیفیکیشن با اضافه کردن کلاس show
      notification.classList.add('show');
      
      // مخفی کردن خودکار پس از 3 ثانیه (3000 میلی‌ثانیه)
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
 * اسکریپت‌های اصلی و عمومی سایت شامل:
 * - دکمه بازگشت به بالای صفحه
 * - پیکربندی انیمیشن ذرات (particles.js)
 * - مدیریت رویدادهای عمومی
 * 
 * @created 2023-05-10
 */

// منتظر می‌مانیم تا DOM کاملاً بارگذاری شود
document.addEventListener('DOMContentLoaded', function() {
  // ██████████████████████████████████████████████
  // ███ دکمه بازگشت به بالا (Back to Top) ███
  // ██████████████████████████████████████████████
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    // افزودن رویداد اسکرول برای نمایش/مخفی کردن دکمه
    window.addEventListener('scroll', () => {
      // نمایش دکمه فقط وقتی کاربر بیش از 300px اسکرول کرده باشد
      backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    });

    // افزودن رویداد کلیک برای اسکرول نرم به بالا
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault(); // جلوگیری از رفتار پیش‌فرض لینک
      
      // اسکرول نرم به بالای صفحه با رفتار smooth
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ██████████████████████████████████████████████
  // ███ پیکربندی particles.js (انیمیشن ذرات) ███
  // ██████████████████████████████████████████████
  if (window.particlesJS) {
    /**
     * پیکربندی پیشرفته برای کتابخانه particles.js
     * @see https://github.com/VincentGarreau/particles.js/
     */
    particlesJS('particles-js', {
      "particles": {
        "number": { 
          "value": 80  // تعداد ذرات در صفحه (80 عدد)
        },
        "color": { 
          "value": "#ffffff"  // رنگ ذرات (سفید)
        },
        "shape": { 
          "type": "circle"  // شکل ذرات (دایره‌ای)
        },
        "opacity": { 
          "value": 0.5,  // شفافیت پایه (50%)
          "random": true,  // شفافیت تصادفی بین ذرات
          "anim": { 
            "enable": true,  // فعال کردن انیمیشن شفافیت
            "speed": 1  // سرعت انیمیشن
          }
        },
        "size": {
          "value": 3,  // اندازه پایه ذرات (3px)
          "random": true,  // اندازه تصادفی بین ذرات
          "anim": { 
            "enable": true,  // فعال کردن انیمیشن اندازه
            "speed": 2  // سرعت انیمیشن
          }
        },
        "line_linked": {
          "enable": true,  // فعال کردن اتصال خطی بین ذرات
          "distance": 150,  // حداکثر فاصله برای اتصال خطی
          "color": "#ffffff",  // رنگ خطوط اتصال
          "opacity": 0.4,  // شفافیت خطوط (40%)
          "width": 1  // ضخامت خطوط (1px)
        },
        "move": {
          "enable": true,  // فعال کردن حرکت ذرات
          "speed": 1,  // سرعت حرکت پایه
          "direction": "none",  // جهت حرکت (تصادفی)
          "random": true  // حرکت کاملاً تصادفی
        }
      },
      "interactivity": {
        "events": {
          "onhover": { 
            "enable": true,  // فعال کردن تعامل هنگام هاور
            "mode": "grab"  // حالت جذب ذرات
          },
          "onclick": { 
            "enable": true,  // فعال کردن تعامل هنگام کلیک
            "mode": "push"  // حالت پرتاب ذرات
          },
          "resize": true  // واکنش به تغییر اندازه صفحه
        },
        "modes": {
          "grab": { 
            "distance": 140  // شعاع جذب ذرات هنگام هاور
          },
          "push": { 
            "particles_nb": 4  // تعداد ذرات تولیدی هنگام کلیک
          }
        }
      },
      "retina_detect": true  // تشخیص صفحه‌های با تراکم پیکسل بالا (رتینا)
    });
  }
});