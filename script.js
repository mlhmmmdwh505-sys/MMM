// 1. البيانات الأساسية
let timer = null;
let coins = parseInt(localStorage.getItem('userCoins')) || 1000;
let timeLeft = (parseInt(localStorage.getItem('savedMins')) || 25) * 60;

// 2. تحديث الشاشة
function updateUI() {
    const coinSpan = document.getElementById('coinCount');
    const timerSpan = document.getElementById('pomoDisplay');
    
    if (coinSpan) coinSpan.innerText = coins;
    if (timerSpan) {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        timerSpan.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    localStorage.setItem('userCoins', coins);
}

// 3. التحكم بالتايمر
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

// 4. السلة والمتجر
window.resetPoints = function() {
    if(confirm("تصفير النقاط؟")) { coins = 0; updateUI(); }
};

document.addEventListener('click', (e) => {
    const item = e.target.closest('.item');
    if (item) {
        const mins = parseInt(item.innerText.match(/\d+/)[0]);
        const price = mins * 15;
        if (coins >= price) {
            coins -= price;
            timeLeft += (mins * 60);
            updateUI();
        } else { alert("رصيدك غير كافٍ"); }
    }
});

// 5. حفظ الإعدادات
document.querySelector('.btn-save').onclick = function() {
    const mInput = document.querySelector('.minutes-input');
    const cInput = document.getElementById('colorPicker');
    const dInput = document.getElementById('gradDate');

    if (mInput.value) {
        localStorage.setItem('savedMins', mInput.value);
        timeLeft = mInput.value * 60;
    }
    if (cInput.value) {
        localStorage.setItem('themeColor', cInput.value);
        document.documentElement.style.setProperty('--primary', cInput.value);
    }
    if (dInput.value) localStorage.setItem('graduationDate', dInput.value);

    updateUI();
    this.innerText = "تم ✅";
    setTimeout(() => this.innerText = "تأكيد الإعدادات", 2000);
};

// 6. عند التحميل
window.onload = () => {
    const color = localStorage.getItem('themeColor');
    if (color) document.documentElement.style.setProperty('--primary', color);
    updateUI();
    setInterval(updateGrad, 1000);
};

function updateGrad() {
    const date = localStorage.getItem('graduationDate');
    if (!date) return;
    const diff = new Date(date).getTime() - new Date().getTime();
    if (diff > 0) {
        document.getElementById('years').innerText = Math.floor(diff / (1000*60*60*24*365));
        document.getElementById('days').innerText = Math.floor((diff % (1000*60*60*24*365)) / (1000*60*60*24));
        document.getElementById('hours').innerText = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    }
}
