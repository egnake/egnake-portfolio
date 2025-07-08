let points = 0;
let currentBadges = [];
const badges = {
    10: { name: { tr: "🛡️ Güvenlik Çaylağı", en: "🛡️ Rookie" }, earned: false },
    20: { name: { tr: "🔐 Şifre Ustası", en: "🔐 Password Master" }, earned: false },
    30: { name: { tr: "👑 XSS Kralı", en: "👑 XSS King" }, earned: false },
    50: { name: { tr: "💉 SQL Uzmanı", en: "💉 SQL Expert" }, earned: false },
    100: { name: { tr: "🏆 Güvenlik Şampiyonu", en: "🏆 Security Champion" }, earned: false }
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

const securityQuestions = {
    tr: [
        {
            question: "Bir XSS saldırısı örneği nedir?",
            answer: "<script>",
            difficulty: "easy"
        },
        {
            question: "DOM tabanlı XSS'de hangi obje risklidir?",
            answer: "document.url",
            difficulty: "medium"
        },
        {
            question: "XSS'den korunmak için hangi fonksiyon kullanılır?",
            answer: "encodeuri",
            difficulty: "hard"
        },
        {
            question: "Hangi HTTP header XSS'den korunmaya yardımcı olur?",
            answer: "x-xss-protection",
            difficulty: "medium"
        },
        {
            question: "CSRF saldırılarından korunmak için hangi teknik kullanılır?",
            answer: "csrf token",
            difficulty: "hard"
        }
    ],
    en: [
        {
            question: "What is an example of XSS attack?",
            answer: "<script>",
            difficulty: "easy"
        },
        {
            question: "Which object is risky in DOM-based XSS?",
            answer: "document.url",
            difficulty: "medium"
        },
        {
            question: "Which function prevents XSS?",
            answer: "encodeuri",
            difficulty: "hard"
        },
        {
            question: "Which HTTP header helps prevent XSS?",
            answer: "x-xss-protection",
            difficulty: "medium"
        },
        {
            question: "What technique is used to prevent CSRF attacks?",
            answer: "csrf token",
            difficulty: "hard"
        }
    ]
};

const translations = {
    tr: {
        home: "Ana Sayfa",
        game: "Güvenlik Oyunu",
        password: "Şifre Gücü",
        sql: "SQL Testi",
        xss: "XSS Testi",
        title: "Web Güvenliği Testleri ve Araçları",
        subtitle: "Güvenliğinizi test edin, becerilerinizi geliştirin, puan ve rozet kazanın!",
        gameTitle: "Güvenlik Oyunu",
        yourScore: "Puanınız:",
        startButton: "Oyunu Başlat",
        timedButton: "Zamanlı Mod",
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
        time: "Kalan Süre:",
        rights: "Tüm hakları saklıdır.",
        xssTitle: "XSS Test Aracı",
        headerTitle: "HTTP Header Analiz",
        testButton: "Test Et",
        analyzeButton: "Analiz Et",
        eduTitle: "Eğitim Kaynakları",
        xssTab: "XSS",
        sqlTab: "SQL Injection",
        csrfTab: "CSRF"
    },
    en: {
        home: "Home",
        game: "Security Game",
        password: "Password Meter",
        sql: "SQL Test",
        xss: "XSS Test",
        title: "Web Security Tools",
        subtitle: "Test your security skills, earn points and badges!",
        gameTitle: "Security Game",
        yourScore: "Your Score:",
        startButton: "Start Game",
        timedButton: "Timed Mode",
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
        time: "Time Left:",
        rights: "All rights reserved.",
        xssTitle: "XSS Tester",
        headerTitle: "HTTP Header Analyzer",
        testButton: "Test",
        analyzeButton: "Analyze",
        eduTitle: "Education Resources",
        xssTab: "XSS",
        sqlTab: "SQL Injection",
        csrfTab: "CSRF"
    }
};

let gameTimer;
let timeLeft = 30;
const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

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
    showLeaderboard();
}

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

function startGame() {
    const lang = localStorage.getItem('language') || 'tr';
    const difficulty = document.getElementById('difficulty').value;
    const questions = securityQuestions[lang].filter(q => q.difficulty === difficulty);
    
    if (questions.length === 0) {
        document.getElementById('gameFeedback').textContent = 
            lang === 'tr' ? "Bu zorluk seviyesinde soru bulunamadı." : "No questions found for this difficulty.";
        return;
    }
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const answer = prompt(randomQuestion.question).toLowerCase();
    const feedback = document.getElementById('gameFeedback');
    const education = document.getElementById('education');

    if (answer.includes(randomQuestion.answer)) {
        const earnedPoints = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
        points += earnedPoints;
        feedback.innerHTML = (lang === 'tr' ? `✅ Doğru! +${earnedPoints} puan. Toplam: ` : `✅ Correct! +${earnedPoints} points. Total: `) + points;
        education.style.display = "none";
        updateStats(true);
        checkBadges();
        updateLevel();
        confetti({ particleCount: 100, spread: 70 });
    } else {
        feedback.innerHTML = (lang === 'tr' ? `❌ Yanlış! Doğru cevap: ` : `❌ Wrong! Correct answer: `) + randomQuestion.answer;
        education.style.display = "block";
        education.innerHTML = `
            <h3>📚 ${lang === 'tr' ? "Eğitim Modülü" : "Education Module"}</h3>
            <p>${randomQuestion.education || (lang === 'tr' ? "Daha fazla bilgi için eğitim kaynaklarını inceleyin." : "Check education resources for more information.")}</p>
        `;
        updateStats(false);
    }
    document.getElementById('userPoints').textContent = points;
}

