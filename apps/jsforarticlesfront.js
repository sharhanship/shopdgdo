// article.js
document.addEventListener('DOMContentLoaded', function() {
  // Copy Code Blocks
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', function() {
      const codeBlock = this.closest('.code-block-container').querySelector('code');
      const textToCopy = codeBlock.textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('کد با موفقیت کپی شد!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });

  // Rating System
  const stars = document.querySelectorAll('.rating-stars i');
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = this.getAttribute('data-rating');
      
      // Reset all stars
      stars.forEach(s => {
        s.classList.remove('fas');
        s.classList.add('far');
      });
      
      // Fill stars up to the clicked one
      for (let i = 0; i < rating; i++) {
        stars[i].classList.remove('far');
        stars[i].classList.add('fas');
      }
      
      // Here you would typically send the rating to your server
      showNotification(`امتیاز ${rating} از 5 ثبت شد!`);
    });
  });


  // Helper function to show notifications
  function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.querySelector('.notification-message').textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }
});

// main.js
document.addEventListener('DOMContentLoaded', function() {
 
  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

   const preloader = document.querySelector('.preloader');
  // Initialize Particles.js
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 2,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
  }
});