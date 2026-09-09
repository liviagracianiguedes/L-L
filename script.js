/* ============================================
   GLAMOUR BEAUTY - JavaScript Interativo
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // NAVBAR SCROLL
    // ============================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // MENU MOBILE
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = menuToggle.querySelectorAll('span');

        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fechar menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ============================================
    // LINK ATIVO NO SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // TABS DE SERVIÇOS
    // ============================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Remove active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adiciona active no clicado
            btn.classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
        });
    });

    // ============================================
    // FILTRO DA GALERIA
    // ============================================
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const galeriaItems = document.querySelectorAll('.galeria-item');

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filtro = btn.dataset.filtro;

            filtroBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galeriaItems.forEach(item => {
                const categoria = item.dataset.categoria;

                if (filtro === 'todos' || categoria === filtro) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ============================================
    // CARROSSEL DE DEPOIMENTOS
    // ============================================
    const depoimentoCards = document.querySelectorAll('.depoimento-card');
    const dots = document.querySelectorAll('.dot');
    let depoimentoAtual = 0;
    let autoPlayInterval;

    function mostrarDepoimento(index) {
        depoimentoCards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });

        depoimentoCards[index].classList.add('active');
        dots[index].classList.add('active');
        depoimentoAtual = index;
    }

    function proximoDepoimento() {
        const proximo = (depoimentoAtual + 1) % depoimentoCards.length;
        mostrarDepoimento(proximo);
    }

    function iniciarAutoPlay() {
        autoPlayInterval = setInterval(proximoDepoimento, 5000);
    }

    function pararAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            pararAutoPlay();
            mostrarDepoimento(index);
            iniciarAutoPlay();
        });
    });

    // Iniciar autoplay
    iniciarAutoPlay();

    // Pausar ao passar o mouse
    const carousel = document.getElementById('depoimentosCarousel');
    carousel.addEventListener('mouseenter', pararAutoPlay);
    carousel.addEventListener('mouseleave', iniciarAutoPlay);

    // Touch/swipe para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pararAutoPlay();
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        iniciarAutoPlay();
    });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - próximo
                const proximo = (depoimentoAtual + 1) % depoimentoCards.length;
                mostrarDepoimento(proximo);
            } else {
                // Swipe right - anterior
                const anterior = (depoimentoAtual - 1 + depoimentoCards.length) % depoimentoCards.length;
                mostrarDepoimento(anterior);
            }
        }
    }

    // ============================================
    // FORMULÁRIO DE AGENDAMENTO
    // ============================================
    const formAgendamento = document.getElementById('formAgendamento');

    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');

    telefoneInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');

        if (valor.length > 11) valor = valor.slice(0, 11);

        if (valor.length > 10) {
            valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (valor.length > 6) {
            valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (valor.length > 2) {
            valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            valor = valor.replace(/(\d{0,2})/, '($1');
        }

        e.target.value = valor;
    });

    // Data mínima = hoje
    const dataInput = document.getElementById('data');
    const hoje = new Date().toISOString().split('T')[0];
    dataInput.setAttribute('min', hoje);

    // Submit do formulário
    formAgendamento.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(formAgendamento);
        const dados = Object.fromEntries(formData.entries());

        // Simula envio
        const btnSubmit = formAgendamento.querySelector('button[type="submit"]');
        const btnOriginal = btnSubmit.innerHTML;

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        setTimeout(() => {
            // Recupera nome do serviço
            const servicoSelect = document.getElementById('servico');
            const servicoNome = servicoSelect.options[servicoSelect.selectedIndex].text;

            // Mostra toast
            mostrarToast(`Agendamento confirmado! ${dados.nome}, aguardamos você no dia ${formatarData(dados.data)} às ${dados.hora} para ${servicoNome.split(' - ')[0]}.`);

            // Limpa formulário
            formAgendamento.reset();

            // Restaura botão
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = btnOriginal;

            // Salva no localStorage (histórico)
            salvarAgendamento({
                nome: dados.nome,
                servico: servicoNome,
                data: dados.data,
                hora: dados.hora,
                timestamp: new Date().toISOString()
            });

        }, 1500);
    });

    function formatarData(dataStr) {
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function salvarAgendamento(agendamento) {
        let historico = JSON.parse(localStorage.getItem('glamour_agendamentos') || '[]');
        historico.push(agendamento);
        localStorage.setItem('glamour_agendamentos', JSON.stringify(historico));
    }

    // ============================================
    // TOAST NOTIFICAÇÃO
    // ============================================
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimeout;

    function mostrarToast(mensagem) {
        toastMsg.textContent = mensagem;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // ============================================
    // BOTÃO VOLTAR AO TOPO
    // ============================================
    const btnTopo = document.getElementById('btnTopo');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btnTopo.classList.add('visible');
        } else {
            btnTopo.classList.remove('visible');
        }
    });

    btnTopo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // ANIMAÇÃO AO SCROLL (Reveal)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Adiciona classe reveal em elementos
    document.querySelectorAll('.servico-card, .galeria-item, .contato-card, .info-item').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // CSS para reveal via JS
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(revealStyle);

    // ============================================
    // PARALLAX SUAVE NOS CÍRCULOS DECORATIVOS
    // ============================================
    const decoCircles = document.querySelectorAll('.deco-circle');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        decoCircles.forEach((circle, index) => {
            const speed = 0.05 + (index * 0.02);
            circle.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ============================================
    // INSTALAÇÃO DO PWA (Prompt)
    // ============================================
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Mostra toast convidando a instalar
        setTimeout(() => {
            mostrarToast('Adicione o Glamour Beauty à sua tela inicial para acesso rápido!');
        }, 3000);
    });

    // ============================================
    // ONLINE / OFFLINE
    // ============================================
    window.addEventListener('online', () => {
        mostrarToast('Você está online! ✅');
    });

    window.addEventListener('offline', () => {
        mostrarToast('Você está offline. O app continua funcionando! 📱');
    });

    // ============================================
    // CONTADOR ANIMADO (Hero Stats)
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent.replace(/\D/g, ''));
                    const suffix = stat.textContent.replace(/[0-9]/g, '');
                    animarContador(stat, 0, target, 2000, suffix);
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelector('.hero-stats')?.closest('section') && 
    statsObserver.observe(document.querySelector('.hero-stats'));

    function animarContador(elemento, inicio, fim, duracao, suffixo) {
        const inicioTempo = performance.now();

        function atualizar(tempoAtual) {
            const progresso = Math.min((tempoAtual - inicioTempo) / duracao, 1);
            const easeOut = 1 - Math.pow(1 - progresso, 3);
            const valorAtual = Math.floor(inicio + (fim - inicio) * easeOut);

            elemento.textContent = valorAtual + suffixo;

            if (progresso < 1) {
                requestAnimationFrame(atualizar);
            }
        }

        requestAnimationFrame(atualizar);
    }

    console.log('✨ Glamour Beauty - App carregado com sucesso!');
});
