// 1. Lenis Smooth Scroll (Locomotive alternative, widely used by award-winning agencies)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Snappy center dot
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1
    });
});

// Smooth follower using GSAP ticker
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(follower, { x: followerX, y: followerY });
});

// Expand cursor on interactive elements
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        follower.classList.add('hovering');
    });
    target.addEventListener('mouseleave', () => {
        follower.classList.remove('hovering');
    });
});

// 3. GSAP Entrance Animations (The "Living" feel)
gsap.registerPlugin(ScrollTrigger);

// Hero Text Reveal
const heroLines = document.querySelectorAll('.hero-title .line');
gsap.from(heroLines, {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out",
    delay: 0.5
});

gsap.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    delay: 1
});

// 4. Scroll Trigger Animations for Services
const cards = document.querySelectorAll('.card');
cards.forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%", // Trigger when top of card hits 85% of viewport
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: i * 0.1 // Stagger effect based on index
    });
});

// Subtle Parallax on the Background Grid
gsap.to('.bg-grid-container', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
    },
    y: 200,
    ease: "none"
});

// --- Inner Page Animations ---

// Page Title Reveal (for Services, Pricing, Contact pages)
const pageLines = document.querySelectorAll('.page-title .line');
if (pageLines.length > 0) {
    gsap.from(pageLines, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
    });
}

// Generic Scroll Reveal for inner page elements (.scroll-anim)
const scrollElements = document.querySelectorAll('.scroll-anim');
scrollElements.forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%", 
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: i * 0.1 // Stagger effect
    });
});


// --- Mobile Menu Logic ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const mobileContact = document.querySelector('.mobile-contact');

let isMenuOpen = false;

if(hamburger) {
    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        // Toggle the "X" animation on the hamburger icon
        hamburger.classList.toggle('active');

        if (isMenuOpen) {
            // Stop background scrolling
            lenis.stop();

            // Bring the menu overlay down
            gsap.to(mobileMenu, {
                y: "0%",
                opacity: 1,
                duration: 0.8,
                ease: "power4.inOut"
            });

            // Stagger the links animating up
            gsap.to(mobileLinks, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.4 // Wait for background to slide down slightly
            });

            // Fade in contact info
            gsap.to(mobileContact, {
                opacity: 1,
                duration: 0.6,
                delay: 0.8
            });

        } else {
            // Re-enable background scrolling
            lenis.start();

            // Fade links out quickly
            gsap.to([mobileLinks, mobileContact], {
                y: 50,
                opacity: 0,
                duration: 0.3,
                ease: "power3.in"
            });

            // Slide menu back up
            gsap.to(mobileMenu, {
                y: "-100%",
                opacity: 0,
                duration: 0.8,
                ease: "power4.inOut",
                delay: 0.2
            });
        }
    });
}