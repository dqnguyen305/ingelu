function createHeart() {

    const count = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement("div");
        heart.classList.add("flying-heart");

        heart.innerHTML = "❤️";

        // vị trí ngẫu nhiên trên toàn màn hình
        heart.style.left = Math.random() * window.innerWidth + "px";
        heart.style.top = window.innerHeight + "px"; // bắt đầu từ đáy

        // kích thước random
        const size = Math.random() * 20 + 20;
        heart.style.fontSize = size + "px";

        document.getElementById("heart-container").appendChild(heart);

        // bay lên
        setTimeout(() => {
            heart.style.transform = `translateY(-${window.innerHeight + 200}px)`;
            heart.style.opacity = 0;
        }, 100);

        // xóa sau 5s
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }
}

// tạo trái tim mỗi 300ms
setInterval(createHeart, 300);


// ====================== POPUP ======================

const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const btnGift = document.querySelector(".btn-gift");

btnGift.addEventListener("click", () => {
    popup.classList.remove("hidden");
    startFireworks();
});

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
    stopFireworks();
});

// ====================== FIREWORKS ======================

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

let fireworks = [];
let running = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

function Firework() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.4;
    this.speed = 4 + Math.random() * 3;
    this.exploded = false;
    this.particles = [];
}

Firework.prototype.update = function () {
    if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
            this.exploded = true;
            this.explode();
        }
    }
};

Firework.prototype.explode = function () {
    const count = 30 + Math.random() * 30;

    for (let i = 0; i < count; i++) {
        this.particles.push({
            x: this.x,
            y: this.y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 4 + 2,
            life: 60 + Math.random() * 20,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`
        });
    }
};

Firework.prototype.draw = function () {
    if (!this.exploded) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.x, this.y, 3, 3);
    }

    this.particles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
    });

    this.particles = this.particles.filter(p => p.life > 0);
};

function loop() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.06) {
        fireworks.push(new Firework());
    }

    fireworks.forEach((fw) => {
        fw.update();
        fw.draw();
    });

    fireworks = fireworks.filter(fw => !fw.exploded || fw.particles.length > 0);

    requestAnimationFrame(loop);
}

function startFireworks() {
    running = true;
    fireworks = [];
    loop();
}

function stopFireworks() {
    running = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// ====================== POPUP + TYPING EFFECT ======================

const popupText = document.getElementById("popupText");

const message = `Chúc mừng sinh nhật Linh.
Cảm ơn em đã đến bên anh và làm cuộc đời anh trở nên rực rỡ và ý nghĩa hơn. 
Mỗi khoảnh khắc bên em đều là một món quà. 
Chúc em luôn bình an, vui vẻ, và chúng ta sẽ cùng nhau tạo nên thêm thật nhiều kỷ niệm đáng nhớ trong năm tới nhé! 
Mãi yêu Linh. 💖`;

let typingIndex = 0;
let typingTimer;

function typeText() {
    if (typingIndex < message.length) {
        popupText.textContent += message.charAt(typingIndex);
        typingIndex++;
        typingTimer = setTimeout(typeText, 48); // tốc độ gõ (ms)
    }
}

btnGift.addEventListener("click", () => {
    popupText.textContent = "";
    typingIndex = 0;

    popup.classList.remove("hidden");
    typeText();      // bắt đầu hiệu ứng gõ chữ
    startFireworks();
});

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
    clearTimeout(typingTimer);
    stopFireworks();
});

