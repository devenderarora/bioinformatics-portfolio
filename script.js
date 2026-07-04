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

// =====================================================
// SEQUENCE & STRUCTURE ANALYZER MODULE
// =====================================================
(function() {
    // DOM Elements
    const modal = document.getElementById('seq-analyzer-modal');
    const closeBtn = document.getElementById('seq-modal-close-btn');
    const tabBtns = document.querySelectorAll('.seq-tab-btn');
    const tabContents = document.querySelectorAll('.seq-tab-content');
    
    const nodeDna = document.getElementById('node-dna');
    const nodeRna = document.getElementById('node-rna');
    const nodeProtein = document.getElementById('node-protein');

    // DNA Elements
    const dnaInput = document.getElementById('dna-input');
    const analyzeDnaBtn = document.getElementById('analyze-dna-btn');
    const resultsDna = document.getElementById('results-dna');
    const dnaGcBar = document.getElementById('dna-gc-bar');
    const dnaGcVal = document.getElementById('dna-gc-val');
    const dnaLenVal = document.getElementById('dna-len-val');
    const dnaTranscribeDisplay = document.getElementById('dna-transcribe-display');
    const dnaTranslateDisplay = document.getElementById('dna-translate-display');
    const dnaExplanation = document.getElementById('dna-explanation');

    // RNA Elements
    const rnaInput = document.getElementById('rna-input');
    const analyzeRnaBtn = document.getElementById('analyze-rna-btn');
    const resultsRna = document.getElementById('results-rna');
    const rnaMwVal = document.getElementById('rna-mw-val');
    const rnaLenVal = document.getElementById('rna-len-val');
    const rnaStructureDisplay = document.getElementById('rna-structure-display');
    const rnaExplanation = document.getElementById('rna-explanation');

    // Protein Elements
    const typeBtnSeq = document.getElementById('type-btn-seq');
    const typeBtnPdb = document.getElementById('type-btn-pdb');
    const modeProteinSeq = document.getElementById('mode-protein-seq');
    const modeProteinPdb = document.getElementById('mode-protein-pdb');
    
    const proteinInput = document.getElementById('protein-input');
    const analyzeProteinBtn = document.getElementById('analyze-protein-btn');
    const resultsProteinSeq = document.getElementById('results-protein-seq');
    const proteinPiVal = document.getElementById('protein-pi-val');
    const proteinGravyVal = document.getElementById('protein-gravy-val');
    const compAcidicBar = document.getElementById('comp-acidic-bar');
    const compBasicBar = document.getElementById('comp-basic-bar');
    const compPolarBar = document.getElementById('comp-polar-bar');
    const compHydrophobicBar = document.getElementById('comp-hydrophobic-bar');
    const compAcidicPct = document.getElementById('comp-acidic-pct');
    const compBasicPct = document.getElementById('comp-basic-pct');
    const compPolarPct = document.getElementById('comp-polar-pct');
    const compHydrophobicPct = document.getElementById('comp-hydrophobic-pct');
    const phosphoSummaryText = document.getElementById('phospho-summary-text');
    const phosphoTable = document.getElementById('phospho-table');
    const phosphoTableBody = document.getElementById('phospho-table-body');
    const proteinExplanation = document.getElementById('protein-explanation');

    // PDB Elements
    const pdbInput = document.getElementById('pdb-input');
    const analyzePdbBtn = document.getElementById('analyze-pdb-btn');
    const resultsProteinPdb = document.getElementById('results-protein-pdb');
    const pdbTitleHeader = document.getElementById('pdb-title-header');
    const pdbInfoTitle = document.getElementById('pdb-info-title');
    const pdbInfoOrganism = document.getElementById('pdb-info-organism');
    const pdbInfoMethod = document.getElementById('pdb-info-method');
    const pdbInfoResolution = document.getElementById('pdb-info-resolution');
    const pdbInfoDate = document.getElementById('pdb-info-date');
    const pdbInfoCitation = document.getElementById('pdb-info-citation');
    const pdb3dLoader = document.getElementById('pdb-3d-loader');
    const pdbIframe = document.getElementById('pdb-iframe');

    // Local PDB File Upload Elements
    const typeBtnUpload = document.getElementById('type-btn-upload');
    const modeProteinUpload = document.getElementById('mode-protein-upload');
    const resultsProteinUpload = document.getElementById('results-protein-upload');
    const pdbFileInput = document.getElementById('pdb-file-input');
    const pdbFileName = document.getElementById('pdb-file-name');
    const analyzePdbFileBtn = document.getElementById('analyze-pdb-file-btn');
    const pdbFileTitleHeader = document.getElementById('pdb-file-title-header');
    
    const pdbFileInfoTitle = document.getElementById('pdb-file-info-title');
    const pdbFileInfoOrganism = document.getElementById('pdb-file-info-organism');
    const pdbFileInfoMethod = document.getElementById('pdb-file-info-method');
    const pdbFileInfoLength = document.getElementById('pdb-file-info-length');
    const pdbFileSeqDisplay = document.getElementById('pdb-file-seq-display');
    
    const pdbFilePiVal = document.getElementById('pdb-file-pi-val');
    const pdbFileGravyVal = document.getElementById('pdb-file-gravy-val');
    const pdbFileCompAcidicBar = document.getElementById('pdb-file-comp-acidic-bar');
    const pdbFileCompBasicBar = document.getElementById('pdb-file-comp-basic-bar');
    const pdbFileCompPolarBar = document.getElementById('pdb-file-comp-polar-bar');
    const pdbFileCompHydrophobicBar = document.getElementById('pdb-file-comp-hydrophobic-bar');
    
    const pdbFileCompAcidicPct = document.getElementById('pdb-file-comp-acidic-pct');
    const pdbFileCompBasicPct = document.getElementById('pdb-file-comp-basic-pct');
    const pdbFileCompPolarPct = document.getElementById('pdb-file-comp-polar-pct');
    const pdbFileCompHydrophobicPct = document.getElementById('pdb-file-comp-hydrophobic-pct');
    
    const pdbFilePhosphoSummaryText = document.getElementById('pdb-file-phospho-summary-text');
    const pdbFilePhosphoTable = document.getElementById('pdb-file-phospho-table');
    const pdbFilePhosphoTableBody = document.getElementById('pdb-file-phospho-table-body');
    const pdbFileExplanation = document.getElementById('pdb-file-explanation');

    // Preset buttons mapping
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Codon mapping table
    const CODON_TABLE = {
        'UUU':'F', 'UUC':'F', 'UUA':'L', 'UUG':'L', 'UCU':'S', 'UCC':'S', 'UCA':'S', 'UCG':'S',
        'UAU':'Y', 'UAC':'Y', 'UAA':'*', 'UAG':'*', 'UGU':'C', 'UGC':'C', 'UGA':'*', 'UGG':'W',
        'CUU':'L', 'CUC':'L', 'CUA':'L', 'CUG':'L', 'CCU':'P', 'CCC':'P', 'CCA':'P', 'CCG':'P',
        'CAU':'H', 'CAC':'H', 'CAA':'Q', 'CAG':'Q', 'CGU':'R', 'CGC':'R', 'CGA':'R', 'CGG':'R',
        'AUU':'I', 'AUC':'I', 'AUA':'I', 'AUG':'M', 'ACU':'T', 'ACC':'T', 'ACA':'T', 'ACG':'T',
        'AAU':'N', 'AAC':'N', 'AAA':'K', 'AAG':'K', 'AGU':'S', 'AGC':'S', 'AGA':'R', 'AGG':'R',
        'GUU':'V', 'GUC':'V', 'GUA':'V', 'GUG':'V', 'GCU':'A', 'GCC':'A', 'GCA':'A', 'GCG':'A',
        'GAU':'D', 'GAC':'D', 'GAA':'E', 'GAG':'E', 'GGU':'G', 'GGC':'G', 'GGA':'G', 'GGG':'G'
    };

    // Hydropathy values for GRAVY
    const HYDROPATHY_VALUES = {
        'A': 1.8, 'R': -4.5, 'N': -3.5, 'D': -3.5, 'C': 2.5, 'Q': -3.5, 'E': -3.5, 'G': -0.4, 'H': -3.2,
        'I': 4.5, 'L': 3.8, 'K': -3.9, 'M': 1.9, 'F': 2.8, 'P': -1.6, 'S': -0.8, 'T': -0.7, 'W': -0.9,
        'Y': -1.3, 'V': 4.2
    };

    // AA 3-to-1 letter mapping for local PDB parsing
    const AA_3TO1 = {
        'ALA':'A', 'ARG':'R', 'ASN':'N', 'ASP':'D', 'CYS':'C', 'GLN':'Q', 'GLU':'E', 'GLY':'G', 'HIS':'H',
        'ILE':'I', 'LEU':'L', 'LYS':'K', 'MET':'M', 'PHE':'F', 'PRO':'P', 'SER':'S', 'THR':'T', 'TRP':'W',
        'TYR':'Y', 'VAL':'V', 'ASX':'B', 'GLX':'Z', 'SEC':'U', 'PYL':'O', 'XAA':'X'
    };

    // 1. Modal open/close actions
    function openModal(tabName) {
        if (!modal) return;
        modal.classList.remove('hidden');
        // Force reflow
        modal.offsetHeight;
        modal.classList.add('visible');
        
        // Hide the tabs container completely as requested to isolate portals
        const tabHeaderContainer = document.querySelector('.seq-modal-tabs');
        if (tabHeaderContainer) tabHeaderContainer.style.display = 'none';

        // Update modal title & subtitle dynamically
        const modalTitle = document.querySelector('.seq-modal-header h3');
        const modalSubtitle = document.querySelector('.seq-modal-subtitle');
        
        if (tabName === 'dna') {
            if (modalTitle) modalTitle.textContent = '🧬 DNA Sequence Analyzer';
            if (modalSubtitle) modalSubtitle.textContent = 'Deoxyribonucleic acid coding region properties & translation';
        } else if (tabName === 'rna') {
            if (modalTitle) modalTitle.textContent = '🧬 RNA Sequence Analyzer';
            if (modalSubtitle) modalSubtitle.textContent = 'Ribonucleic acid structure, stem-loop hairpins, & translation';
        } else if (tabName === 'protein') {
            if (modalTitle) modalTitle.textContent = '⚙️ Proteomics & PDB Analyzer';
            if (modalSubtitle) modalSubtitle.textContent = '3D structure details, phosphorylation prediction, & isoelectric point (pI)';
        }

        switchTab(tabName);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('visible');
        // Clear iframe to stop active Molstar rendering
        if (pdbIframe) pdbIframe.src = '';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close modal on escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('visible')) {
            closeModal();
        }
    });

    // Close on click outside content
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // 2. Node click integrations
    if (nodeDna) {
        nodeDna.addEventListener('click', () => openModal('dna'));
    }
    if (nodeRna) {
        nodeRna.addEventListener('click', () => openModal('rna'));
    }
    if (nodeProtein) {
        nodeProtein.addEventListener('click', () => openModal('protein'));
    }

    // 3. Tab switching
    function switchTab(tabName) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Clean iframe if switching away from protein PDB
        if (tabName !== 'protein' && pdbIframe) {
            pdbIframe.src = '';
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    // Preset buttons loading
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const seq = btn.getAttribute('data-seq');
            
            if (type === 'dna') {
                dnaInput.value = seq;
                runDnaAnalysis();
            } else if (type === 'rna') {
                rnaInput.value = seq;
                runRnaAnalysis();
            } else if (type === 'protein') {
                proteinInput.value = seq;
                runProteinAnalysis();
            } else if (type === 'pdb') {
                pdbInput.value = seq.toUpperCase();
                runPdbAnalysis();
            }
        });
    });

    // 4. DNA Analysis Logic
    function runDnaAnalysis() {
        const rawSeq = dnaInput.value.trim().toUpperCase().replace(/[^ATCG]/g, '');
        if (!rawSeq) return;

        // Sequence length
        const len = rawSeq.length;
        dnaLenVal.textContent = `${len} bp`;

        // GC Content
        const gcCount = (rawSeq.match(/[GC]/g) || []).length;
        const gcPct = len > 0 ? Math.round((gcCount / len) * 100) : 0;
        dnaGcVal.textContent = `${gcPct}%`;
        dnaGcBar.style.width = `${gcPct}%`;

        // Transcription (T -> U)
        const transcribed = rawSeq.replace(/T/g, 'U');
        dnaTranscribeDisplay.textContent = transcribed || "No sequence";

        // Translation
        let translated = '';
        for (let i = 0; i < transcribed.length - 2; i += 3) {
            const codon = transcribed.substring(i, i + 3);
            const aa = CODON_TABLE[codon] || '?';
            
            // Apply property-based color coding to translated amino acids
            let className = '';
            if ('AFGILMPVW'.includes(aa)) className = 'aa-hydrophobic';
            else if ('DE'.includes(aa)) className = 'aa-acidic';
            else if ('RKH'.includes(aa)) className = 'aa-basic';
            else if ('STYCNQ'.includes(aa)) className = 'aa-polar';
            else className = 'aa-special';

            translated += `<span class="${className}">${aa}</span>`;
        }
        dnaTranslateDisplay.innerHTML = translated || "Translation error";

        // Human Explanation
        let interpretation = `This DNA fragment contains <strong>${len} base pairs</strong>. `;
        if (gcPct > 55) {
            interpretation += `It is structurally <strong>GC-rich (${gcPct}%)</strong>, which indicates strong Watson-Crick base-pairing (3 hydrogen bonds per pair). GC-rich sequences exhibit higher thermal stability, requiring higher temperatures to denature, and are commonly found in regulatory promoter regions or coding sequences of organisms adapted to higher temperatures.`;
        } else if (gcPct < 45) {
            interpretation += `It is structurally <strong>AT-rich (${gcPct}% GC)</strong>. AT base pairs share only 2 hydrogen bonds, making them easier to split. AT-rich areas are typical of transcription initiation sites (like the TATA box in eukaryotes) and replication origins where the cell needs to unwind the double helix easily.`;
        } else {
            interpretation += `It has a balanced <strong>medium GC content (${gcPct}%)</strong>, typical of standard genomic coding regions.`;
        }

        if (rawSeq.startsWith('ATG')) {
            interpretation += `<br><br>⚡ <strong>Start Codon Detected!</strong> The sequence begins with the canonical initiation sequence (ATG). This indicates it represents a coding gene region ready for RNA Polymerase transcription and translation.`;
        }

        dnaExplanation.innerHTML = interpretation;
        resultsDna.classList.remove('hidden');
    }

    if (analyzeDnaBtn) analyzeDnaBtn.addEventListener('click', runDnaAnalysis);

    // 5. RNA Analysis Logic
    function runRnaAnalysis() {
        const rawSeq = rnaInput.value.trim().toUpperCase().replace(/[^AUCG]/g, '');
        if (!rawSeq) return;

        // Sequence length
        const len = rawSeq.length;
        rnaLenVal.textContent = `${len} nt`;

        // Molecular Weight estimation (approx 339.2 g/mol per nucleotide)
        const mw = len > 0 ? (len * 339.2 / 1000).toFixed(2) : '0';
        rnaMwVal.textContent = `${mw} kDa`;

        // Simple stem-loop secondary structure prediction
        // Scans for complementary sequences (A=U, G≡C) that fold back on themselves
        let bestStem = null;
        let bestLen = 0;
        
        // Scan for stem lengths from 4 to 8, loop lengths 3 to 10
        for (let stemLen = 4; stemLen <= 8; stemLen++) {
            for (let loopLen = 3; loopLen <= 10; loopLen++) {
                for (let i = 0; i < len - (2 * stemLen + loopLen); i++) {
                    const stem1 = rawSeq.substring(i, i + stemLen);
                    const stem2 = rawSeq.substring(i + stemLen + loopLen, i + 2 * stemLen + loopLen);
                    
                    // check if stem2 is reverse complementary to stem1
                    let isComplementary = true;
                    for (let k = 0; k < stemLen; k++) {
                        const b1 = stem1[k];
                        const b2 = stem2[stemLen - 1 - k];
                        if (!((b1==='A' && b2==='U') || (b1==='U' && b2==='A') || (b1==='G' && b2==='C') || (b1==='C' && b2==='G'))) {
                            isComplementary = false;
                            break;
                        }
                    }
                    
                    if (isComplementary && stemLen > bestLen) {
                        bestLen = stemLen;
                        bestStem = {
                            start: i,
                            stem1: stem1,
                            loop: rawSeq.substring(i + stemLen, i + stemLen + loopLen),
                            stem2: stem2
                        };
                    }
                }
            }
        }

        if (bestStem) {
            // Create a text-based ASCII structure diagram
            let visual = `   [Loop: ${bestStem.loop}]\n`;
            for (let k = 0; k < bestStem.stem1.length; k++) {
                const b1 = bestStem.stem1[k];
                const b2 = bestStem.stem2[bestStem.stem2.length - 1 - k];
                const bond = (b1 === 'G' || b1 === 'C') ? '≡' : '=';
                visual += `      ${b1} ${bond} ${b2}\n`;
            }
            visual += `  5'-${rawSeq.substring(0, bestStem.start)}...  ...${rawSeq.substring(bestStem.start + 2 * bestLen + bestStem.loop.length)}-3'`;
            rnaStructureDisplay.textContent = visual;
            
            rnaExplanation.innerHTML = `This RNA single strand folds dynamically. We detected a potential **stem-loop hairpin motif** with a stem of <strong>${bestLen} base pairs</strong> and a loop of <strong>${bestStem.loop.length} bases</strong>. These hairpins form molecular switches that regulate ribosomal translation, stabilize transcripts against exonucleases, or trigger transcription termination.`;
        } else {
            rnaStructureDisplay.textContent = "No stable stem-loop hairpins detected in this sequence.";
            rnaExplanation.innerHTML = `This RNA sequence (length: ${len} nt) does not form stable self-complementary loops based on primary Watson-Crick analysis. It likely exists in a highly unstructured or linear format, typical of rapid-translation mRNAs.`;
        }

        resultsRna.classList.remove('hidden');
    }

    if (analyzeRnaBtn) analyzeRnaBtn.addEventListener('click', runRnaAnalysis);

    // 6. Protein & PDB Tab Logic (Sequence vs PDB ID)
    if (typeBtnSeq) {
        typeBtnSeq.addEventListener('click', () => {
            typeBtnSeq.classList.add('active');
            typeBtnPdb.classList.remove('active');
            typeBtnUpload.classList.remove('active');
            modeProteinSeq.classList.remove('hidden');
            modeProteinPdb.classList.add('hidden');
            modeProteinUpload.classList.add('hidden');
            if (pdbIframe) pdbIframe.src = '';
        });
    }

    if (typeBtnPdb) {
        typeBtnPdb.addEventListener('click', () => {
            typeBtnPdb.classList.add('active');
            typeBtnSeq.classList.remove('active');
            typeBtnUpload.classList.remove('active');
            modeProteinPdb.classList.remove('hidden');
            modeProteinSeq.classList.add('hidden');
            modeProteinUpload.classList.add('hidden');
        });
    }

    if (typeBtnUpload) {
        typeBtnUpload.addEventListener('click', () => {
            typeBtnUpload.classList.add('active');
            typeBtnSeq.classList.remove('active');
            typeBtnPdb.classList.remove('active');
            modeProteinUpload.classList.remove('hidden');
            modeProteinSeq.classList.add('hidden');
            modeProteinPdb.classList.add('hidden');
            if (pdbIframe) pdbIframe.src = '';
        });
    }

    // Update PDB filename label
    if (pdbFileInput) {
        pdbFileInput.addEventListener('change', () => {
            if (pdbFileInput.files.length > 0) {
                pdbFileName.textContent = pdbFileInput.files[0].name;
            } else {
                pdbFileName.textContent = "No file chosen";
            }
        });
    }

    // Local PDB File parsing & analysis
    async function runLocalPdbAnalysis() {
        if (!pdbFileInput || pdbFileInput.files.length === 0) {
            alert("Please select a .pdb file to analyze.");
            return;
        }

        const file = pdbFileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');

            let title = '';
            let organism = '';
            let method = '';
            const chains = {};

            // Parse line by line
            for (let line of lines) {
                if (line.startsWith('TITLE')) {
                    title += line.substring(10, 80).trim() + ' ';
                } else if (line.startsWith('SOURCE') && line.includes('ORGANISM_SCIENTIFIC:')) {
                    const parts = line.split('ORGANISM_SCIENTIFIC:');
                    if (parts[1]) organism += parts[1].replace(/;/g, '').trim() + ' ';
                } else if (line.startsWith('EXPDTA')) {
                    method += line.substring(10, 80).trim() + ' ';
                } else if (line.startsWith('ATOM  ') || line.startsWith('HETATM')) {
                    const atomName = line.substring(12, 16).trim();
                    // We only parse Alpha Carbons (CA) to get the exact sequence residues
                    if (atomName === 'CA') {
                        const resName = line.substring(17, 20).trim();
                        const chainId = line.substring(21, 22).trim();
                        const resNum = parseInt(line.substring(22, 26).trim());

                        if (!chains[chainId]) chains[chainId] = [];
                        if (!chains[chainId].some(r => r.num === resNum)) {
                            chains[chainId].push({ num: resNum, name: resName });
                        }
                    }
                }
            }

            // Cleanup parsed strings
            title = title.trim() || "Local PDB Structure File";
            organism = organism.trim() || "Unknown Organism (not in header)";
            method = method.trim() || "Experimental structure (not specified)";

            // Reconstruct primary sequence from the first chain found
            const chainIds = Object.keys(chains);
            let reconstructedSeq = '';
            let chainInfo = '';

            if (chainIds.length > 0) {
                // We sort by residue number to reconstruct sequence in order
                const firstChain = chainIds[0];
                chains[firstChain].sort((a, b) => a.num - b.num);
                reconstructedSeq = chains[firstChain].map(r => AA_3TO1[r.name] || 'X').join('');
                chainInfo = `Chain ${firstChain} (out of chains: ${chainIds.join(', ')})`;
            }

            if (!reconstructedSeq) {
                alert("Could not extract amino acid sequence from PDB ATOM records. Make sure it is a valid PDB structure file.");
                return;
            }

            // Display Parsed Metadata
            pdbFileInfoTitle.textContent = title;
            pdbFileInfoOrganism.textContent = organism;
            pdbFileInfoMethod.textContent = method;
            pdbFileInfoLength.textContent = `${reconstructedSeq.length} amino acids (${chainInfo})`;

            // Display Reconstructed Sequence
            pdbFileSeqDisplay.textContent = reconstructedSeq;

            // Run properties predictions
            // 1. Isoelectric Point (pI)
            const pI = estimateIsoelectricPoint(reconstructedSeq);
            pdbFilePiVal.textContent = pI;

            // 2. GRAVY score
            let gravySum = 0;
            for (let aa of reconstructedSeq) {
                gravySum += HYDROPATHY_VALUES[aa] || 0;
            }
            const gravy = (gravySum / reconstructedSeq.length).toFixed(3);
            pdbFileGravyVal.textContent = gravy;

            // 3. Amino acid composition breakdown
            const len = reconstructedSeq.length;
            let acidic = 0; // D, E
            let basic = 0;  // R, K, H
            let polar = 0;  // S, T, Y, C, N, Q
            
            for (let aa of reconstructedSeq) {
                if ('DE'.includes(aa)) acidic++;
                else if ('RKH'.includes(aa)) basic++;
                else if ('STYCNQ'.includes(aa)) polar++;
            }

            const acidicPct = Math.round((acidic / len) * 100);
            const basicPct = Math.round((basic / len) * 100);
            const polarPct = Math.round((polar / len) * 100);
            const hydrophobicPct = 100 - (acidicPct + basicPct + polarPct);

            pdbFileCompAcidicBar.style.width = `${acidicPct}%`;
            pdbFileCompBasicBar.style.width = `${basicPct}%`;
            pdbFileCompPolarBar.style.width = `${polarPct}%`;
            pdbFileCompHydrophobicBar.style.width = `${hydrophobicPct}%`;

            pdbFileCompAcidicPct.textContent = `${acidicPct}%`;
            pdbFileCompBasicPct.textContent = `${basicPct}%`;
            pdbFileCompPolarPct.textContent = `${polarPct}%`;
            pdbFileCompHydrophobicPct.textContent = `${hydrophobicPct}%`;

            // 4. Phosphorylation sites prediction
            const phosphoSites = predictPhosphorylationSites(reconstructedSeq);
            if (phosphoSites.length > 0) {
                pdbFilePhosphoSummaryText.innerHTML = `Detected <strong>${phosphoSites.length}</strong> candidate phosphorylation residues (S/T/Y).`;
                pdbFilePhosphoTable.style.display = 'table';
                pdbFilePhosphoTableBody.innerHTML = phosphoSites.map(site => `
                    <tr>
                        <td>${site.residue}</td>
                        <td><strong>${site.position}</strong></td>
                        <td class="seq-display" style="padding:4px 8px; border:none;">${site.context}</td>
                        <td>${site.kinase}</td>
                        <td><code style="color:#06b6d4; font-size:10px;">${site.consensus}</code></td>
                    </tr>
                `).join('');
            } else {
                pdbFilePhosphoSummaryText.textContent = "No Serine, Threonine, or Tyrosine residues found. No phosphorylation sites predicted.";
                pdbFilePhosphoTable.style.display = 'none';
                pdbFilePhosphoTableBody.innerHTML = '';
            }

            // 5. Human Explanation Narrative
            let interpretation = `This locally uploaded protein model contains <strong>${len} amino acids</strong> in the analyzed chain. `;
            if (parseFloat(gravy) > 0) {
                interpretation += `The sequence exhibits a <strong>hydrophobic character (GRAVY: ${gravy})</strong>, suggesting it could represent a membrane-spanning domain or a protein operating in a lipid-rich environment. `;
            } else {
                interpretation += `The sequence is <strong>hydrophilic (GRAVY: ${gravy})</strong>, indicating it is likely a soluble cytoplasmic or extracellular domain. `;
            }

            interpretation += `At its estimated isoelectric point of <strong>pI ${pI}</strong>, the protein carries a net neutral charge. `;
            if (parseFloat(pI) < 6.0) {
                interpretation += `With its highly acidic pI, it remains negatively charged at standard physiological pH (~7.4).`;
            } else if (parseFloat(pI) > 8.0) {
                interpretation += `With its highly basic pI, it remains positively charged at physiological pH, characteristic of nucleic acid binding proteins.`;
            } else {
                interpretation += `It is biologically neutral, carrying minimal net charge under physiological conditions.`;
            }

            pdbFileExplanation.innerHTML = interpretation;
            resultsProteinUpload.classList.remove('hidden');
        };

        reader.readAsText(file);
    }

    if (analyzePdbFileBtn) analyzePdbFileBtn.addEventListener('click', runLocalPdbAnalysis);

    // Estimate Isoelectric Point (pI)
    function estimateIsoelectricPoint(seq) {
        const pK = {
            'D': 3.9, 'E': 4.1, 'C': 8.5, 'Y': 10.1, 'H': 6.5, 'K': 10.8, 'R': 12.5,
            'N_term': 8.6, 'C_term': 3.6
        };
        
        const counts = { 'D': 0, 'E': 0, 'C': 0, 'Y': 0, 'H': 0, 'K': 0, 'R': 0 };
        for (let char of seq) {
            if (char in counts) counts[char]++;
        }
        
        let minPh = 0.0;
        let maxPh = 14.0;
        let pH = 7.0;
        
        // Iterative bisection solver to find pH where net charge is 0
        for (let iter = 0; iter < 40; iter++) {
            pH = (minPh + maxPh) / 2;
            let charge = 0.0;
            
            charge += 1.0 / (1.0 + Math.pow(10, pH - pK.N_term));
            charge -= 1.0 / (1.0 + Math.pow(10, pK.C_term - pH));
            
            charge -= counts['D'] / (1.0 + Math.pow(10, pK.D - pH));
            charge -= counts['E'] / (1.0 + Math.pow(10, pK.E - pH));
            charge -= counts['C'] / (1.0 + Math.pow(10, pK.C - pH));
            charge -= counts['Y'] / (1.0 + Math.pow(10, pK.Y - pH));
            
            charge += counts['H'] / (1.0 + Math.pow(10, pH - pK.H));
            charge += counts['K'] / (1.0 + Math.pow(10, pH - pK.K));
            charge += counts['R'] / (1.0 + Math.pow(10, pH - pK.R));
            
            if (charge > 0) {
                minPh = pH;
            } else {
                maxPh = pH;
            }
        }
        return pH.toFixed(2);
    }

    // Predict Phosphorylation Sites
    function predictPhosphorylationSites(seq) {
        const sites = [];
        
        for (let i = 0; i < seq.length; i++) {
            const residue = seq[i];
            if (residue === 'S' || residue === 'T' || residue === 'Y') {
                // Get local context (+/- 4 amino acids)
                const start = Math.max(0, i - 4);
                const end = Math.min(seq.length - 1, i + 4);
                
                let context = '';
                // Pad left if near N-terminus
                if (i < 4) context += '-'.repeat(4 - i);
                context += seq.substring(start, end + 1);
                // Pad right if near C-terminus
                if (seq.length - 1 - i < 4) context += '-'.repeat(4 - (seq.length - 1 - i));
                
                // Formatted context with highlighted residue
                const highlightedContext = context.substring(0, 4) + `<span class="phospho-site-${residue.toLowerCase()}">${residue}</span>` + context.substring(5);
                
                // Kinase consensus motif checking
                let kinase = 'Basal Kinase';
                let consensus = 'S/T/Y standard residue';
                let confidence = 'Low';
                
                // PKA: [R/K][R/K] - X - [S/T]
                if (residue !== 'Y') {
                    const posMinus3 = context[1];
                    const posMinus2 = context[2];
                    if (['R','K'].includes(posMinus3) && ['R','K'].includes(posMinus2)) {
                        kinase = 'PKA (Protein Kinase A)';
                        consensus = '[R/K][R/K]-X-[S/T]';
                        confidence = 'High';
                    }
                    // PKC: [R/K] - X - [S/T] - X - [R/K] or [S/T] - X - [R/K]
                    else if (['R','K'].includes(context[2]) || ['R','K'].includes(context[5])) {
                        kinase = 'PKC (Protein Kinase C)';
                        consensus = '[R/K]-X-[S/T] or [S/T]-X-[R/K]';
                        confidence = 'Medium';
                    }
                    // CK2: [S/T] - X - X - [D/E]
                    else if (['D','E'].includes(context[7])) {
                        kinase = 'CK2 (Casein Kinase II)';
                        consensus = '[S/T]-X-X-[D/E]';
                        confidence = 'High';
                    }
                    // CDK: [S/T] - P (proline-directed)
                    else if (context[5] === 'P') {
                        kinase = 'CDK (Cyclin-Dep Kinase)';
                        consensus = '[S/T]-P';
                        confidence = 'High';
                    }
                } else {
                    // Tyrosine kinase motifs (Src family, etc.): [E/D]-X-X-Y or Y-X-X-[F/I/L/V]
                    if (['D','E'].includes(context[1])) {
                        kinase = 'Src Tyrosine Kinase';
                        consensus = '[D/E]-X-X-Y';
                        confidence = 'Medium';
                    } else if (['F','I','L','V'].includes(context[7])) {
                        kinase = 'RTK (Receptor Tyr Kinase)';
                        consensus = 'Y-X-X-[F/I/L/V]';
                        confidence = 'Medium';
                    }
                }
                
                sites.push({
                    residue: residue === 'S' ? 'Serine (S)' : residue === 'T' ? 'Threonine (T)' : 'Tyrosine (Y)',
                    position: i + 1,
                    context: highlightedContext,
                    kinase: kinase,
                    consensus: consensus,
                    confidence: confidence
                });
            }
        }
        
        return sites;
    }

    function runProteinAnalysis() {
        const rawSeq = proteinInput.value.trim().toUpperCase().replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, '');
        if (!rawSeq) return;

        // 1. Isoelectric Point
        const pI = estimateIsoelectricPoint(rawSeq);
        proteinPiVal.textContent = pI;

        // 2. GRAVY score
        let gravySum = 0;
        for (let aa of rawSeq) {
            gravySum += HYDROPATHY_VALUES[aa] || 0;
        }
        const gravy = rawSeq.length > 0 ? (gravySum / rawSeq.length).toFixed(3) : '0.00';
        proteinGravyVal.textContent = gravy;

        // 3. Amino acid composition breakdown
        const len = rawSeq.length;
        let acidic = 0; // D, E
        let basic = 0;  // R, K, H
        let polar = 0;  // S, T, Y, C, N, Q
        let hydrophobic = 0; // A, V, F, L, I, M, P, W, G (G is neutral but fits best here)
        
        for (let aa of rawSeq) {
            if ('DE'.includes(aa)) acidic++;
            else if ('RKH'.includes(aa)) basic++;
            else if ('STYCNQ'.includes(aa)) polar++;
            else hydrophobic++;
        }

        const acidicPct = len > 0 ? Math.round((acidic / len) * 100) : 0;
        const basicPct = len > 0 ? Math.round((basic / len) * 100) : 0;
        const polarPct = len > 0 ? Math.round((polar / len) * 100) : 0;
        const hydrophobicPct = len > 0 ? 100 - (acidicPct + basicPct + polarPct) : 0; // sum to 100

        compAcidicBar.style.width = `${acidicPct}%`;
        compBasicBar.style.width = `${basicPct}%`;
        compPolarBar.style.width = `${polarPct}%`;
        compHydrophobicBar.style.width = `${hydrophobicPct}%`;

        compAcidicPct.textContent = `${acidicPct}%`;
        compBasicPct.textContent = `${basicPct}%`;
        compPolarPct.textContent = `${polarPct}%`;
        compHydrophobicPct.textContent = `${hydrophobicPct}%`;

        // 4. Phosphorylation prediction
        const phosphoSites = predictPhosphorylationSites(rawSeq);
        if (phosphoSites.length > 0) {
            phosphoSummaryText.innerHTML = `Detected <strong>${phosphoSites.length}</strong> candidate phosphorylation residues (S/T/Y).`;
            phosphoTable.style.display = 'table';
            phosphoTableBody.innerHTML = phosphoSites.map(site => `
                <tr>
                    <td>${site.residue}</td>
                    <td><strong>${site.position}</strong></td>
                    <td class="seq-display" style="padding:4px 8px; border:none;">${site.context}</td>
                    <td>${site.kinase}</td>
                    <td><code style="color:#06b6d4; font-size:10px;">${site.consensus}</code></td>
                </tr>
            `).join('');
        } else {
            phosphoSummaryText.textContent = "No Serine, Threonine, or Tyrosine residues found. No phosphorylation sites predicted.";
            phosphoTable.style.display = 'none';
            phosphoTableBody.innerHTML = '';
        }

        // 5. Human Explanation
        let interpretation = `This protein contains <strong>${len} amino acids</strong>. `;
        if (parseFloat(gravy) > 0) {
            interpretation += `The protein is highly <strong>hydrophobic (GRAVY: ${gravy})</strong>, suggesting it is likely a trans-membrane protein or fits inside hydrophobic membrane lipid bilayers. `;
        } else {
            interpretation += `The protein is <strong>hydrophilic (GRAVY: ${gravy})</strong>, indicating it is likely a soluble protein operating in the cytoplasm, nucleus, or extracellular fluid. `;
        }

        interpretation += `At its estimated isoelectric point of <strong>pI ${pI}</strong>, the protein carries a net charge of zero. `;
        if (parseFloat(pI) < 6.0) {
            interpretation += `Because it is highly acidic (pI < 6), this protein will be negatively charged at standard physiological pH (~7.4), allowing it to interact with positively charged basic molecules.`;
        } else if (parseFloat(pI) > 8.0) {
            interpretation += `Being a basic protein (pI > 8), it remains positively charged at physiological pH, a classic feature of nucleic acid binding proteins (like Histones) which bind negative DNA backbones.`;
        } else {
            interpretation += `It is biologically neutral, carrying minimal net charge under physiological conditions.`;
        }

        proteinExplanation.innerHTML = interpretation;
        resultsProteinSeq.classList.remove('hidden');
    }

    if (analyzeProteinBtn) analyzeProteinBtn.addEventListener('click', runProteinAnalysis);

    // 7. PDB Structure analysis
    async function runPdbAnalysis() {
        const pdbId = pdbInput.value.trim().toUpperCase();
        if (pdbId.length !== 4) return;

        resultsProteinPdb.classList.remove('hidden');
        pdbTitleHeader.textContent = `PDB Entry Structure: ${pdbId}`;
        pdb3dLoader.classList.remove('hidden');
        
        // Load interactive NCBI iCn3D viewer in iframe (fully embeddable, avoids X-Frame connection refused errors)
        pdbIframe.src = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/full.html?pdbid=${pdbId}&showcommand=0&showmenu=0&showtitle=0`;
        pdbIframe.onload = () => {
            pdb3dLoader.classList.add('hidden');
        };

        // Fetch PDB metadata from RCSB API
        pdbInfoTitle.textContent = "Loading entry details...";
        pdbInfoOrganism.textContent = "-";
        pdbInfoMethod.textContent = "-";
        pdbInfoResolution.textContent = "-";
        pdbInfoDate.textContent = "-";
        pdbInfoCitation.textContent = "-";

        try {
            const response = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`);
            if (!response.ok) throw new Error("Entry not found");
            const data = await response.json();
            
            // Populate PDB Meta details
            if (data.struct && data.struct.title) {
                pdbInfoTitle.textContent = data.struct.title;
            } else {
                pdbInfoTitle.textContent = "Macromolecular Structure Model";
            }

            if (data.rcsb_entity_source_organism && data.rcsb_entity_source_organism.length > 0) {
                const organisms = data.rcsb_entity_source_organism.map(o => o.scientific_name).filter((v, i, a) => a.indexOf(v) === i);
                pdbInfoOrganism.textContent = organisms.join(', ');
            } else {
                pdbInfoOrganism.textContent = "Unknown Organism";
            }

            if (data.exptl && data.exptl.length > 0) {
                pdbInfoMethod.textContent = data.exptl.map(e => e.method).join(', ');
            } else {
                pdbInfoMethod.textContent = "X-ray Diffraction";
            }

            if (data.rcsb_entry_info && data.rcsb_entry_info.resolution_combined) {
                pdbInfoResolution.textContent = `${data.rcsb_entry_info.resolution_combined.join(' / ')} Å`;
            } else {
                pdbInfoResolution.textContent = "N/A";
            }

            if (data.rcsb_accession_info && data.rcsb_accession_info.deposit_date) {
                const date = new Date(data.rcsb_accession_info.deposit_date);
                pdbInfoDate.textContent = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            } else {
                pdbInfoDate.textContent = "N/A";
            }

            if (data.rcsb_primary_citation) {
                let citation = `"${data.rcsb_primary_citation.title || 'PDB Primary Citation'}"`;
                if (data.rcsb_primary_citation.journal) citation += ` - <em>${data.rcsb_primary_citation.journal}</em>`;
                if (data.rcsb_primary_citation.year) citation += `, ${data.rcsb_primary_citation.year}`;
                pdbInfoCitation.innerHTML = citation;
            } else {
                pdbInfoCitation.textContent = "No primary citation registered.";
            }

        } catch (e) {
            console.error("RCSB API metadata fetch failed:", e);
            pdbInfoTitle.textContent = "Entry structure loaded (Metadata unavailable)";
            pdbInfoOrganism.textContent = "Unknown";
            pdbInfoMethod.textContent = "Not specified";
            pdbInfoResolution.textContent = "Unknown";
            pdbInfoDate.textContent = "N/A";
            pdbInfoCitation.textContent = "Structure loaded successfully. Could not establish connection to the RCSB registry database.";
        }
    }

    if (analyzePdbBtn) analyzePdbBtn.addEventListener('click', runPdbAnalysis);
})();
