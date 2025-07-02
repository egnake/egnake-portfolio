document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Telefonlarda link tıklayınca menüyü kapat
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mobileMenu.classList.remove('active');
                }
            });
        });
    }

    // Scroll Animasyonları
    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(section);
    });

    // GitHub Projeleri Yükleme
    function loadGitHubRepos() {
        const container = document.getElementById('githubProjects');
        fetch('https://api.github.com/users/egeparlak/repos ')
            .then(res => res.json())
            .then(repos => {
                container.innerHTML = '';
                if (repos.length === 0) {
                    container.innerHTML = '<p>Henüz GitHub projem yok, yakında burada olacak!</p>';
                    return;
                }

                repos.slice(0, 6).forEach(repo => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'Açıklama yok.'}</p>
                        <a href="${repo.html_url}" target="_blank" class="read-more">GitHub'a Git →</a>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(() => {
                container.innerHTML = '<p>GitHub projeleri yüklenemedi.</p>';
            });
    }

    loadGitHubRepos();

    // EmailJS Ayarları
    (function () {
        emailjs.init("akystYw1ebv8iwdiZ");
    })();

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button');
            const status = document.getElementById('formStatus');
            btn.disabled = true;
            btn.textContent = "Gönderiliyor...";

            emailjs.sendForm("service_gj4d62c", "template_swiwwsp", this)
                .then(() => {
                    status.textContent = "✅ Mesaj başarıyla gönderildi!";
                    this.reset();
                })
                .catch(err => {
                    status.textContent = "❌ Bir hata oluştu, lütfen tekrar deneyin.";
                    console.error(err);
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.textContent = "Gönder";
                });
        });
    }
});
