document.addEventListener('DOMContentLoaded', function() {
    // ===== ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ =====
    const burgerBtn = document.getElementById('burgerBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const dropdowns = document.querySelectorAll('.dropdown');
    const contactBtn = document.getElementById('contactBtn');
    const contactBtnMobile = document.getElementById('contactBtnMobile');
    const poetryForm = document.getElementById('poetryForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const formMessage = document.getElementById('formMessage');
    
    // Галерея элементы
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // ===== МОБИЛЬНОЕ МЕНЮ =====
    burgerBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Анимация бургер-меню
        this.classList.toggle('active');
    });
    
    closeMenuBtn.addEventListener('click', closeMobileMenu);
    
    // Закрытие меню при клике на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        burgerBtn.classList.remove('active');
    }
    
    // ===== ВЫПАДАЮЩЕЕ МЕНЮ (ДЕСКТОП) =====
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                const menu = this.querySelector('.dropdown-menu');
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                const menu = this.querySelector('.dropdown-menu');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }
        });
    });
    
    // ===== ГАЛЕРЕЯ СЛАЙДОВ =====
    let currentSlide = 0;
    const totalSlides = gallerySlides.length;
    
    function showGallerySlide(index) {
        // Скрыть все слайды
        gallerySlides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        // Скрыть все точки
        galleryDots.forEach(dot => dot.classList.remove('active'));
        
        // Показать выбранный слайд
        gallerySlides[index].style.display = 'block';
        setTimeout(() => {
            gallerySlides[index].classList.add('active');
        }, 10);
        
        // Активировать точку
        galleryDots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextGallerySlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= totalSlides) newIndex = 0;
        showGallerySlide(newIndex);
    }
    
    function prevGallerySlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = totalSlides - 1;
        showGallerySlide(newIndex);
    }
    
    // Автопрокрутка галереи
    let galleryInterval = setInterval(nextGallerySlide, 5000);
    
    function resetGalleryInterval() {
        clearInterval(galleryInterval);
        galleryInterval = setInterval(nextGallerySlide, 5000);
    }
    
    // События галереи
    prevBtn.addEventListener('click', function() {
        prevGallerySlide();
        resetGalleryInterval();
    });
    
    nextBtn.addEventListener('click', function() {
        nextGallerySlide();
        resetGalleryInterval();
    });
    
    // Точки навигации
    galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showGallerySlide(index);
            resetGalleryInterval();
        });
    });
    
    // Остановка автопрокрутки при наведении
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(galleryInterval);
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
            resetGalleryInterval();
        });
    }
    
    // ===== ОТПРАВКА ФОРМЫ =====
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
            title: document.getElementById('title').value,
            poem: document.getElementById('poem').value,
            period: document.getElementById('period').value,
            agree: document.getElementById('agree').checked,
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toISOString()
        };
        
        try {
            // Сохраняем в localStorage
            localStorage.setItem('lastPoemTitle', formData.title);
            localStorage.setItem('lastPoemAuthor', formData.name);
            
            // Отправка на Formspree (замените YOUR_FORM_ID на ваш)
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Успешная отправка
                formMessage.textContent = '✅ Ваше стихотворение успешно отправлено! Спасибо за участие в проекте.';
                formMessage.classList.add('success');
                poetryForm.reset();
                
                // История отправки
                const submissionHistory = JSON.parse(localStorage.getItem('submissionHistory') || '[]');
                submissionHistory.push({
                    title: formData.title,
                    date: new Date().toLocaleString()
                });
                localStorage.setItem('submissionHistory', JSON.stringify(submissionHistory));
            } else {
                throw new Error('Ошибка отправки формы');
            }
        } catch (error) {
            // Ошибка отправки
            formMessage.textContent = '❌ Произошла ошибка при отправке. Пожалуйста, проверьте подключение к интернету и попробуйте ещё раз.';
            formMessage.classList.add('error');
            console.error('Form submission error:', error);
        } finally {
            // Скрыть спиннер и разблокировать кнопку
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            
            // Автоматически скрыть сообщение через 8 секунд
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 8000);
        }
    });
    
    // ===== КНОПКИ "СВЯЗЬ С НАМИ" =====
    function showContactInfo() {
        formMessage.textContent = '📧 Для связи с нами используйте форму выше или напишите на poetry@example.com';
        formMessage.classList.add('success');
        
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
    
    contactBtn.addEventListener('click', showContactInfo);
    contactBtnMobile.addEventListener('click', function() {
        showContactInfo();
        closeMobileMenu();
    });
    
    // ===== ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрыть мобильное меню если открыто
                if (mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });
    
    // ===== АНИМАЦИЯ ПРИ ПРОКРУТКЕ =====
    function checkScroll() {
        const elements = document.querySelectorAll('.collection-card, .table-section, .form-section');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Начальные стили для анимации
    document.querySelectorAll('.collection-card, .table-section, .form-section').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('load', checkScroll);
    
    // ===== ИНИЦИАЛИЗАЦИЯ =====
    showGallerySlide(0);
    checkScroll();
    
    // Загрузка сохранённых данных
    const savedTitle = localStorage.getItem('lastPoemTitle');
    const savedAuthor = localStorage.getItem('lastPoemAuthor');
    
    if (savedTitle) {
        document.getElementById('title').value = savedTitle;
    }
    if (savedAuthor) {
        document.getElementById('name').value = savedAuthor;
    }
    
    console.log('Поэтический сайт успешно загружен! 🎭');
});
