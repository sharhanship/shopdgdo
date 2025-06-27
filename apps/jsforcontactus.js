document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // تولید و ذخیره CSRF Token
    if (!sessionStorage.getItem('csrf_token')) {
        const csrfToken = generateCsrfToken();
        sessionStorage.setItem('csrf_token', csrfToken);
        // ذخیره در session سرور (برای PHP)
        fetch('./apis/set_csrf.php', {
            method: 'POST',
            body: JSON.stringify({csrf_token: csrfToken}),
            headers: {'Content-Type': 'application/json'}
        }).catch(console.error);
    }

    // اضافه کردن CSRF Token به فرم
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    csrfInput.value = sessionStorage.getItem('csrf_token');
    contactForm.appendChild(csrfInput);

    // اعتبارسنجی شماره تلفن
    const phoneInput = contactForm.querySelector('input[name="number"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            this.value = value;
        });
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'در حال ارسال...';

        // اعتبارسنجی شماره تلفن قبل از ارسال
        const phone = formData.get('number')?.toString().replace(/\D/g, '') || '';
        if (phone.length !== 11 || !phone.startsWith('09')) {
            showAlert('error', 'شماره تلفن باید 11 رقمی و با 09 شروع شود');
            submitBtn.disabled = false;
            submitBtn.textContent = 'ارسال پیام';
            return;
        }

        fetch('./apis/contactusapi.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('success', data.message);
                contactForm.reset();
            } else {
                showAlert('error', data.message);
                // نمایش خطاهای فیلدها
                if (data.errors) {
                    for (const [field, error] of Object.entries(data.errors)) {
                        const input = contactForm.querySelector(`[name="${field}"]`);
                        if (input) {
                            input.classList.add('is-invalid');
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'invalid-feedback';
                            errorDiv.textContent = error;
                            input.parentNode.appendChild(errorDiv);
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('error', 'خطا در ارتباط با سرور');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ارسال پیام';
        });
    });

    function generateCsrfToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    function showAlert(type, message) {
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
        
        // بسته شدن خودکار
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
        
        // بستن با کلیک
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.remove();
        });
    }
});