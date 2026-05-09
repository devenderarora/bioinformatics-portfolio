// =====================================================
// CENTRAL DOGMA SPLASH SCREEN
// =====================================================
(function() {
    const splashOverlay = document.getElementById('splash-overlay');
    const dogmaCanvas   = document.getElementById('dogma-canvas');
    const dctx          = dogmaCanvas.getContext('2d');
    const startBtn      = document.getElementById('start-codon-btn');

    // Resize dogma canvas
    function resizeDogma() {
        dogmaCanvas.width  = window.innerWidth;
        dogmaCanvas.height = window.innerHeight;
    }
    resizeDogma();
    window.addEventListener('resize', resizeDogma);

    // Starfield / floating nucleotide background on the dogma canvas
    const NUCLEOTIDES = ['A', 'T', 'G', 'C', 'U'];
    const stars = Array.from({ length: 100 }, () => ({
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        speed: 0.15 + Math.random() * 0.35,
        size:  10 + Math.random() * 8,
        alpha: 0.04 + Math.random() * 0.12,
        char:  NUCLEOTIDES[Math.floor(Math.random() * NUCLEOTIDES.length)]
    }));

    function animateDogmaBackground() {
        if (!splashOverlay || splashOverlay.classList.contains('hidden')) return;
        dctx.clearRect(0, 0, dogmaCanvas.width, dogmaCanvas.height);
        dctx.font = '14px "Fira Code", monospace';

        for (const s of stars) {
            dctx.fillStyle = `rgba(16, 185, 129, ${s.alpha})`;
            dctx.fillText(s.char, s.x, s.y);
            s.y += s.speed;
            if (s.y > dogmaCanvas.height + 20) {
                s.y = -20;
                s.x = Math.random() * dogmaCanvas.width;
                s.char = NUCLEOTIDES[Math.floor(Math.random() * NUCLEOTIDES.length)];
            }
        }
        requestAnimationFrame(animateDogmaBackground);
    }
    animateDogmaBackground();

    // Dismiss splash on ATG click
    startBtn.addEventListener('click', () => {
        startBtn.textContent = '> Translating...';
        startBtn.style.color = '#10b981';
        setTimeout(() => {
            splashOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 600);
    });

    // Prevent scrolling while splash is visible
    document.body.style.overflow = 'hidden';
    splashOverlay.addEventListener('transitionend', () => {
        if (splashOverlay.classList.contains('hidden')) {
            splashOverlay.style.display = 'none';
        }
    });
})();

// =====================================================
// MOBILE NAV — Hamburger Menu
// =====================================================
const hamburgerBtn  = document.getElementById('hamburger-btn');
const navMobile     = document.getElementById('nav-mobile');
const navMobileClose = document.getElementById('nav-mobile-close');

function openNav() {
    navMobile.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeNav() {
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
}

if (hamburgerBtn)   hamburgerBtn.addEventListener('click', openNav);
if (navMobileClose) navMobileClose.addEventListener('click', closeNav);

// =====================================================
// DA LOGO — Return to Central Dogma Splash
// =====================================================
const daLogoLink = document.querySelector('.logo');
if (daLogoLink) {
    daLogoLink.addEventListener('click', (e) => {
        e.preventDefault();
        const splash = document.getElementById('splash-overlay');
        if (splash) {
            splash.style.display = 'flex';   // make it visible again
            // Force reflow so the transition fires
            splash.offsetHeight;
            splash.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            // Scroll portfolio back to top silently
            window.scrollTo({ top: 0 });
        }
    });
}

// =====================================================
// SATELLITE RESCALING — Keep positions proportional on mobile
// =====================================================
// Original positions are calculated for a 580x580 wrapper.
// When the wrapper shrinks via CSS width/height, we rescale by ratio.
const SAT_ORIGINAL_SIZE = 580;
const SAT_DATA = [
    { selector: '.sat-top', ox: 290, oy: 35  },
    { selector: '.sat-tr',  ox: 540, oy: 168 },
    { selector: '.sat-br',  ox: 540, oy: 412 },
    { selector: '.sat-bl',  ox: 40,  oy: 412 },
    { selector: '.sat-tl',  ox: 40,  oy: 168 },
];

function rescaleSatellites() {
    const wrapper = document.querySelector('.orbit-wrapper');
    if (!wrapper) return;
    const currentSize = wrapper.offsetWidth;
    const ratio = currentSize / SAT_ORIGINAL_SIZE;
    SAT_DATA.forEach(({ selector, ox, oy }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.left = (ox * ratio) + 'px';
            el.style.top  = (oy * ratio) + 'px';
        }
    });
}

// Run on load and on resize
window.addEventListener('load',   rescaleSatellites);
window.addEventListener('resize', rescaleSatellites);
rescaleSatellites();

// =====================================================
// BIO RIDDLE WIDGET
// =====================================================
const riddles = [
    { q: "I carry the blueprint but never leave the vault. What am I?", a: "DNA" },
    { q: "I translate the message into function, reading three at a time. What am I?", a: "Ribosome" },
    { q: "I silence genes without changing the code, adding tags to the text. What am I?", a: "Epigenetics (DNA Methylation)" },
    { q: "I cut exactly where you tell me, a bacterial immune system repurposed. What am I?", a: "CRISPR-Cas9" },
    { q: "I am the sum of all transcripts, a snapshot of cellular intent. What am I?", a: "Transcriptome" },
    { q: "I find the hidden similarities, aligning sequences locally or globally. What am I?", a: "BLAST" },
    { q: "I measure the mass-to-charge ratio of flying ions. What am I?", a: "Mass Spectrometer" },
    { q: "I map the 3D folding of genomes inside the nucleus. What am I?", a: "Hi-C (Chromosome Conformation Capture)" },
    { q: "I assemble short reads back into a complete genome puzzle. What am I?", a: "De Bruijn Graph (or Genome Assembler)" },
    { q: "I separate cellular noise to profile single cells one by one. What am I?", a: "scRNA-seq (Single-cell RNA sequencing)" }
];

let currentRiddleIndex = 0;
const questionEl = document.getElementById('riddle-question');
const answerEl = document.getElementById('riddle-answer');
const counterEl = document.getElementById('riddle-counter');
const revealBtn = document.getElementById('riddle-reveal-btn');
const nextBtn = document.getElementById('riddle-next-btn');

function updateRiddle() {
    if (!questionEl) return;
    questionEl.textContent = riddles[currentRiddleIndex].q;
    answerEl.textContent = riddles[currentRiddleIndex].a;
    answerEl.classList.remove('visible');
    counterEl.textContent = `${currentRiddleIndex + 1} / ${riddles.length}`;
}

if (revealBtn) {
    revealBtn.addEventListener('click', () => {
        answerEl.classList.add('visible');
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentRiddleIndex = (currentRiddleIndex + 1) % riddles.length;
        updateRiddle();
    });
}

// Initialize first riddle
updateRiddle();

// =====================================================
// MAIN PORTFOLIO CANVAS
// =====================================================
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let macromolecules = [];

// Configuration
const config = {
    particleCount: 40,
    macroCount: 40,
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
    constructor(x, y, burst = false) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : Math.random() * height;
        let speed = burst ? 5 : 1;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.size = Math.random() * config.particleBaseSize + 1;
        this.color = config.particleColor;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

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
        
        // Slow down burst particles over time
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Macromolecule {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        
        const types = ['dna', 'rna', 'protein', 'lipid', 'carbohydrate', 'metabolite'];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        this.fused = false;
        this.fusedWith = null;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.time = Math.random() * 100;
        
        if (this.type === 'dna') this.color = 'rgba(16, 185, 129, 0.8)'; // Emerald
        if (this.type === 'rna') this.color = 'rgba(6, 182, 212, 0.8)';  // Cyan
        if (this.type === 'protein') this.color = 'rgba(139, 92, 246, 0.8)'; // Purple
        if (this.type === 'lipid') this.color = 'rgba(245, 158, 11, 0.8)'; // Amber
        if (this.type === 'carbohydrate') this.color = 'rgba(236, 72, 153, 0.8)'; // Pink
        if (this.type === 'metabolite') this.color = 'rgba(234, 179, 8, 0.8)'; // Yellow
    }

    update(others) {
        this.time += 0.05;
        this.rotation += this.rotationSpeed;
        
        if (this.fused && this.fusedWith) {
            // Orbit fused partner
            let dx = this.fusedWith.x - this.x;
            let dy = this.fusedWith.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 30) {
                this.vx += (dx / dist) * 0.05;
                this.vy += (dy / dist) * 0.05;
            }
            this.color = 'rgba(255, 255, 255, 0.9)'; // Glow white when fused
        } else {
            // Check collisions
            for (let other of others) {
                if (other === this || other.fused) continue;
                let dx = other.x - this.x;
                let dy = other.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 40) {
                    this.fuse(other);
                    break;
                }
            }
        }

        this.x += this.vx;
        this.y += this.vy;
        
        // Damping (fixed bug to allow negative velocity damping)
        if (Math.abs(this.vx) > 1.5) this.vx *= 0.9;
        if (Math.abs(this.vy) > 1.5) this.vy *= 0.9;

        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
    }
    
    fuse(other) {
        this.fused = true;
        other.fused = true;
        this.fusedWith = other;
        other.fusedWith = this;
        
        // Burst particles
        for(let i=0; i<8; i++) {
            particles.push(new Particle((this.x + other.x)/2, (this.y + other.y)/2, true));
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1.5;
        
        if (this.fused) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
        }

        if (this.type === 'dna') {
            // Draw double helix
            ctx.beginPath();
            for(let i=-20; i<=20; i+=4) {
                let y1 = Math.sin(this.time + i*0.2) * 8;
                let y2 = Math.sin(this.time + Math.PI + i*0.2) * 8;
                
                // Rungs
                ctx.moveTo(i, y1);
                ctx.lineTo(i, y2);
                
                // Backbones
                ctx.fillRect(i-1, y1-1, 2, 2);
                ctx.fillRect(i-1, y2-1, 2, 2);
            }
            ctx.stroke();
        } 
        else if (this.type === 'rna') {
            // Draw single wavy strand
            ctx.beginPath();
            ctx.moveTo(-20, Math.sin(this.time - 20*0.3) * 6);
            for(let i=-20; i<=20; i+=2) {
                ctx.lineTo(i, Math.sin(this.time + i*0.3) * 6);
            }
            ctx.stroke();
            // Bases
            for(let i=-18; i<=18; i+=6) {
                let y = Math.sin(this.time + i*0.3) * 6;
                ctx.beginPath();
                ctx.moveTo(i, y);
                ctx.lineTo(i, y + 4);
                ctx.stroke();
            }
        } 
        else if (this.type === 'protein') {
            // Draw folded blob (3-4 intersecting circles)
            const blobs = [
                {x: -6, y: -4, r: 6},
                {x: 6, y: -2, r: 8},
                {x: -2, y: 6, r: 7},
                {x: 8, y: 5, r: 5}
            ];
            ctx.beginPath();
            blobs.forEach(b => {
                ctx.moveTo(b.x + b.r, b.y);
                ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
            });
            ctx.fill();
        }
        else if (this.type === 'lipid') {
            // Draw lipid (circle head with two wavy tails)
            ctx.beginPath();
            ctx.arc(0, -6, 4, 0, Math.PI*2); // Head
            ctx.fill();
            
            ctx.beginPath();
            // Tail 1
            ctx.moveTo(-2, -2);
            ctx.lineTo(-4, 4);
            ctx.lineTo(-2, 10);
            ctx.lineTo(-4, 16);
            // Tail 2
            ctx.moveTo(2, -2);
            ctx.lineTo(4, 5);
            ctx.lineTo(1, 11);
            ctx.lineTo(3, 17);
            ctx.stroke();
        }
        else if (this.type === 'carbohydrate') {
            // Draw hexagon ring (glucose-like)
            ctx.beginPath();
            for(let i=0; i<6; i++) {
                let angle = i * Math.PI / 3;
                let hx = Math.cos(angle) * 8;
                let hy = Math.sin(angle) * 8;
                if(i===0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.stroke();
            // Add a side branch
            ctx.beginPath();
            ctx.moveTo(4, -6.9);
            ctx.lineTo(8, -12);
            ctx.stroke();
        }
        else if (this.type === 'metabolite') {
            // Draw a small distinct triangle
            ctx.beginPath();
            for(let i=0; i<3; i++) {
                let angle = i * Math.PI * 2 / 3 - Math.PI/2;
                let px = Math.cos(angle) * 7;
                let py = Math.sin(angle) * 7;
                if(i===0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    macromolecules = [];
    
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
    for (let i = 0; i < config.macroCount; i++) {
        macromolecules.push(new Macromolecule());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & Draw Macromolecules
    for (let i = 0; i < macromolecules.length; i++) {
        macromolecules[i].update(macromolecules);
        macromolecules[i].draw();
        
        if (macromolecules[i].fused) {
            // Draw bright, dense network web when fused
            for(let j = 0; j < particles.length; j++) {
                let dx = macromolecules[i].x - particles[j].x;
                let dy = macromolecules[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(macromolecules[i].x, macromolecules[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist/180) * 0.4})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        } else {
            // Draw faint links from macromolecules to nearby particles
            for(let j = 0; j < particles.length; j++) {
                let dx = macromolecules[i].x - particles[j].x;
                let dy = macromolecules[i].y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 80) {
                    ctx.beginPath();
                    ctx.moveTo(macromolecules[i].x, macromolecules[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist/80) * 0.15})`;
                    ctx.stroke();
                }
            }
        }
    }

    // Update & Draw Particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.linkDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                let opacity = 1 - (distance / config.linkDistance);
                ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.2})`;
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
    macromolecules.forEach(m => {
        let dx = e.x - m.x;
        let dy = e.y - m.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < 200) {
            m.vx -= (dx / distance) * 5;
            m.vy -= (dy / distance) * 5;
            
            // Break fusions on click
            if (m.fused) {
                m.fused = false;
                m.fusedWith = null;
                m.color = m.type === 'dna' ? 'rgba(16, 185, 129, 0.8)' : 
                          m.type === 'rna' ? 'rgba(6, 182, 212, 0.8)' : 
                          m.type === 'protein' ? 'rgba(139, 92, 246, 0.8)' :
                          m.type === 'lipid' ? 'rgba(245, 158, 11, 0.8)' :
                          'rgba(236, 72, 153, 0.8)';
            }
        }
    });
});

// Start
resize();
animate();

/* =========================================
   SURREAL ENHANCEMENTS
========================================= */

// 1. Scroll Reveal Animations
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

// GEMINI API INTEGRATION
// IMPORTANT: Replace this with your actual Google Gemini API Key from https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyBpzj98DVi3OPUboKWeExslN9Z7cNBeimM';

let chatHistory = [];

const systemPrompt = `You are DA Terminal AI, a simulated AI assistant for Devender Arora, a Senior Bioinformatics Scientist. 
You are integrated into his portfolio website.
Your goal is to answer questions about his career, skills, publications, and contact info based on his resume data.
Data:
- Current Role: Bioinformatics Senior Research Scientist at Purdue University (Jan 2023 - Present). Managing scRNA-seq, Proteomics, Metagenomics, Spatial Transcriptomics.
- Past Roles: Postdoctoral Fellow at Purdue (2022) & National Institute of Animal Science, South Korea (2019-2021). Senior Research Fellow at IASRI, India (2018-2019).
- Education: Ph.D. in Biotechnology (Bioinformatics) from Uttarakhand Technical University.
- Skills: Multi-Omics integration (DIABLO, MOFA, IntegrAO), scRNA-seq, Proteomics, Epigenetics (ChIP-seq, ATAC-seq), Nextflow, Snakemake, Python, R, Machine Learning/Deep Learning, Docker.
- Recent Pubs: Hessian fly tolerance in wheat (2026), Phage therapy impact (2026), Mouse bone spatial gene expression (2026), Fungi in asthmatic horses (2026), Candida auris single-cell transcriptomics (2024).
- Contact: devarora@hotmail.com, +1-7657469053, or LinkedIn.
Keep responses short, professional, and slightly robotic/terminal-like. Do not answer questions unrelated to Devender Arora or bioinformatics.`;

const qaDB = {
    'skill': 'I specialize in Multi-Omics integration (DIABLO, MOFA), scRNA-seq, Proteomics, and Machine Learning using Python, R, and Nextflow.',
    'contact': 'You can reach out to me at devarora@hotmail.com or connect with me on LinkedIn.',
    'purdue': 'At Purdue University, I manage scRNA-seq, Proteomics, Metagenomics, and Spatial Transcriptomics projects.',
    'experience': 'I have over 8 years of experience in bioinformatics, starting as an SRF in India, a Postdoc in South Korea, and currently a Senior Scientist at Purdue.',
    'publication': 'My recent publications include papers in Scientific Reports, Communication Biology, and PLoS Pathogens focusing on multi-omics and transcriptomics.',
    'hello': 'Greetings. I am ready to process your queries. You can ask about my skills, experience, or publications.',
    'hi': 'Greetings. I am ready to process your queries.',
    'who': 'I am DA Terminal AI, a simulated assistant for Devender Arora, a Senior Bioinformatics Scientist.'
};

function getStaticResponse(text) {
    text = text.toLowerCase();
    for (const [key, answer] of Object.entries(qaDB)) {
        if (text.includes(key)) {
            return answer;
        }
    }
    return "Data not found. Please query about my 'skills', 'experience', 'publications', 'contact', or 'Purdue'.";
}

async function fetchGeminiResponse(userMessage) {
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        return "ERROR: API Key not configured. Please open `script.js` and add your Free Gemini API Key.";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // Construct conversation payload
    const contents = [];
    
    // Add history
    for (const msg of chatHistory) {
        contents.push({ role: msg.role, parts: [{ text: msg.text }] });
    }
    
    // Add current message
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    const payload = {
        system_instruction: { parts: { text: systemPrompt } },
        contents: contents
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error && data.error.message) {
            console.error("API Error:", data.error.message);
            throw new Error("API Limit or Revoked");
        } else {
            console.error("Unknown Error:", data);
            throw new Error("Unknown response structure");
        }
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message');
    msgDiv.classList.add(isUser ? 'user-message' : 'ai-message');
    // Format bold text from markdown
    msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function handleQuery() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    chatInput.value = '';
    chatInput.disabled = true;
    chatSendBtn.disabled = true;
    
    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chat-message', 'ai-message');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = "Processing query...";
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Fetch response
    let aiResponse;
    try {
        if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') throw new Error("No API Key");
        aiResponse = await fetchGeminiResponse(text);
    } catch (err) {
        console.log("API offline or key revoked. Falling back to static database.");
        // Add a slight delay to simulate processing for the static response
        await new Promise(resolve => setTimeout(resolve, 600));
        aiResponse = getStaticResponse(text);
    }
    
    // Remove typing indicator
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
    
    // Save to history
    chatHistory.push({ role: "user", text: text });
    chatHistory.push({ role: "model", text: aiResponse });
    
    // Keep history manageable
    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
    
    addMessage(aiResponse);
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    chatInput.focus();
}

chatSendBtn.addEventListener('click', handleQuery);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleQuery();
});
