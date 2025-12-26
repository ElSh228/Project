document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const burgerBtn = document.getElementById('burgerBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const dropdowns = document.querySelectorAll('.dropdown');
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const poetryForm = document.getElementById('poetryForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const formMessage = document.getElementById('formMessage');
    const contactBtn = document.getElementById('contactBtn');
    const contactBtnMobile = document.getElementById('contactBtnMobile');

    // Мобильное меню
    burgerBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Закрытие мобильного меню при клике на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Выпадающие меню для десктопа
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.querySelector('.dropdown-menu').style.opacity = '1';
                this.querySelector('.dropdown-menu').style.visibility = 'visible';
                this.querySelector('.dropdown-menu').style.transform = 'translateY(0)';
            }
        });

        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.querySelector('.dropdown-menu').style.opacity = '0';
                this.querySelector('.dropdown-menu').style.visibility = 'hidden';
                this.querySelector('.dropdown-menu').style.transform = 'translateY(-10px)';
            }
        });
    });

    // Слайдер
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        // Скрыть все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        
        // Убрать активный класс со всех точек
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Показать выбранный слайд
        slides[index].style.display = 'block';
        setTimeout(() => {
            slides[index].classList.add('active');
        }, 10);
        
        // Активировать соответствующую точку
        dots[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= totalSlides) newIndex = 0;
        showSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = totalSlides - 1;
        showSlide(newIndex);
    }

    // Автопрокрутка слайдера
    let slideInterval = setInterval(nextSlide, 5000);

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Кнопки слайдера
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetInterval();
    });

    // Точки навигации слайдера
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetInterval();
        });
    });

    // Пауза слайдера при наведении
    slider.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });

    slider.addEventListener('mouseleave', function() {
        resetInterval();
    });

    // Отправка формы (используем Formspree)
    poetryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Показать спиннер и заблокировать кнопку
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');
        
        // Скрыть предыдущие сообщения
        formMessage.className = 'form-message';
        formMessage.textContent = '';
        
        // Собрать данные формы
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            poem: document.getElementById('poem').value,
            title: document.getElementById('title').value,
            agree: document.getElementById('agree').checked
        };
        
        try {
            // Отправка данных на Formspree
            const response = await fetch('https://formspree.io/f/ваш_ключ', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Успешная отправка
                formMessage.textContent = 'Ваше стихотворение успешно отправлено! Спасибо за участие.';
                formMessage.classList.add('success');
                poetryForm.reset();
            } else {
                throw new Error('Ошибка отправки формы');
            }
        } catch (error) {
            // Ошибка отправки
            formMessage.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.';
            formMessage.classList.add('error');
            console.error('Form submission error:', error);
        } finally {
            // Скрыть спиннер и разблокировать кнопку
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            
            // Автоматически скрыть сообщение через 5 секунд
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    });

    // Кнопки "Связь с нами" - открывают модалку
    function showContactModal() {
        // Если подключен React - отправляем событие
        if (typeof window.dispatchEvent !== 'undefined') {
            const contactBtns = document.querySelectorAll('.contact-btn, .contact-btn-mobile');
            contactBtns.forEach(btn => {
                const rect = btn.getBoundingClientRect();
                const position = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                
                window.dispatchEvent(new CustomEvent('openContactModal', {
                    detail: { position }
                }));
            });
        } else {
            // Простая альтернатива без React
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            `;
            
            modal.innerHTML = `
                <div style="
                    background: #3e2723;
                    padding: 2rem;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid #d7ccc8;
                ">
                    <h2 style="color: #d7ccc8; margin-bottom: 1rem;">Связь с нами</h2>
                    <p style="color: #bdbdbd; margin-bottom: 1.5rem;">
                        Для связи с нами используйте форму ниже на странице 
                        или напишите на email: poetry@example.com
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="
                                background: #d7ccc8;
                                color: #2c1810;
                                border: none;
                                padding: 0.5rem 1rem;
                                border-radius: 5px;
                                cursor: pointer;
                            ">
                        Закрыть
                    </button>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
    }

    contactBtn.addEventListener('click', showContactModal);
    contactBtnMobile.addEventListener('click', function() {
        showContactModal();
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Инициализация первого слайда
    showSlide(0);
});
