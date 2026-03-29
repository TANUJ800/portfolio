// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const loadingScreen = document.getElementById("loading-screen")
const typingText = document.getElementById("typing-text")
const contactForm = document.getElementById("contact-form")
const carouselTrack = document.getElementById("carousel-track")
const dots = document.querySelectorAll(".dot")
const header = document.querySelector(".header")




// Global animation state
let isAnimating = false
let currentSlide = 0
let totalSlides = 0 // will be set after DOMContentLoaded

// Theme Management
/**
 * Initialize theme based on user preference or system setting
 */
function initTheme() {
  const savedTheme =
    localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

/**
 * Toggle between light and dark themes with smooth transition
 */
function toggleTheme() {
  if (isAnimating) return

  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  // Add transition class for smooth theme change
  document.body.style.transition = "all 0.3s ease"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)

  // Remove transition after animation
  setTimeout(() => {
    document.body.style.transition = ""
  }, 300)
}

/**
 * Update theme toggle icon with rotation animation
 */
function updateThemeIcon(theme) {
  const moonIcon = themeToggle.querySelector(".fa-moon")
  const sunIcon = themeToggle.querySelector(".fa-sun")

  if (theme === "dark") {
    moonIcon.style.opacity = "0"
    moonIcon.style.transform = "rotate(180deg)"
    sunIcon.style.opacity = "1"
    sunIcon.style.transform = "rotate(0deg)"
  } else {
    sunIcon.style.opacity = "0"
    sunIcon.style.transform = "rotate(180deg)"
    moonIcon.style.opacity = "1"
    moonIcon.style.transform = "rotate(0deg)"
  }
}

// Mobile Menu
/**
 * Toggle mobile menu with animation
 */
function toggleMobileMenu() {
  navMenu.classList.toggle("active")
  mobileMenuToggle.classList.toggle("active")

  // Animate hamburger menu
  const spans = mobileMenuToggle.querySelectorAll("span")
  if (mobileMenuToggle.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
  } else {
    spans.forEach((span) => {
      span.style.transform = ""
      span.style.opacity = ""
    })
  }
}

// Smooth Scrolling
/**
 * Smooth scroll to target section with offset for fixed header
 */
function smoothScroll(target) {
  const element = document.querySelector(target)
  if (element) {
    const headerHeight = header.offsetHeight
    const elementPosition = element.offsetTop - headerHeight - 20

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}

// Active Navigation Link
/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 150

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

/**
 * Add glassmorphism effect to header on scroll
 */
function handleHeaderScroll() {
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.backdropFilter = "blur(20px)"
    header.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  } else {
    header.style.background = "rgba(255, 255, 255, 0.9)"
    header.style.backdropFilter = "blur(10px)"
    header.style.boxShadow = "none"
  }
}

// Typing Animation
/**
 * Enhanced typewriter effect with realistic typing speed
 */
function typeWriter() {
  const texts = [
    "Full-Stack Developer",
    "Python Enthusiast",
    "React Specialist",
    "Java Developer",
    "Problem Solver",
    "Code Architect",
  ]

  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typeSpeed = 100

  function type() {
    const currentText = texts[textIndex]

    // Typing effect
    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
      typeSpeed = 50 // Faster deletion
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
      typeSpeed = Math.random() * 100 + 50 // Variable typing speed for realism
    }

    // Handle end of word
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000 // Pause at end
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
      typeSpeed = 500 // Pause before next word
    }

    setTimeout(type, typeSpeed)
  }

  type()
}

// Scroll Animations
/**
 * Initialize Intersection Observer for scroll animations
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Trigger specific animations based on element type
        if (entry.target.classList.contains("stat")) {
          animateCounter(entry.target)
        }

        if (entry.target.classList.contains("skill-card")) {
          animateSkillBar(entry.target)
        }
      }
    })
  }, observerOptions)

  // Add animation classes to elements
  const animatedElements = document.querySelectorAll(`
    .section, .project-card, .skill-card, .stat, 
    .certificate-card, .contact-method, .intro-text
  `)

  animatedElements.forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.animationDelay = `${index * 0.1}s`
    observer.observe(el)
  })
}

/**
 * Animate counter numbers with easing
 */
