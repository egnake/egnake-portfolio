let points = 0;
let currentBadges = [];
const badges = {
    10: { name: "🛡️ Güvenlik Çaylağı", earned: false },
    20: { name: "🔐 Şifre Ustası", earned: false },
    30: { name: "👑 XSS Kralı", earned: false },
    50: { name: "💉 SQL Injection Uzmanı", earned: false }
};

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    let question, correctAnswer;
    
    // Zorluk seviyelerine göre sorular
    if (difficulty === "easy") {
        question = "Bir XSS saldırısı örneği nedir?";
        correctAnswer = "<script>";
    } else if (difficulty === "medium") {
        question = "DOM tabanlı XSS'de hangi obje risklidir?";
        correctAnswer = "document.url";
    } else {
        question = "XSS'den korunmak için hangi fonksiyon kullanılır?";
        correctAnswer = "encodeuri";
    }

    const answer = prompt(question).toLowerCase();
    const feedback = document.getElementById('gameFeedback');
    const education = document.getElementById('education');

    if (answer.includes(correctAnswer)) {
        const earnedPoints = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
        points += earnedPoints;
        feedback.innerHTML = `✅ Doğru! +${earnedPoints} puan. Toplam: ${points}`;
        education.style.display = "none";
        checkBadges();
        confetti({ particleCount: 100, spread: 70 });
    } else {
        feedback.innerHTML = `❌ Yanlış! Doğru cevap: ${correctAnswer}`;
        education.style.display = "block";
        education.innerHTML = `
            <h3>📚 Eğitim Modülü</h3>
            <p>${difficulty === "easy" 
                ? "XSS (Cross-Site Scripting), zararlı scriptlerin web sayfasına enjekte edilmesidir. Örnek: <script>alert('hack')</script>" 
                : difficulty === "medium" 
                ? "DOM tabanlı XSS'de document.location, document.URL gibi nesneler filtrelenmeden kullanılmamalıdır." 
                : "encodeURIComponent() veya DOMPurify kütüphanesi kullanarak kullanıcı girdilerini temizleyin."}
            </p>
        `;
    }
    document.getElementById('userPoints').textContent = points;
}

function checkBadges() {
    const badgeContainer = document.getElementById('badges');
    badgeContainer.innerHTML = "";
    
    for (const threshold in badges) {
        if (points >= threshold && !badges[threshold].earned) {
            badges[threshold].earned = true;
            currentBadges.push(badges[threshold].name);
            badgeContainer.innerHTML += `<span class="badge">${badges[threshold].name}</span>`;
        }
    }
}

// Şifre gücü fonksiyonu (öncekiyle aynı)
document.getElementById('passwordInput').addEventListener('input', function() {
    const password = this.value;
    const feedback = document.getElementById('passwordFeedback');
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
        feedback.style.color = 'red';
        feedback.textContent = "Çok Zayıf: Büyük harf, rakam veya sembol ekleyin.";
    } else if (strength == 2) {
        feedback.style.color = 'orange';
        feedback.textContent = "Orta: Daha güçlü bir şifre kullanın.";
    } else {
        feedback.style.color = 'lightgreen';
        feedback.textContent = "Güçlü Şifre 👍";
        if (points >= 20 && !badges[20].earned) checkBadges();
    }
});

// SQL Injection simülasyonu
function checkFakeLogin() {
    const username = document.getElementById('fakeUsername').value;
    const password = document.getElementById('fakePassword').value;
    const result = document.getElementById('fakeLoginResult');

    if (username.includes("' OR '1'='1") || password.includes("' OR '1'='1")) {
        result.style.color = "red";
        result.innerHTML = "⚠️ BAŞARILI GİRİŞ! (Sistem hacklendi)<br><small>SQL Injection çalıştı: <code>SELECT * FROM users WHERE username='' OR '1'='1'</code></small>";
        if (points >= 50 && !badges[50].earned) checkBadges();
    } else {
        result.style.color = "lightgreen";
        result.textContent = "✅ Giriş başarısız (Güvenli sistem)";
    }
}