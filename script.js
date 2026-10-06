/* ==========================================================================
   A LOVE STORY — AANKHON SE BATANA
   Interactive GSAP Scrollytelling Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const container = document.getElementById('story-container');
  const scenes = document.querySelectorAll('.scene');
  const navDots = document.querySelectorAll('.nav-dot');
  const audioWidget = document.getElementById('audio-widget');
  const audioBtn = document.getElementById('audio-btn');
  const bgAudio = document.getElementById('bg-audio');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const musicPrompt = document.getElementById('music-prompt');
  const scrollHint = document.getElementById('scroll-hint');
  const replayBtn = document.getElementById('replay-btn');
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  let currentSceneIndex = 0;
  let isAudioPlaying = false;
  let audioUserUnlocked = false;

  // ==========================================================================
  // Audio Controller
  // ==========================================================================
  bgAudio.volume = 0.85;

  function playMusic() {
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      audioWidget.classList.add('playing');
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      if (musicPrompt) {
        musicPrompt.classList.add('fade-out');
        setTimeout(() => musicPrompt.remove(), 600);
      }
    }).catch(err => {
      console.log('Autoplay waiting for direct interaction:', err);
    });
  }

  function pauseMusic() {
    bgAudio.pause();
    isAudioPlaying = false;
    audioWidget.classList.remove('playing');
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }

  function toggleMusic(e) {
    if (e) e.stopPropagation();
    if (isAudioPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  audioWidget.addEventListener('click', toggleMusic);
  audioBtn.addEventListener('click', toggleMusic);

  // First interaction anywhere initiates audio
  function unlockAudioOnInteraction() {
    if (!audioUserUnlocked) {
      audioUserUnlocked = true;
      playMusic();
      window.removeEventListener('click', unlockAudioOnInteraction);
      window.removeEventListener('keydown', unlockAudioOnInteraction);
      window.removeEventListener('touchstart', unlockAudioOnInteraction);
    }
  }

  window.addEventListener('click', unlockAudioOnInteraction, { once: true });
  window.addEventListener('keydown', unlockAudioOnInteraction, { once: true });
  window.addEventListener('touchstart', unlockAudioOnInteraction, { once: true });

  // ==========================================================================
  // GSAP Scene Text Animations
  // ==========================================================================
  function animateSceneEnter(scene) {
    const tagline = scene.querySelector('.tagline');
    const title = scene.querySelector('.scene-title');
    const sub = scene.querySelector('.scene-sub');
    const replay = scene.querySelector('.replay-btn');
    const bg = scene.querySelector('.scene-bg');

    // Kill any existing animations on these elements
    gsap.killTweensOf([tagline, title, sub, replay, bg]);

    // Animate text reveal with elegant stagger
    const tl = gsap.timeline();

    tl.to(tagline, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.2
    })
    .to(title, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out'
    }, '-=0.65')
    .to(sub, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.75');

    if (replay) {
      tl.to(replay, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5');
    }

    // Subtle Ken Burns zoom
    gsap.to(bg, {
      scale: 1.06,
      duration: 8,
      ease: 'sine.out'
    });
  }

  function animateSceneLeave(scene) {
    const tagline = scene.querySelector('.tagline');
    const title = scene.querySelector('.scene-title');
    const sub = scene.querySelector('.scene-sub');
    const replay = scene.querySelector('.replay-btn');
    const bg = scene.querySelector('.scene-bg');

    gsap.to([tagline, title, sub, replay], {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.in'
    });

    gsap.to(bg, {
      scale: 1.02,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  // ==========================================================================
  // Intersection Observer for Active Scene Tracking
  // ==========================================================================
  const observerOptions = {
    root: container,
    threshold: 0.55
  };

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.getAttribute('data-scene'), 10);

      if (entry.isIntersecting) {
        currentSceneIndex = index;
        entry.target.classList.add('active');

        // Update nav dots
        navDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });

        // Trigger entrance
        animateSceneEnter(entry.target);

        // Shooting star on night scenes
        if ([2, 5, 7].includes(index)) {
          triggerShootingStar(entry.target);
        }
      } else {
        entry.target.classList.remove('active');
        animateSceneLeave(entry.target);
      }
    });
  }, observerOptions);

  scenes.forEach(scene => sceneObserver.observe(scene));

  // ==========================================================================
  // Navigation: Dot Clicks & Buttons
  // ==========================================================================
  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
      scenes[targetIdx].scrollIntoView({ behavior: 'smooth' });
    });
  });

  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      scenes[1].scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      scenes[0].scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentSceneIndex < scenes.length - 1) {
        scenes[currentSceneIndex + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSceneIndex > 0) {
        scenes[currentSceneIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Desktop Mouse Parallax
  window.addEventListener('mousemove', (e) => {
    const activeScene = scenes[currentSceneIndex];
    if (!activeScene) return;
    const bg = activeScene.querySelector('.scene-bg');
    if (!bg) return;

    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

    gsap.to(bg, {
      x: xPos,
      y: yPos,
      duration: 1.2,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  });

  // ==========================================================================
  // Shooting Star Spawner (Scenes 3, 6, 8)
  // ==========================================================================
  function triggerShootingStar(sceneEl) {
    const container = sceneEl.querySelector('.shooting-star-container');
    if (!container) return;

    // Create shooting star element
    const star = document.createElement('div');
    star.className = 'shooting-star';

    const startX = Math.random() * (window.innerWidth * 0.6) + window.innerWidth * 0.2;
    const startY = Math.random() * (window.innerHeight * 0.3) + 20;

    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    container.appendChild(star);

    gsap.fromTo(star, {
      opacity: 0,
      scaleX: 0,
      x: 0,
      y: 0
    }, {
      opacity: 1,
      scaleX: 1.5,
      x: 280,
      y: 200,
      duration: 1.1,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(star, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => star.remove()
        });
      }
    });
  }

  // Periodic shooting stars when in night scene
  setInterval(() => {
    if ([2, 5, 7].includes(currentSceneIndex)) {
      triggerShootingStar(scenes[currentSceneIndex]);
    }
  }, 5500);

  // ==========================================================================
  // Ambient Canvas: Drifting Flower Petals & Fireflies
  // ==========================================================================
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 9 + 7;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 + 0.3;
      this.rotX = Math.random() * Math.PI;
      this.rotY = Math.random() * Math.PI;
      this.rotZ = Math.random() * Math.PI;
      this.rotSpeedX = Math.random() * 0.03 + 0.01;
      this.rotSpeedY = Math.random() * 0.03 + 0.01;
      this.rotSpeedZ = Math.random() * 0.02 + 0.005;
      this.opacity = Math.random() * 0.45 + 0.45;
      this.pinkTone = Math.random() > 0.4; // Mix of cherry blossom pink & warm white petals
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.rotZ) * this.speedX + 0.4;
      this.rotX += this.rotSpeedX;
      this.rotY += this.rotSpeedY;
      this.rotZ += this.rotSpeedZ;

      if (this.y > height + 30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotZ);
      ctx.scale(Math.cos(this.rotX), Math.sin(this.rotY));

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, this.size / 2, this.size);
      ctx.bezierCurveTo(0, this.size * 1.3, -this.size / 2, this.size, -this.size / 2, 0);
      ctx.closePath();

      if (this.pinkTone) {
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
        grad.addColorStop(0, `rgba(255, 240, 245, ${this.opacity})`);
        grad.addColorStop(0.7, `rgba(255, 182, 193, ${this.opacity * 0.85})`);
        grad.addColorStop(1, `rgba(255, 140, 160, ${this.opacity * 0.5})`);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.85})`;
      }

      ctx.shadowColor = 'rgba(255, 200, 210, 0.4)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  class Firefly {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.5 + 1.2;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.6 + 0.3;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.phase += 0.035;
      this.alpha = Math.max(0, Math.sin(this.phase)) * this.maxAlpha;

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      if (this.alpha <= 0.02) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 225, 140, ${this.alpha})`;
      ctx.shadowColor = 'rgba(255, 210, 80, 0.8)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particle pools
  const petals = Array.from({ length: 32 }, () => new Petal());
  const fireflies = Array.from({ length: 24 }, () => new Firefly());

  // Render loop
  function renderAmbient() {
    ctx.clearRect(0, 0, width, height);

    // Always draw flower petals
    for (let p of petals) {
      p.update();
      p.draw();
    }

    // Draw fireflies heavily on night scenes (2: The Wait, 5: As One, 7: Silence)
    if ([2, 5, 7].includes(currentSceneIndex)) {
      for (let f of fireflies) {
        f.update();
        f.draw();
      }
    }

    requestAnimationFrame(renderAmbient);
  }

  renderAmbient();
});
