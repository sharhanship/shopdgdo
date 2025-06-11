
    // ██████████████████████████████████████████████████████████████
    // ███████ در انتهای بدنه صفحه یا در یک فایل JS جداگانه███████
    // ██████████████████████████████████████████████████████████████
    
document.addEventListener('DOMContentLoaded', function() {
  fetch('/pages/nav-down.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => {
      console.error('خطا در بارگذاری فوتر:', error);
    });
});