function animateCounter(element) {
  const target = Number.parseInt(element.dataset.count)
  const numberElement = element.querySelector(".stat-number")
  const duration = 2000
  const startTime = performance.now()

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const current = Math.floor(easeOutQuart * target)

    numberElement.textContent = current + "+"

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

/**
 * Animate skill level bars
 */
function animateSkillBar(skillCard) {
  const levelFill = skillCard.querySelector(".level-fill")
  const targetLevel = Number.parseInt(levelFill.dataset.level)

  setTimeout(() => {
    levelFill.style.width = targetLevel + "%"
  }, 300)
}

// Certificate Carousel
/**
 * Show specific slide with smooth transition
 */
function showSlide(index) {
  if (isAnimating) return

  isAnimating = true
  const translateX = -index * 100

  carouselTrack.style.transform = `translateX(${translateX}%)`

  // Update dots with animation
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
    if (i === index) {
      dot.style.transform = "scale(1.2)"
    } else {
      dot.style.transform = "scale(1)"
    }
  })

  currentSlide = index

  setTimeout(() => {
    isAnimating = false
  }, 600)
}

/**
 * Auto-advance carousel
 */
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides
  showSlide(currentSlide)
}

/**
 * Initialize carousel with touch/swipe support
 */
function initCarousel() {
  const carouselContainer = document.querySelector('.carousel-container');
  totalSlides = document.querySelectorAll('.certificate-card').length;
  let autoTimer = null;
  const startAuto = () => { if (autoTimer) clearInterval(autoTimer); autoTimer = setInterval(nextSlide, 4000); };
  const stopAuto  = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };
  // Auto-slide every 4 seconds
  startAuto()

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index))
  })

  // Pause auto-slide on hover (desktop)
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAuto)
    carouselContainer.addEventListener('mouseleave', startAuto)
  }

  // Touch/swipe support for mobile
  let startX = 0
  let endX = 0

  carouselTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
  })

  carouselTrack.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        nextSlide()
      } else {
        // Swipe right - previous slide
        currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1
        showSlide(currentSlide)
      }
    }
  }
}

// Contact Form
/**
 * Handle contact form submission with validation and animation
 */
function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const data = Object.fromEntries(formData)

  // Basic validation
  if (!validateForm(data)) {
    showNotification("Please fill in all fields correctly.", "error")
    return
  }

  const submitButton = contactForm.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML

  // Animate button during submission
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitButton.disabled = true
  submitButton.style.background = "var(--text-muted)"

  // Simulate form submission
  setTimeout(() => {
    showNotification("Thank you for your message! I'll get back to you soon.", "success")
    contactForm.reset()

    // Reset button
    submitButton.innerHTML = originalText
    submitButton.disabled = false
    submitButton.style.background = ""

    // Reset form lines
    document.querySelectorAll(".form-line").forEach((line) => {
      line.style.width = "0"
    })
  }, 2000)
}

/**
 * Validate form data
 */
function validateForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return (
    data.name.trim().length > 0 &&
    emailRegex.test(data.email) &&
    data.subject.trim().length > 0 &&
    data.message.trim().length > 10
  )
}

/**
 * Show notification with animation
 */
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Style notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    color: "white",
    fontWeight: "500",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    background: type === "success" ? "var(--primary-color)" : "#ef4444",
  })

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Button Ripple Effect
/**
 * Create ripple effect on button click
 */
function createRipple(event) {
  const button = event.currentTarget
  const circle = document.createElement("span")
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  // Position and style ripple
  Object.assign(circle.style, {
    width: diameter + "px",
    height: diameter + "px",
    left: event.clientX - button.offsetLeft - radius + "px",
    top: event.clientY - button.offsetTop - radius + "px",
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.6)",
    transform: "scale(0)",
    animation: "ripple-animation 0.6s linear",
    pointerEvents: "none",
  })

  // Remove existing ripple
  const existingRipple = button.querySelector(".ripple")
  if (existingRipple) {
    existingRipple.remove()
  }

  circle.classList.add("ripple")
  button.appendChild(circle)

  // Remove ripple after animation
  setTimeout(() => {
    circle.remove()
  }, 600)
}

