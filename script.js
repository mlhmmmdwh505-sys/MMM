window.onload = function() {
    let totalPoints = localStorage.getItem("points") ? parseInt(localStorage.getItem("points")) : 0;
    const pointsDisplay = document.getElementById("userPoints");
    pointsDisplay.innerText = totalPoints;

    let timeLeft = 25 * 60;
    let timer = null;

    window.applySettings = function() {
        const color = document.getElementById('colorPicker').value;
        document.documentElement.style.setProperty('--primary', color);
        timeLeft = document.getElementById('pomoMinutes').value * 60;
        updateDisplay();
    };

    function updateDisplay() {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById("pomoDisplay").innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    window.startPomo = function() {
        if (timer) return;
        timer = setInterval(() => {
            if (timeLeft > 0) { timeLeft--; updateDisplay(); }
            else {
                clearInterval(timer); timer = null;
                const earned = Math.floor(document.getElementById('pomoMinutes').value * 3);
                addPoints(earned);
                alert(`أحسنت يا دكتور! حصلت على ${earned} نقطة.`);
                resetPomo();
            }
        }, 1000);
    };

    window.resetPomo = function() {
        clearInterval(timer); timer = null;
        timeLeft = document.getElementById('pomoMinutes').value * 60;
        updateDisplay();
    };

    function addPoints(amount) {
        totalPoints += amount;
        localStorage.setItem("points", totalPoints);
        pointsDisplay.innerText = totalPoints;
    }

    window.resetPoints = function() {
        if(confirm("هل تريد فعلاً تصفير نقاطك؟")) {
            totalPoints = 0; localStorage.setItem("points", 0);
            pointsDisplay.innerText = 0;
        }
    };

    window.buyBreak = function(min) {
        let cost = min * 15;
        if(totalPoints >= cost) {
            addPoints(-cost);
            timeLeft = min * 60; updateDisplay(); startPomo();
        } else { alert("نقاطك لا تكفي.. استمر في المذاكرة!"); }
    };

    // العداد التنازلي للسنوات
    const target = new Date("June 30, 2036").getTime();
    setInterval(() => {
        const diff = target - new Date().getTime();
        document.getElementById("years").innerText = Math.floor(diff / (1000*60*60*24*365.25)).toString().padStart(2, '0');
        document.getElementById("days").innerText = Math.floor((diff % (1000*60*60*24*365.25)) / (1000*60*60*24)).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((diff % (1000*60*60*24)) / (1000*60*60)).toString().padStart(2, '0');
    }, 1000);

    window.addTask = function() {
        const inp = document.getElementById("taskInput");
        if(!inp.value) return;
        const li = document.createElement("li");
        li.innerHTML = `<span>${inp.value}</span><button onclick="this.parentElement.remove()" style="border:none !important; color:#ff4444 !important; min-width:auto !important; background:none !important;">❌</button>`;
        document.getElementById("taskList").appendChild(li);
        inp.value = "";
    };
    document.getElementById('dateDisplay').innerText = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
};
// ==========================================
// 1. المتغيرات الأساسية
// ==========================================
let timer = null;
let coins = parseInt(localStorage.getItem('userCoins')) || 1000;
let timeLeft = (parseInt(localStorage.getItem('savedMins')) || 25) * 60;

// ==========================================
// 2. المحرك الرئيسي لتحديث الشاشة
// ==========================================
function updateDisplay() {
    // تحديث التايمر (بيجرب كل الاحتمالات لـ IDs)
    const timerElem = document.getElementById('pomoDisplay') || document.querySelector('.timer-display');
    if (timerElem) {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerElem.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // تحديث النقاط فوق
    const coinElem = document.getElementById('coinCount') || document.querySelector('.coins span');
    if (coinElem) {
        coinElem.innerText = coins;
    }
    localStorage.setItem('userCoins', coins);
}

// ==========================================
// 3. ربط الأزرار (طريقة الرادار الذكي)
// ==========================================
document.addEventListener('click', function(e) {
    const target = e.target;

    // زرار "ابدأ المهمة"
    if (target.innerText.includes("ابدأ") || target.classList.contains('btn-start')) {
        if (timer) return;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                timer = null;
                alert("انتهت المهمة!");
            }
        }, 1000);
    }

    // زرار "إعادة ضبط"
    if (target.innerText.includes("إعادة") || target.classList.contains('btn-reset')) {
        clearInterval(timer);
        timer = null;
        timeLeft = (parseInt(localStorage.getItem('savedMins')) || 25) * 60;
        updateDisplay();
    }

    // زرار السلة (التصفير)
    if (target.closest('.reset-mini') || target.innerText.includes("🗑️")) {
        if (confirm("تصفير النقاط؟")) {
            coins = 0;
            updateDisplay();
        }
    }

    // متجر الطاقة (المربعات)
    const shopItem = target.closest('.item');
    if (shopItem) {
        const mins = parseInt(shopItem.innerText.match(/\d+/)[0]);
        const cost = mins * 15;
        if (coins >= cost) {
            coins -= cost;
            timeLeft += (mins * 60);
            updateDisplay();
        } else {
            alert("نقاطك لا تكفي!");
        }
    }
});

// ==========================================
// 4. زرار "تأكيد الإعدادات"
// ==========================================
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-save') || e.target.innerText.includes("تأكيد")) {
        e.preventDefault();
        const input = document.querySelector('.minutes-input') || document.querySelector('input[type="number"]');
        if (input && input.value) {
            const val = parseInt(input.value);
            timeLeft = val * 60;
            localStorage.setItem('savedMins', val);
            updateDisplay();
            e.target.innerText = "تم ✅";
            setTimeout(() => { e.target.innerText = "تأكيد الإعدادات"; }, 2000);
        }
    }
});

// ==========================================
// 5. التشغيل عند فتح الصفحة
// ==========================================
window.onload = function() {
    updateDisplay();
    // تطبيق اللون المحفوظ
    const color = localStorage.getItem('themeColor');
    if (color) document.documentElement.style.setProperty('--primary', color);
};