function startTimedGame() {
    const lang = localStorage.getItem('language') || 'tr';
    timeLeft = 30;
    document.getElementById('timerDisplay').textContent = timeLeft;
    
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timerDisplay').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            const name = prompt(lang === 'tr' ? "Süre bitti! Puanınız: " + points + "\nİsminizi girin:" : "Time's up! Your score: " + points + "\nEnter your name:");
            if (name) {
                updateLeaderboard(name, points);
                showLeaderboard();
            }
            points = 0;
            document.getElementById('userPoints').textContent = points;
            updateLevel();
        }
    }, 1000);
    
    startGame();
}

function updateLeaderboard(name, score) {
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

function showLeaderboard() {
    const lang = localStorage.getItem('language') || 'tr';
    let html = `<h3>${lang === 'tr' ? 'Liderlik Tablosu' : 'Leaderboard'}</h3><ol>`;
    
    leaderboard.slice(0, 5).forEach((entry, index) => {
        html += `<li>${entry.name}: ${entry.score}</li>`;
    });
    
    html += '</ol>';
    document.getElementById('leaderboard').innerHTML = html;
}

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

function testXSS() {
    const lang = localStorage.getItem('language') || 'tr';
    const payload = document.getElementById('xssInput').value;
    const resultDiv = document.getElementById('xssResult');
    const eduDiv = document.getElementById('xssEducation');
    
    const xssPatterns = [
        /<script.*?>.*?<\/script>/i,
        /<img.*?src=.*?onerror=.*?>/i,
        /javascript:/i,
        /onload=.*?/i,
        /onerror=.*?/i
    ];
    
    const isXSS = xssPatterns.some(pattern => pattern.test(payload));

    if (isXSS) {
        resultDiv.style.background = "#4a0000";
        resultDiv.innerHTML = lang === 'tr' ? 
            "⚠️ XSS Payloadı Tespit Edildi!<br>Örnek: " + payload : 
            "⚠️ XSS Payload Detected!<br>Example: " + payload;
        
        eduDiv.style.display = "block";
        eduDiv.innerHTML = lang === 'tr' ?
            `<h3>XSS Nasıl Önlenir?</h3>
             <p>Kullanıcı girdilerini temizlemek için:</p>
             <code>const safeInput = DOMPurify.sanitize(userInput);</code>` :
            `<h3>How to Prevent XSS?</h3>
             <p>Sanitize user inputs with:</p>
             <code>const safeInput = DOMPurify.sanitize(userInput);</code>`;
        
        if (points >= 30 && !badges[30].earned) checkBadges();
    } else {
        resultDiv.style.background = "#004a00";
        resultDiv.textContent = lang === 'tr' ? 
            "✅ Güvenli Girdi (XSS tespit edilmedi)" : 
            "✅ Safe Input (No XSS detected)";
        eduDiv.style.display = "none";
    }
}

async function analyzeHeaders() {
    const lang = localStorage.getItem('language') || 'tr';
    const url = document.getElementById('headerUrl').value;
    const resultDiv = document.getElementById('headerResults');
    
    if (!url) {
        resultDiv.textContent = lang === 'tr' ? 
            "Lütfen geçerli bir URL girin" : 
            "Please enter a valid URL";
        return;
    }
    
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, "text/html");
            
            // Meta tag'lerini de kontrol edelim
            const metaTags = doc.querySelectorAll('meta');
            let headersText = "Meta Tags:\n";
            metaTags.forEach(tag => {
                if (tag.httpEquiv) {
                    headersText += `${tag.httpEquiv}: ${tag.content}\n`;
                }
            });
            
            resultDiv.textContent = headersText;
            checkSecurityHeaders(headersText);
        } else {
            resultDiv.textContent = lang === 'tr' ? 
                "Header bilgileri alınamadı" : 
                "Could not retrieve headers";
        }
    } catch (error) {
        resultDiv.textContent = lang === 'tr' ? 
            "Hata oluştu: " + error.message : 
            "Error occurred: " + error.message;
    }
}

function checkSecurityHeaders(headersText) {
    const lang = localStorage.getItem('language') || 'tr';
    const recHeaders = [
        'X-XSS-Protection',
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Strict-Transport-Security'
    ];
    
    const missingHeaders = recHeaders.filter(h => !headersText.includes(h));
    
    if (missingHeaders.length > 0) {
        alert(lang === 'tr' ? 
            `Eksik Güvenlik Headerları:\n${missingHeaders.join('\n')}` : 
            `Missing Security Headers:\n${missingHeaders.join('\n')}`);
    }
}

function openEduTab(tabName) {
    document.querySelectorAll('.edu-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.edu-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-edu`).classList.add('active');
    document.querySelector(`.edu-tab[onclick="openEduTab('${tabName}')"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'tr';
    setLanguage(savedLang);
    renderStats();
    showLeaderboard();
});
// Hamburger menüyü çalışır hale getirmek için:
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && desktopNav && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            desktopNav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    desktopNav.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});