// Loading Screen
/**
 * Hide loading screen with staggered animation
 */
function hideLoadingScreen() {
  const loadingContent = document.querySelector(".loading-content")

  // Animate loading elements out
  loadingContent.style.transform = "scale(0.8)"
  loadingContent.style.opacity = "0"

  setTimeout(() => {
    loadingScreen.classList.add("hidden")

    // Start hero animations after loading screen disappears
    setTimeout(() => {
      startHeroAnimations()
    }, 500)
  }, 800)
}

/**
 * Start hero section animations in sequence
 */
function startHeroAnimations() {
  const heroElements = document.querySelectorAll(".hero-text > *")

  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, index * 200)
  })
}

// Parallax effect for hero section
/**
 * Handle parallax scrolling effects
 */
function handleParallaxScroll() {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".floating-shapes .shape")

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1
    element.style.transform = `translateY(${scrolled * speed}px)`
  })

  // Parallax for gradient orbs
  const orbs = document.querySelectorAll(".gradient-orbs .orb")
  orbs.forEach((orb, index) => {
    const speed = 0.3 + index * 0.05
    orb.style.transform = `translateY(${scrolled * speed}px)`
  })
}

// Enhanced project card hover effects
/**
 * Add magnetic effect to buttons and cards
 */
function initMagneticEffects() {
  const magneticElements = document.querySelectorAll(".btn, .project-card, .skill-card")

  magneticElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
    })

    element.addEventListener("mouseleave", () => {
      element.style.transform = ""
    })
  })
}

/**
 * Add tilt effect to project cards
 */
function initTiltEffects() {
  const tiltElements = document.querySelectorAll(".project-card")

  tiltElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    })

    element.addEventListener("mouseleave", () => {
      element.style.transform = ""
    })
  })
}

// Performance Optimizations
/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Event Listeners
/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize core functionality
  initTheme()
  typeWriter()
  initScrollAnimations()
  initCarousel()
  initMagneticEffects()
  initTiltEffects()

  // Hide loading screen after delay
  setTimeout(hideLoadingScreen, 2000)
})

// Theme toggle
themeToggle.addEventListener("click", toggleTheme)

// Mobile menu
mobileMenuToggle.addEventListener("click", toggleMobileMenu)

// Contact form
contactForm.addEventListener("submit", handleContactForm)

// Navigation links with smooth scrolling
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const target = link.getAttribute("href")
    smoothScroll(target)

    // Close mobile menu if open
    if (navMenu.classList.contains("active")) {
      toggleMobileMenu()
    }
  })
})

// Optimized scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    updateActiveNavLink()
    handleHeaderScroll()
    handleParallaxScroll()
  }, 16),
) // ~60fps

// Button ripple effects
document.addEventListener("click", (e) => {
  if (e.target.closest(".btn")) {
    createRipple(e)
  }
})

// Form input animations
document.querySelectorAll(".form-group input, .form-group textarea").forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("focused")
  })

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.parentElement.classList.remove("focused")
    }
  })
})

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("active")) {
    toggleMobileMenu()
  }
})

// Resize handler for responsive adjustments
window.addEventListener(
  "resize",
  debounce(() => {
    // Recalculate positions and sizes if needed
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      toggleMobileMenu()
    }
  }, 250),
)

// Additional CSS Animations
// Add dynamic CSS for animations
const additionalStyles = document.createElement("style")
additionalStyles.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .notification {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .form-group.focused label {
    color: var(--primary-color);
    transform: translateY(-2px);
  }
  
  .hero-text > * {
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
`
document.head.appendChild(additionalStyles)

// Console Signature
console.log(`
🚀 Portfolio by Tanuj Sutharin
📧 suthartanuj111@gmail.com
🌟 Crafted with passion and precision
`)
