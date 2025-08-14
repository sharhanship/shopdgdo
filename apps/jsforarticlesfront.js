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
});



document.addEventListener('DOMContentLoaded', function() {
    // دریافت ID مقاله از URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        showError('شناسه مقاله مشخص نشده است');
        return;
    }

    // دریافت اطلاعات مقاله از سرور
    fetch(`../apis/get_article_details.php?id=${articleId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('خطا در دریافت داده‌ها');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // نمایش اطلاعات مقاله در صفحه
                displayArticle(data.article);
            } else {
                showError(data.message || 'مقاله مورد نظر یافت نشد');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('خطا در ارتباط با سرور');
        });

    // تابع برای نمایش اطلاعات مقاله
    function displayArticle(article) {
        // نمایش عنوان مقاله
        const titleElement = document.querySelector('.article-main-title .title-gradient');
        if (titleElement && article.title) {
            titleElement.textContent = article.title;
        }

        // نمایش نکته مهم
        const keyPointElement = document.querySelector('.info-box-content');
        if (keyPointElement && article.key_point) {
            keyPointElement.textContent = article.key_point;
        }

        // نمایش محتوای مقاله
        const contentElement = document.querySelector('#useState-hook .section-content p');
        if (contentElement && article.content) {
            contentElement.textContent = article.content;
        }
    }

    // تابع برای نمایش خطا
    function showError(message) {
        alert(message);
        // یا می‌توانید یک عنصر خطا در صفحه ایجاد کنید
        // window.location.href = '../pages/explore-articles.html'; // بازگشت به صفحه مقالات
    }
});