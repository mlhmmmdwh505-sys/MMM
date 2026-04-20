// ==========================================
// 1. الحالة العامة (Data State)
// ==========================================
let timer = null;
let coins = parseInt(localStorage.getItem('userCoins')) || 1000; 
let timeLeft = (parseInt(localStorage.getItem('savedMins')) || 25) * 60;

// ==========================================
// 2. تحديث الشاشة (UI Update)
// ==========================================
function updateAll() {
    // تحديث التايمر
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const pomoDisplay = document.getElementById('pomoDisplay');
    if (pomoDisplay) {
        pomoDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // تحديث النقاط فوق
    const coinDisplay = document.getElementById('coinCount');
    if (coinDisplay) {
        coinDisplay.innerText = coins;
    }
    
    // حفظ البيانات
    localStorage.setItem('userCoins', coins);
}

// ==========================================
// 3. التحكم في التايمر (ابدأ / إعادة)
// ==========================================
function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateAll();
        } else {
            stopTimer();
            alert("أحسنت يا دكتور! انتهت المهمة.");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    stopTimer();
    const savedMins = parseInt(localStorage.getItem('savedMins')) || 25;
    timeLeft = savedMins * 60;
    updateAll();
}

// ==========================================
// 4. نظام النقاط والمتجر (Events)
// ==========================================
document.addEventListener('click', function(e) {
    const target = e.target;

    // زرار ابدأ المهمة
    if (target.innerText.includes("ابدأ") || target.classList.contains('btn-start')) {
        startTimer();
    }

    // زرار إعادة ضبط
    if (target.innerText.includes("إعادة") || target.classList.contains('btn-reset')) {
        resetTimer();
    }

    // زرار السلة (تصفير النقاط)
    if (target.closest('.reset-mini') || target.closest('#trashBtn')) {
        if (confirm("هل تريد تصفير نقاطك؟")) {
            coins = 0;
            updateAll();
        }
    }

    // متجر الطاقة (شراء دقائق)
    const shopItem = target.closest('.item');
    if (shopItem) {
        const minutes = parseInt(shopItem.innerText.match(/\d+/)[0]);
        const cost = minutes * 15;
        if (coins >= cost) {
            coins -= cost;
            timeLeft += (minutes * 60);
            updateAll();
        } else {
            alert(`تحتاج إلى ${cost} نقطة. رصيدك الحالي ${coins}`);
        }
    }

    // زرار تأكيد الإعدادات
    if (target.classList.contains('btn-save') || target.innerText.includes("تأكيد")) {
        e.preventDefault();
        const minsInput = document.querySelector('.minutes-input') || document.querySelector('input[type="number"]');
        const colorInput = document.getElementById('colorPicker');
        
        if (minsInput && minsInput.value) {
            localStorage.setItem('savedMins', minsInput.value);
            timeLeft = parseInt(minsInput.value) * 60;
        }
        if (colorInput) {
            localStorage.setItem('themeColor', colorInput.value);
            document.documentElement.style.setProperty('--primary', colorInput.value);
        }
        
        updateAll();
        target.innerText = "تم ✅";
        setTimeout(() => target.innerText = "تأكيد الإعدادات", 2000);
    }
});

// ==========================================
// 5. التشغيل النهائي
// ==========================================
window.onload = function() {
    // استعادة اللون
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) document.documentElement.style.setProperty('--primary', savedColor);
    
    // تشغيل الـ UI
    updateAll();

    // تشغيل عداد التخرج (لو موجود)
    if (document.getElementById('years')) {
        setInterval(updateGraduationCountdown, 1000);
    }
};

function updateGraduationCountdown() {
    const targetDate = localStorage.getItem('graduationDate');
    if (!targetDate) return;
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    if (diff > 0) {
        document.getElementById("years").innerText = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString().padStart(2, '0');
        document.getElementById("days").innerText = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    }
}
