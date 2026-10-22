(() => {
  const nav = document.getElementById("nav");
  const header = document.querySelector(".site-header");
  const menuToggles = document.querySelectorAll(".menu-toggle, [data-menu-open]");
  const closeBtns = document.querySelectorAll("[data-menu-close]");

  const setMenu = (open) => {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";

    header?.classList.toggle("is-menu-open", open);
    menuToggles.forEach((btn) => {
      btn.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    if (!open) {
      nav.querySelectorAll(".nav-item.has-sub.is-expanded").forEach((item) => {
        item.classList.remove("is-expanded");
        const icon = item.querySelector(".nav-parent__icon");
        if (icon) icon.textContent = "+";
        item.querySelector("[data-nav-accordion]")?.setAttribute("aria-expanded", "false");
      });
    }
  };

  menuToggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav?.classList.contains("is-open");
      setMenu(!isOpen);
    });
  });
  closeBtns.forEach((btn) => btn.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav?.classList.contains("is-open")) setMenu(false);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  nav?.querySelectorAll("[data-nav-accordion]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = btn.closest(".nav-item");
      if (!item) return;
      const willOpen = !item.classList.contains("is-expanded");

      nav.querySelectorAll(".nav-item.has-sub.is-expanded").forEach((other) => {
        if (other === item) return;
        other.classList.remove("is-expanded");
        const otherIcon = other.querySelector(".nav-parent__icon");
        if (otherIcon) otherIcon.textContent = "+";
        other.querySelector("[data-nav-accordion]")?.setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("is-expanded", willOpen);
      const icon = item.querySelector(".nav-parent__icon");
      if (icon) icon.textContent = willOpen ? "–" : "+";
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  // Desktop header & footer nav dropdowns (click '+' to toggle dropdown on mobile/touch, click link navigates)
  const navDrops = document.querySelectorAll(".nav-drop, .footer-drop");
  navDrops.forEach((drop) => {
    const trigger = drop.querySelector(".nav-drop__trigger, .footer-drop__trigger");
    if (!trigger) return;

    // If there is a plus indicator span, tapping the plus toggles dropdown on touch
    const plusSpan = trigger.querySelector("span");
    if (plusSpan) {
      plusSpan.style.cursor = "pointer";
      plusSpan.addEventListener("click", (e) => {
        // Only prevent navigation if clicked directly on the '+' symbol
        e.preventDefault();
        e.stopPropagation();
        const isOpen = drop.classList.contains("is-open");

        navDrops.forEach((other) => {
          if (other !== drop) {
            other.classList.remove("is-open");
            other.querySelector(".nav-drop__trigger, .footer-drop__trigger")?.setAttribute("aria-expanded", "false");
          }
        });

        drop.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-drop, .footer-drop")) {
      navDrops.forEach((drop) => {
        drop.classList.remove("is-open");
        drop.querySelector(".nav-drop__trigger, .footer-drop__trigger")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Close dropdowns on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      navDrops.forEach((drop) => {
        drop.classList.remove("is-open");
        drop.querySelector(".nav-drop__trigger, .footer-drop__trigger")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Hero slider
  const slides = [...document.querySelectorAll("[data-hero-slides] .hero__slide")];
  const countEl = document.querySelector("[data-hero-count]");
  let index = 0;
  let timer;

  const showSlide = (next) => {
    if (!slides.length) return;
    slides[index]?.classList.remove("is-active");
    index = (next + slides.length) % slides.length;
    slides[index]?.classList.add("is-active");
    if (countEl) countEl.textContent = `${index + 1} / ${slides.length}`;
  };

  const startAuto = () => {
    clearInterval(timer);
    if (slides.length < 2) return;
    timer = setInterval(() => showSlide(index + 1), 5500);
  };

  document.querySelector("[data-hero-prev]")?.addEventListener("click", () => {
    showSlide(index - 1);
    startAuto();
  });

  document.querySelector("[data-hero-next]")?.addEventListener("click", () => {
    showSlide(index + 1);
    startAuto();
  });

  startAuto();

  // Scroll reveals
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Contact form demo
  const form = document.querySelector("[data-contact-form]");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = form.querySelector("[data-form-note]");
    if (note) {
      note.hidden = false;
      note.textContent = "Thank you — your message has been received.";
    }
    form.reset();
  });

  // Services testimonials slider
  const slidesT = [...document.querySelectorAll("[data-testimonial-slider] .svc-testimonial")];
  const countT = document.querySelector("[data-testimonial-count]");
  let tIndex = 0;

  const showTestimonial = (next) => {
    if (!slidesT.length) return;
    slidesT[tIndex]?.classList.remove("is-active");
    tIndex = (next + slidesT.length) % slidesT.length;
    slidesT[tIndex]?.classList.add("is-active");
    if (countT) countT.textContent = `${tIndex + 1} / ${slidesT.length}`;
  };

  document.querySelector("[data-testimonial-prev]")?.addEventListener("click", () => {
    showTestimonial(tIndex - 1);
  });
  document.querySelector("[data-testimonial-next]")?.addEventListener("click", () => {
    showTestimonial(tIndex + 1);
  });

  // Testimonials page "Kind words" slider
  const kindSlides = [...document.querySelectorAll("[data-kind-slider] .tst-slide")];
  let kIndex = 0;

  const showKind = (next) => {
    if (!kindSlides.length) return;
    kindSlides[kIndex]?.classList.remove("is-active");
    kIndex = (next + kindSlides.length) % kindSlides.length;
    kindSlides[kIndex]?.classList.add("is-active");
  };

  document.querySelector("[data-kind-prev]")?.addEventListener("click", () => {
    showKind(kIndex - 1);
  });
  document.querySelector("[data-kind-next]")?.addEventListener("click", () => {
    showKind(kIndex + 1);
  });
})();
