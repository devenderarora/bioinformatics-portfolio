const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const config = {
    particleCount: 80,
    particleBaseSize: 2,
    linkDistance: 150,
    mouseRadius: 150,
    particleColor: 'rgba(16, 185, 129, 0.5)', // Emerald
    linkColor: 'rgba(6, 182, 212, 0.2)'      // Cyan
};

let mouse = {
    x: null,
    y: null
};

// Resize canvas
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * config.particleBaseSize + 1;
    }

    update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseRadius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (config.mouseRadius - distance) / config.mouseRadius;
                
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.linkDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                
                // Fade out link as distance increases
                let opacity = 1 - (distance / config.linkDistance);
                ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Add shockwave effect on click
window.addEventListener('click', (e) => {
    particles.forEach(p => {
        let dx = e.x - p.x;
        let dy = e.y - p.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < 300) {
            p.vx -= (dx / distance) * 10;
            p.vy -= (dy / distance) * 10;
        }
    });
});

// Start
resize();
animate();

/* =========================================
   SURREAL ENHANCEMENTS
========================================= */

// 1. Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Slight delay for outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Cursor hover effects on links/buttons
document.querySelectorAll('a, button, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// 2. Scroll Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// 3. Holographic 3D Tilt Effect
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// 4. Simulated AI Chatbox Logic
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatHeader = document.getElementById('chat-header');
const chatWidget = document.getElementById('chat-widget');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatBody = document.getElementById('chat-body');

// Toggle chatbox
chatHeader.addEventListener('click', (e) => {
    if (e.target.id !== 'chat-toggle-btn' && e.target.tagName !== 'BUTTON') {
        chatWidget.classList.toggle('minimized');
        chatToggleBtn.textContent = chatWidget.classList.contains('minimized') ? '+' : '-';
    }
});
chatToggleBtn.addEventListener('click', () => {
    chatWidget.classList.toggle('minimized');
    chatToggleBtn.textContent = chatWidget.classList.contains('minimized') ? '+' : '-';
});

// Chat logic dictionary
const qaDB = {
    'skill': 'I specialize in Multi-Omics integration (DIABLO, MOFA), scRNA-seq, Proteomics, and developing scalable pipelines using Nextflow, Python, and R.',
    'contact': 'You can reach out to me at devarora@hotmail.com or connect with me on LinkedIn!',
    'purdue': 'At Purdue University, I lead complex biological systems profiling utilizing advanced machine learning techniques.',
    'experience': 'I have been working in bioinformatics since 2017, starting at a Research Institute, moving to a Genomic Center, and currently as a Senior Scientist at Purdue.',
    'hello': 'Greetings. I am ready to process your queries.',
    'hi': 'Greetings. I am ready to process your queries.',
    'who': 'I am Devender Arora, a Senior Bioinformatics Scientist and Computational Biologist.'
};

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message');
    msgDiv.classList.add(isUser ? 'user-message' : 'ai-message');
    msgDiv.innerHTML = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function handleQuery() {
    const text = chatInput.value.trim().toLowerCase();
    if (!text) return;
    
    addMessage(text, true);
    chatInput.value = '';
    
    // Simulate AI processing delay
    setTimeout(() => {
        let responded = false;
        for (const [key, answer] of Object.entries(qaDB)) {
            if (text.includes(key)) {
                addMessage(answer);
                responded = true;
                break;
            }
        }
        if (!responded) {
            addMessage("Data not found. Please query about my 'skills', 'experience', 'contact', or 'Purdue'.");
        }
    }, 600);
}

chatSendBtn.addEventListener('click', handleQuery);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleQuery();
});
