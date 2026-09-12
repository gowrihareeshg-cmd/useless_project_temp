/**
 * BISCUIT PROTECTOR 2.0 - Ultimate Dipping Simulator
 * Web Audio Engine, HTML5 Canvas Renderer & Gamification Engine
 */

// ==========================================
// 1. SOUND SYNTHESIZER ENGINE (Web Audio API)
// ==========================================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.loadSettings();
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('biscuit_sound_muted');
        this.muted = saved === 'true';
        this.updateUI();
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('biscuit_sound_muted', this.muted);
        this.updateUI();
        if (!this.muted) this.playTick(440);
    }

    updateUI() {
        const btn = document.getElementById('soundToggleBtn');
        const icon = document.getElementById('soundIcon');
        if (btn && icon) {
            if (this.muted) {
                icon.innerText = '🔇';
                btn.classList.add('muted');
                btn.childNodes[2].nodeValue = ' Audio OFF';
            } else {
                icon.innerText = '🔊';
                btn.classList.remove('muted');
                btn.childNodes[2].nodeValue = ' Audio ON';
            }
        }
    }

    playTick(freq = 400) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {}
    }

    playDunk() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }

    playSuccess(score) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = score >= 90 ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37, 659.25];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(this.ctx.currentTime + idx * 0.08);
                osc.stop(this.ctx.currentTime + idx * 0.08 + 0.3);
            });
        } catch (e) {}
    }

    playPlop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            // Low plop drop
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(250, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.35);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.35);
        } catch (e) {}
    }
}

const audio = new SoundEngine();

