document.addEventListener('DOMContentLoaded', function() {
    // Copy code functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const code = this.closest('.code-block').querySelector('code').textContent;
            navigator.clipboard.writeText(code);
            
            // Show notification
            const notification = document.getElementById('notification');
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 2000);
        });
    });
});