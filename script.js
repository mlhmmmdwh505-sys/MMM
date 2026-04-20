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
// 1. المتغيرات الأساسية
let timer = null;
let timeLeft = (parseInt(localStorage.getItem('savedMins')) || 25) * 60;
let coins = parseInt(localStorage.getItem('userCoins')) || 1000;

// دالة تحويل الأرقام الإنجليزية لعربية (للعرض فقط لو حابب)
function toArabicNumbers(n) {
    return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
}

// 2. دالة تحديث أرقام الكتابة (المحرك الرئيسي)
function updateUI() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // وعاء الأرقام الكبيرة
    const display = document.getElementById('pomoDisplay');
    if (display) {
        // بنعرضها بتنسيق 00:00 وبنتأكد إنها أرقام "نظيفة"
        display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // تحديث رصيد النقاط فوق (الشنطة)
    const coinCount = document.getElementById('coinCount');
    if (coinCount) {
        coinCount.innerText = coins;
    }
}

// 3. زرار "تأكيد الإعدادات" (اللي بيحدث الرقم اللي كتبته)
const saveBtn = document.querySelector('.btn-save');
if (saveBtn) {
    saveBtn.onclick = function(e) {
        e.preventDefault();
        
        // قراءة الرقم من خانة "الدقائق"
        const minsInput = document.querySelector('.minutes-input') || document.querySelector('input[type="number"]');
        
        if (minsInput && minsInput.value) {
            // تحويل أي أرقام مدخلة لأرقام إنجليزية عشان الكود يفهمها
            const cleanVal = minsInput.value.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
            const newMins = parseInt(cleanVal);
            
            if (!isNaN(newMins)) {
                timeLeft = newMins * 60;
                localStorage.setItem('savedMins', newMins);
                updateUI();
                alert("تم تحديث الدقائق بنجاح!");
            }
        }
    };
}

// 4. أزرار التايمر (ابدأ وإعادة ضبط)
window.startTimer = function() {
    if (timer) return;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateUI();
        } else {
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
};

window.resetTimer = function() {
    clearInterval(timer);
    timer = null;
    timeLeft = (parseInt(localStorage.getItem('savedMins')) || 25) * 60;
    updateUI();
};

// تشغيل عند التحميل
window.onload = updateUI;