// ==========================================
// 2. CANVAS VISUAL RENDERER (Cup & Dipping Physics)
// ==========================================
class CupCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.wavePhase = 0;
        this.steamParticles = [];
        this.crumbs = [];
        this.isDipping = false;
        this.dipProgress = 0; // 0 (up) to 1 (dipped)
        this.soggyRatio = 0; // 0 to 1
        this.isBroken = false;
        this.beverageColor = '#c16a3a';
        this.initSteam();
        this.animate();
    }

    setBeverageColor(colorHex) {
        this.beverageColor = colorHex || '#c16a3a';
    }

    initSteam() {
        this.steamParticles = [];
        for (let i = 0; i < 8; i++) {
            this.steamParticles.push({
                x: 220 + (Math.random() - 0.5) * 60,
                y: 110 + Math.random() * 40,
                radius: 6 + Math.random() * 8,
                alpha: 0.1 + Math.random() * 0.3,
                speedY: 0.4 + Math.random() * 0.4,
                drift: (Math.random() - 0.5) * 0.3
            });
        }
    }

    breakBiscuit() {
        if (this.isBroken) return;
        this.isBroken = true;
        this.crumbs = [];
        // Spawn sinking crumbs inside liquid
        for (let i = 0; i < 15; i++) {
            this.crumbs.push({
                x: 220 + (Math.random() - 0.5) * 40,
                y: 145 + Math.random() * 10,
                vy: 1 + Math.random() * 2,
                vx: (Math.random() - 0.5) * 1.5,
                size: 3 + Math.random() * 5,
                color: Math.random() > 0.4 ? '#b58043' : '#7c4c23'
            });
        }
    }

    reset() {
        this.isDipping = false;
        this.dipProgress = 0;
        this.soggyRatio = 0;
        this.isBroken = false;
        this.crumbs = [];
    }

    update() {
        this.wavePhase += 0.05;

        // Steam physics
        this.steamParticles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.drift;
            p.alpha -= 0.003;
            if (p.y < 40 || p.alpha <= 0) {
                p.y = 120;
                p.x = 220 + (Math.random() - 0.5) * 60;
                p.alpha = 0.1 + Math.random() * 0.3;
            }
        });

        // Dipping motion smooth interpolation
        if (this.isDipping && this.dipProgress < 1) {
            this.dipProgress = Math.min(1, this.dipProgress + 0.1);
        } else if (!this.isDipping && this.dipProgress > 0) {
            this.dipProgress = Math.max(0, this.dipProgress - 0.1);
        }

        // Crumb physics
        this.crumbs.forEach(c => {
            if (c.y < 210) {
                c.y += c.vy;
                c.x += c.vx;
            }
        });
    }

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 1. Draw Saucer & Table Line
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(220, 225, 110, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#dfcfbe';
        ctx.beginPath();
        ctx.ellipse(220, 220, 100, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#bfa58a';
        ctx.stroke();

        // 2. Draw Cup Body
        const cupX = 155;
        const cupY = 110;
        const cupW = 130;
        const cupH = 100;

        // Cup Handle
        ctx.strokeStyle = '#e8d8c8';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(cupX + cupW + 8, cupY + 45, 24, -Math.PI * 0.4, Math.PI * 0.6);
        ctx.stroke();

        ctx.strokeStyle = '#c8b4a0';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Cup Outer Wall
        ctx.fillStyle = '#f8f1e7';
        ctx.beginPath();
        ctx.moveTo(cupX, cupY);
        ctx.bezierCurveTo(cupX, cupY + cupH + 10, cupX + cupW, cupY + cupH + 10, cupX + cupW, cupY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#d4c0ab';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Cup Inner Rim Shadow
        ctx.fillStyle = '#d6c4b2';
        ctx.beginPath();
        ctx.ellipse(cupX + cupW / 2, cupY, cupW / 2, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. Draw Beverage Liquid
        const liquidY = cupY + 12;
        ctx.fillStyle = this.beverageColor;
        ctx.beginPath();
        ctx.ellipse(cupX + cupW / 2, liquidY, cupW / 2 - 4, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Animated Liquid Waves
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        for (let x = cupX + 8; x <= cupX + cupW - 8; x += 5) {
            const waveY = liquidY + Math.sin((x + this.wavePhase * 20) * 0.05) * 2;
            if (x === cupX + 8) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
        }
        ctx.ellipse(cupX + cupW / 2, liquidY + 4, cupW / 2 - 12, 8, 0, 0, Math.PI);
        ctx.fill();

        // 4. Draw Rising Steam
        this.steamParticles.forEach(p => {
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // 5. Draw Submerged Crumbs
        this.crumbs.forEach(c => {
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 6. Draw Dipping Hand & Biscuit
        this.drawBiscuit(ctx, cupX + cupW / 2, liquidY);
    }

    drawBiscuit(ctx, centerX, liquidY) {
        const biscuitW = 48;
        const biscuitH = 80;

        // Base Y animation (rest at Y=40, dipped at Y=105)
        const biscuitY = 35 + this.dipProgress * 70;

        ctx.save();

        if (this.isBroken) {
            // Draw Upper Saved Half of Broken Biscuit
            ctx.fillStyle = '#d2a061';
            ctx.strokeStyle = '#8c5923';
            ctx.lineWidth = 2;

            const breakY = liquidY - 5;
            ctx.beginPath();
            ctx.roundRect(centerX - biscuitW / 2, biscuitY, biscuitW, breakY - biscuitY, 6);
            ctx.fill();
            ctx.stroke();

            // Jagged Break Edge
            ctx.fillStyle = '#8c5923';
            ctx.beginPath();
            ctx.moveTo(centerX - biscuitW / 2, breakY);
            ctx.lineTo(centerX - biscuitW / 4, breakY + 6);
            ctx.lineTo(centerX, breakY);
            ctx.lineTo(centerX + biscuitW / 4, breakY + 8);
            ctx.lineTo(centerX + biscuitW / 2, breakY);
            ctx.stroke();
        } else {
            // Draw Intact Biscuit
            const rectX = centerX - biscuitW / 2;
            const rectY = biscuitY;

            // Base Biscuit Fill
            ctx.fillStyle = '#d99f57';
            ctx.beginPath();
            ctx.roundRect(rectX, rectY, biscuitW, biscuitH, 8);
            ctx.fill();

            // Biscuit Border & Pattern Dots
            ctx.strokeStyle = '#a46824';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Pattern Dots
            ctx.fillStyle = '#945b1e';
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 2; col++) {
                    ctx.beginPath();
                    ctx.arc(rectX + 14 + col * 20, rectY + 18 + row * 22, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Soggy Wet Absorption Overlay
            if (this.soggyRatio > 0) {
                const soggyHeight = biscuitH * Math.min(1, this.soggyRatio * 1.1);
                const soggyY = rectY + biscuitH - soggyHeight;

                ctx.save();
                ctx.beginPath();
                ctx.roundRect(rectX, rectY, biscuitW, biscuitH, 8);
                ctx.clip();

                const grad = ctx.createLinearGradient(0, soggyY, 0, rectY + biscuitH);
                grad.addColorStop(0, 'rgba(115, 62, 23, 0.4)');
                grad.addColorStop(0.5, 'rgba(80, 40, 10, 0.85)');
                grad.addColorStop(1, 'rgba(50, 25, 5, 0.95)');

                ctx.fillStyle = grad;
                ctx.fillRect(rectX, soggyY, biscuitW, soggyHeight);
                ctx.restore();
            }
        }

        // Draw Dipping Fingers Holding Biscuit
        ctx.fillStyle = '#f5cba7';
        ctx.strokeStyle = '#d5a680';
        ctx.lineWidth = 1.5;

        // Left Finger
        ctx.beginPath();
        ctx.roundRect(centerX - biscuitW / 2 - 8, biscuitY - 12, 16, 26, 8);
        ctx.fill();
        ctx.stroke();

        // Right Thumb
        ctx.beginPath();
        ctx.roundRect(centerX + biscuitW / 2 - 8, biscuitY - 14, 18, 28, 9);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// 3. STATS & ACHIEVEMENTS MANAGER
// ==========================================
const ACHIEVEMENTS_DEF = [
    { id: 'first_dip', title: '☕ First Dunk', desc: 'Complete your very first biscuit dip.', icon: '🏆' },
    { id: 'bullseye', title: '🎯 Master Dipper', desc: 'Achieve a perfect 100/100 dip score.', icon: '⭐' },
    { id: 'close_call', title: '🛟 Close Call', desc: 'Save a biscuit with less than 0.15s remaining.', icon: '⚡' },
    { id: 'bottom_feeder', title: '⚓ Submarine', desc: 'Lose 3 biscuits to the cup bottom.', icon: '💀' },
    { id: 'streak_5', title: '🔥 Dip Legend', desc: 'Reach a streak of 5 in Endurance Mode.', icon: '👑' },
    { id: 'connoisseur', title: '🍪 Connoisseur', desc: 'Try 5 different biscuit varieties.', icon: '🎨' },
    { id: 'rusk_hero', title: '🥖 Rusk Master', desc: 'Successfully save a Rusk biscuit.', icon: '🛡️' }
];

class StatsManager {
    constructor() {
        this.stats = {
            totalDips: 0,
            savedDips: 0,
            lostBiscuits: 0,
            bestStreak: 0,
            totalError: 0,
            perfectDips: 0,
            usedBiscuits: [],
            unlockedAchievements: []
        };
        this.load();
    }

    load() {
        const data = localStorage.getItem('biscuit_stats_v2');
        if (data) {
            try {
                this.stats = { ...this.stats, ...JSON.parse(data) };
            } catch (e) {}
        }
        this.render();
    }

    save() {
        localStorage.setItem('biscuit_stats_v2', JSON.stringify(this.stats));
        this.render();
    }

    recordDip(isSuccess, errorMargin, score, biscuitType, currentStreak) {
        this.stats.totalDips++;
        if (isSuccess) {
            this.stats.savedDips++;
            this.stats.totalError += errorMargin;
            if (score >= 98) this.stats.perfectDips++;
            if (currentStreak > this.stats.bestStreak) this.stats.bestStreak = currentStreak;
        } else {
            this.stats.lostBiscuits++;
        }

        if (!this.stats.usedBiscuits.includes(biscuitType)) {
            this.stats.usedBiscuits.push(biscuitType);
        }

        // Check Achievements
        this.checkAchievements(isSuccess, errorMargin, score, biscuitType, currentStreak);
        this.save();
    }

    checkAchievements(isSuccess, errorMargin, score, biscuitType, currentStreak) {
        const unlock = (id) => {
            if (!this.stats.unlockedAchievements.includes(id)) {
                this.stats.unlockedAchievements.push(id);
            }
        };

        if (this.stats.totalDips >= 1) unlock('first_dip');
        if (isSuccess && score >= 99) unlock('bullseye');
        if (isSuccess && errorMargin <= 0.15) unlock('close_call');
        if (this.stats.lostBiscuits >= 3) unlock('bottom_feeder');
        if (currentStreak >= 5) unlock('streak_5');
        if (this.stats.usedBiscuits.length >= 5) unlock('connoisseur');
        if (isSuccess && biscuitType === 'rusk') unlock('rusk_hero');
    }

    reset() {
        if (confirm('Reset all career statistics and achievements?')) {
            this.stats = {
                totalDips: 0,
                savedDips: 0,
                lostBiscuits: 0,
                bestStreak: 0,
                totalError: 0,
                perfectDips: 0,
                usedBiscuits: [],
                unlockedAchievements: []
            };
            this.save();
        }
    }

    render() {
        document.getElementById('statTotalDips').innerText = this.stats.totalDips;
        document.getElementById('statSavedDips').innerText = this.stats.savedDips;
        document.getElementById('statLostBiscuits').innerText = this.stats.lostBiscuits;
        document.getElementById('statBestStreak').innerText = this.stats.bestStreak;

        const avgErr = this.stats.savedDips > 0 ? (this.stats.totalError / this.stats.savedDips).toFixed(2) : '0.00';
        document.getElementById('statAvgAccuracy').innerText = `${avgErr}s`;

        // Render Achievements Grid
        const grid = document.getElementById('achievementsGrid');
        if (grid) {
            grid.innerHTML = ACHIEVEMENTS_DEF.map(ach => {
                const unlocked = this.stats.unlockedAchievements.includes(ach.id);
                return `
                    <div class="achievement-card ${unlocked ? 'unlocked' : ''}">
                        <div class="achievement-icon">${ach.icon}</div>
                        <div class="achievement-info">
                            <h4>${ach.title} ${unlocked ? '✅' : '🔒'}</h4>
                            <p>${ach.desc}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

const statsMgr = new StatsManager();

// ==========================================
// 4. MAIN GAME CONTROLLER & LOGIC
// ==========================================
let startTime = 0;
let timerInterval = null;
let currentStreak = 0;
let cupRenderer = null;
let gameState = 'READY'; // READY, DIPPING, FINISHED

function initGame() {
    cupRenderer = new CupCanvas('dipCanvas');

    // Attach Event Listeners
    document.getElementById('soundToggleBtn').addEventListener('click', () => audio.toggleMute());
    document.getElementById('biscuit').addEventListener('change', onBiscuitChange);
    document.getElementById('beverage').addEventListener('change', onBeverageChange);
    document.getElementById('gameMode').addEventListener('change', onModeChange);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState === 'READY') startDip();
            else if (gameState === 'DIPPING') stopDip();
        } else if (e.code === 'KeyR') {
            resetDip();
        } else if (e.code === 'KeyM') {
            audio.toggleMute();
        } else if (['Digit1', 'Digit2', 'Digit3'].includes(e.code)) {
            const idx = Number(e.code.replace('Digit', '')) - 1;
            const tabs = document.querySelectorAll('.tab-btn');
            if (tabs[idx]) tabs[idx].click();
        }
    });

    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    onBeverageChange();
    updateTargetLabel();
}

function getTargetTime() {
    const biscuitSelect = document.getElementById('biscuit');
    const selectedOpt = biscuitSelect.options[biscuitSelect.selectedIndex];

    let baseTarget = 3.0;
    if (selectedOpt.value === 'custom') {
        baseTarget = parseFloat(document.getElementById('customTime').value) || 3.0;
    } else {
        baseTarget = parseFloat(selectedOpt.getAttribute('data-time')) || 3.0;
    }

    const bevSelect = document.getElementById('beverage');
    const bevOpt = bevSelect.options[bevSelect.selectedIndex];
    const bevMult = parseFloat(bevOpt.getAttribute('data-mult')) || 1.0;

    // Effective Target Time adjusted by beverage hot soak multiplier
    return Number((baseTarget / bevMult).toFixed(2));
}

function updateTargetLabel() {
    const target = getTargetTime();
    document.getElementById('targetTimeLabel').innerText = target.toFixed(2);
}

function onBiscuitChange() {
    const biscuitSelect = document.getElementById('biscuit');
    const customGroup = document.getElementById('customTimeGroup');
    if (biscuitSelect.value === 'custom') {
        customGroup.classList.remove('hidden');
    } else {
        customGroup.classList.add('hidden');
    }
    updateTargetLabel();
}

function onBeverageChange() {
    const bevSelect = document.getElementById('beverage');
    const selectedOpt = bevSelect.options[bevSelect.selectedIndex];
    const color = selectedOpt.getAttribute('data-color');
    if (cupRenderer) cupRenderer.setBeverageColor(color);
    updateTargetLabel();
}

function onModeChange() {
    const mode = document.getElementById('gameMode').value;
    const streakBadge = document.getElementById('streakBadge');
    if (mode === 'endurance') {
        streakBadge.classList.remove('hidden');
        streakBadge.innerText = `🔥 Streak: ${currentStreak}`;
    } else {
        streakBadge.classList.add('hidden');
    }
    resetDip();
}

function startDip() {
    if (gameState === 'DIPPING') return;

    audio.init();
    audio.playDunk();

    gameState = 'DIPPING';
    startTime = Date.now();
    const target = getTargetTime();

    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('resultCard').classList.add('hidden');

    cupRenderer.reset();
    cupRenderer.isDipping = true;

    let lastTickTime = 0;

    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const percentage = Math.min((elapsed / target) * 100, 100);

        document.getElementById('timer').innerText = elapsed.toFixed(2);
        document.getElementById('percentage').innerText = Math.round(percentage) + '%';
        document.getElementById('progressFill').style.width = percentage + '%';

        cupRenderer.soggyRatio = elapsed / target;

        // Audio tension tick (faster as percentage increases)
        const tickIntervalMs = Math.max(80, 400 - (percentage * 3.2));
        if (Date.now() - lastTickTime > tickIntervalMs) {
            audio.playTick(300 + (percentage * 5));
            lastTickTime = Date.now();
        }

        // Status badge state transitions
        const statusEl = document.getElementById('status');
        if (percentage < 50) {
            statusEl.innerText = '🟢 STILL SAFE...';
            statusEl.className = 'status-badge status-safe';
        } else if (percentage < 80) {
            statusEl.innerText = '🟡 GETTING CLOSE...';
            statusEl.className = 'status-badge status-close';
        } else if (percentage < 100) {
            statusEl.innerText = '🟠 REMOVE SOON!';
            statusEl.className = 'status-badge status-warn';
        } else {
            // Overdipped! Biscuit Collapse Failure!
            triggerCollapseFailure();
        }
    }, 40);
}

function triggerCollapseFailure() {
    clearInterval(timerInterval);
    gameState = 'FINISHED';

    audio.playPlop();
    cupRenderer.breakBiscuit();

    const target = getTargetTime();
    const biscuitVal = document.getElementById('biscuit').value;

    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = true;

    const statusEl = document.getElementById('status');
    statusEl.innerText = '🔴 BISCUIT COLLAPSED!';
    statusEl.className = 'status-badge status-collapsed';

    const mode = document.getElementById('gameMode').value;
    if (mode === 'endurance') currentStreak = 0;
    document.getElementById('streakBadge').innerText = `🔥 Streak: ${currentStreak}`;

    // Record Failure Stat
    statsMgr.recordDip(false, 0, 0, biscuitVal, currentStreak);

    // Show Result
    const resCard = document.getElementById('resultCard');
    document.getElementById('resultTitle').innerText = '🚨 SOGGY DISASTER!';
    document.getElementById('resultTitle').style.color = '#e65252';
    document.getElementById('resultScore').innerText = 'DIP SCORE™: 0/100';
    document.getElementById('resultDetails').innerText = `Your biscuit soaked past ${target.toFixed(2)}s and crumbled to the bottom of the cup!`;
    resCard.classList.remove('hidden');
}

function stopDip() {
    if (gameState !== 'DIPPING') return;

    clearInterval(timerInterval);
    gameState = 'FINISHED';

    const elapsed = (Date.now() - startTime) / 1000;
    const target = getTargetTime();
    const difference = Math.abs(elapsed - target);

    cupRenderer.isDipping = false;

    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = true;

    // Score calculation
    let score = Math.max(0, Math.round(100 - difference * 40));

    audio.playSuccess(score);

    const mode = document.getElementById('gameMode').value;
    if (mode === 'endurance') {
        currentStreak++;
        document.getElementById('streakBadge').innerText = `🔥 Streak: ${currentStreak}`;
    }

    const biscuitVal = document.getElementById('biscuit').value;
    statsMgr.recordDip(true, difference, score, biscuitVal, currentStreak);

    // Render Result
    const statusEl = document.getElementById('status');
    const resCard = document.getElementById('resultCard');

    let titleText = '';
    let titleColor = '';

    if (score >= 90) {
        statusEl.innerText = '🏆 PERFECT DIP!';
        statusEl.className = 'status-badge status-ready';
        titleText = '🌟 MASTER DIPPER!';
        titleColor = '#4eb868';
    } else if (score >= 70) {
        statusEl.innerText = '😎 GOOD DIP!';
        statusEl.className = 'status-badge status-safe';
        titleText = '☕ SAFE & TASTY!';
        titleColor = '#e09b35';
    } else {
        statusEl.innerText = '⚠️ TOO DRY / TOO CLOSE!';
        statusEl.className = 'status-badge status-close';
        titleText = '🍪 ROOM FOR IMPROVEMENT';
        titleColor = '#f1b738';
    }

    document.getElementById('resultTitle').innerText = titleText;
    document.getElementById('resultTitle').style.color = titleColor;
    document.getElementById('resultScore').innerText = `DIP SCORE™: ${score}/100`;
    document.getElementById('resultDetails').innerText = `Target: ${target.toFixed(2)}s | Stopped at: ${elapsed.toFixed(2)}s (Delta: ${(elapsed - target > 0 ? '+' : '')}${(elapsed - target).toFixed(2)}s)`;
    resCard.classList.remove('hidden');
}

function resetDip() {
    clearInterval(timerInterval);
    gameState = 'READY';

    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    document.getElementById('timer').innerText = '0.00';
    document.getElementById('percentage').innerText = '0%';
    document.getElementById('progressFill').style.width = '0%';

    const statusEl = document.getElementById('status');
    statusEl.innerText = '🟢 READY FOR DIP';
    statusEl.className = 'status-badge status-ready';

    document.getElementById('resultCard').classList.add('hidden');

    if (cupRenderer) cupRenderer.reset();

    // Auto randomize biscuit in Endurance mode
    const mode = document.getElementById('gameMode').value;
    if (mode === 'endurance') {
        const biscuitSelect = document.getElementById('biscuit');
        const opts = biscuitSelect.options;
        const randIdx = Math.floor(Math.random() * (opts.length - 1)); // exclude custom
        biscuitSelect.selectedIndex = randIdx;
        onBiscuitChange();
    }
}

function resetCareerStats() {
    statsMgr.reset();
}

// Initialize application on DOM content loaded
window.addEventListener('DOMContentLoaded', initGame);
