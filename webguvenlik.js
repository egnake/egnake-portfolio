let points = 0;
let currentBadges = [];
const badges = {
    10: { name: { tr: "🛡️ Güvenlik Çaylağı", en: "🛡️ Rookie" }, earned: false },
    20: { name: { tr: "🔐 Şifre Ustası", en: "🔐 Password Master" }, earned: false },
    30: { name: { tr: "👑 XSS Kralı", en: "👑 XSS King" }, earned: false },
    50: { name: { tr: "💉 SQL Uzmanı", en: "💉 SQL Expert" }, earned: false }
};

const stats = {
    gamesPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bestScore: 0
};

const levels = {
    0: { name: { tr: "Çaylak", en: "Rookie" }, color: "gray" },
    50: { name: { tr: "Orta", en: "Intermediate" }, color: "blue" },
    100: { name: { tr: "Uzman", en: "Expert" }, color: "purple" },
    200: { name: { tr: "Hacker", en: "Hacker" }, color: "red" }
};

const translations = {
    tr: {
        home: "Ana Sayfa",
        game: "Güvenlik Oyunu",
        password: "Şifre Gücü",
        sql: "SQL Testi",
        title: "Web Güvenliği Testleri ve Araçları",
        subtitle: "Güvenliğinizi test edin, becerilerinizi geliştirin, puan ve rozet kazanın!",
        gameTitle: "Güvenlik Oyunu",
        yourScore: "Puanınız:",
        startButton: "Oyunu Başlat",
        easy: "Kolay",
        medium: "Orta",
        hard: "Zor",
        passwordTitle: "Şifre Güç Göstergesi",
        passwordPlaceholder: "Şifrenizi yazın...",
        sqlTitle: "SQL Injection Simülasyonu",
        fakeLogin: "Sahte Login Paneli",
        usernamePlaceholder: "Kullanıcı Adı",
        passwordPlaceholder: "Şifre",
        loginButton: "Giriş Yap",
        stats: "İstatistikler",
        played: "Oynanan:",
        correct: "Doğru:",
        wrong: "Yanlış:",
        best: "En Yüksek Puan:",
        rights: "Tüm hakları saklıdır."
    },
    en: {
        home: "Home",
        game: "Security Game",
        password: "Password Meter",
        sql: "SQL Test",
        title: "Web Security Tools",
        subtitle: "Test your security skills, earn points and badges!",
        gameTitle: "Security Game",
        yourScore: "Your Score:",
        startButton: "Start Game",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        passwordTitle: "Password Strength Meter",
        passwordPlaceholder: "Enter your password...",
        sqlTitle: "SQL Injection Simulator",
        fakeLogin: "Fake Login Panel",
        usernamePlaceholder: "Username",
        passwordPlaceholder: "Password",
        loginButton: "Login",
        stats: "Statistics",
        played: "Played:",
        correct: "Correct:",
        wrong: "Wrong:",
        best: "Best Score:",
        rights: "All rights reserved."
    }
};

// Dil ayarı
function setLanguage(lang) {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        el.textContent = translations[lang][key];
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        el.placeholder = translations[lang][key];
    });
    
    localStorage.setItem('language', lang);
    updateLevel();
    renderStats();
}

// Seviye güncelleme
function updateLevel() {
    const lang = localStorage.getItem('language') || 'tr';
    let levelKey = 0;
    
    for (const threshold in levels) {
        if (points >= threshold) levelKey = threshold;
    }
    
    document.getElementById('levelDisplay').innerHTML = `
        <span style="color: ${levels[levelKey].color}; font-weight:bold;">
            ${levels[levelKey].name[lang]} Lv.${Math.floor(points/50)+1}
        </span>
    `;
}

// İstatistik güncelleme
function updateStats(isCorrect) {
    stats.gamesPlayed++;
    isCorrect ? stats.correctAnswers++ : stats.wrongAnswers++;
    stats.bestScore = Math.max(stats.bestScore, points);
    renderStats();
}

function renderStats() {
    const lang = localStorage.getItem('language') || 'tr';
    document.getElementById('statsPlayed').textContent = stats.gamesPlayed;
    document.getElementById('statsCorrect').textContent = stats.correctAnswers;
    document.getElementById('statsWrong').textContent = stats.wrongAnswers;
    document.getElementById('statsBest').textContent = stats.bestScore;
}

// Rozet kontrolü
function checkBadges() {
    const lang = localStorage.getItem('language') || 'tr';
    const badgeContainer = document.getElementById('badges');
    badgeContainer.innerHTML = "";
    
    for (const threshold in badges) {
        if (points >= threshold && !badges[threshold].earned) {
            badges[threshold].earned = true;
            badgeContainer.innerHTML += `<span class="badge">${badges[threshold].name[lang]}</span>`;
            confetti({ particleCount: 150, spread: 70 });
        }
    }
}

// Oyun başlatma
function startGame() {
    const lang = localStorage.getItem('language') || 'tr';
    const difficulty = document.getElementById('difficulty').value;
    let question, correctAnswer;
    
    if (difficulty === "easy") {
        question = lang === 'tr' ? "Bir XSS saldırısı örneği nedir?" : "What is an example of XSS attack?";
        correctAnswer = "<script>";
    } else if (difficulty === "medium") {
        question = lang === 'tr' ? "DOM tabanlı XSS'de hangi obje risklidir?" : "Which object is risky in DOM-based XSS?";
        correctAnswer = "document.url";
    } else {
        question = lang === 'tr' ? "XSS'den korunmak için hangi fonksiyon kullanılır?" : "Which function prevents XSS?";
        correctAnswer = "encodeuri";
    }

    const answer = prompt(question).toLowerCase();
    const feedback = document.getElementById('gameFeedback');
    const education = document.getElementById('education');

    if (answer.includes(correctAnswer)) {
        const earnedPoints = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
        points += earnedPoints;
        feedback.innerHTML = (lang === 'tr' ? `✅ Doğru! +${earnedPoints} puan. Toplam: ` : `✅ Correct! +${earnedPoints} points. Total: `) + points;
        education.style.display = "none";
        updateStats(true);
        checkBadges();
        updateLevel();
        confetti({ particleCount: 100, spread: 70 });
    } else {
        feedback.innerHTML = (lang === 'tr' ? `❌ Yanlış! Doğru cevap: ` : `❌ Wrong! Correct answer: `) + correctAnswer;
        education.style.display = "block";
        education.innerHTML = `
            <h3>📚 ${lang === 'tr' ? "Eğitim Modülü" : "Education Module"}</h3>
            <p>${
                difficulty === "easy" 
                    ? lang === 'tr' 
                        ? "XSS (Cross-Site Scripting), zararlı scriptlerin web sayfasına enjekte edilmesidir. Örnek: <script>alert('hack')</script>" 
                        : "XSS (Cross-Site Scripting) injects malicious scripts into web pages. Example: <script>alert('hack')</script>"
                    : difficulty === "medium" 
                    ? lang === 'tr' 
                        ? "DOM tabanlı XSS'de document.location, document.URL gibi nesneler filtrelenmeden kullanılmamalıdır." 
                        : "In DOM-based XSS, objects like document.location should be sanitized before use."
                    : lang === 'tr' 
                        ? "encodeURIComponent() veya DOMPurify kütüphanesi kullanarak kullanıcı girdilerini temizleyin." 
                        : "Sanitize user inputs using encodeURIComponent() or DOMPurify library."
            }</p>
        `;
        updateStats(false);
    }
    document.getElementById('userPoints').textContent = points;
}

// Şifre gücü fonksiyonu
document.getElementById('passwordInput').addEventListener('input', function() {
    const lang = localStorage.getItem('language') || 'tr';
    const password = this.value;
    const feedback = document.getElementById('passwordFeedback');
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
        feedback.style.color = 'red';
        feedback.textContent = lang === 'tr' ? "Çok Zayıf: Büyük harf, rakam veya sembol ekleyin." : "Very Weak: Add uppercase, number or symbol.";
    } else if (strength == 2) {
        feedback.style.color = 'orange';
        feedback.textContent = lang === 'tr' ? "Orta: Daha güçlü bir şifre kullanın." : "Medium: Use a stronger password.";
    } else {
        feedback.style.color = 'lightgreen';
        feedback.textContent = lang === 'tr' ? "Güçlü Şifre 👍" : "Strong Password 👍";
        if (points >= 20 && !badges[20].earned) checkBadges();
    }
});

// SQL Simülasyonu
function checkFakeLogin() {
    const lang = localStorage.getItem('language') || 'tr';
    const username = document.getElementById('fakeUsername').value;
    const password = document.getElementById('fakePassword').value;
    const result = document.getElementById('fakeLoginResult');

    if (username.includes("' OR '1'='1") || password.includes("' OR '1'='1")) {
        result.style.color = "red";
        result.innerHTML = (lang === 'tr' 
            ? "⚠️ BAŞARILI GİRİŞ! (Sistem hacklendi)<br><small>SQL Injection çalıştı: <code>SELECT * FROM users WHERE username='' OR '1'='1'</code></small>"
            : "⚠️ LOGIN SUCCESS! (System hacked)<br><small>SQL Injection executed: <code>SELECT * FROM users WHERE username='' OR '1'='1'</code></small>");
        if (points >= 50 && !badges[50].earned) checkBadges();
    } else {
        result.style.color = "lightgreen";
        result.textContent = lang === 'tr' 
            ? "✅ Giriş başarısız (Güvenli sistem)" 
            : "✅ Login failed (Secure system)";
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'tr';
    setLanguage(savedLang);
    renderStats();
});
