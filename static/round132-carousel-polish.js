(function () {
  const GAME_ROUTES = new Set(["/island", "/island-builder"]);
  let round132CarouselTimer = null;
  const isGameRoute = () => GAME_ROUTES.has((location.hash || "#/home").replace(/^#/, "").split("?")[0]);
  const isHomeRoute = () => {
    const route = (location.hash || "#/home").replace(/^#/, "").split("?")[0];
    return route === "/" || route === "/home" || route === "";
  };

  function enhanceCarousel() {
    if (isGameRoute() || !isHomeRoute()) return;
    const carousel = document.querySelector(".mp-carousel");
    const track = carousel?.querySelector("[data-carousel-track]");
    const cards = track ? Array.from(track.querySelectorAll(".mp-entry-card")) : [];
    const dots = carousel ? Array.from(carousel.querySelectorAll("[data-carousel-dot]")) : [];
    if (!carousel || !track || cards.length < 2 || !dots.length) return;
    const region = carousel.closest(".mp-section") || carousel;
    if (track.dataset.round132Carousel === "true" && region.dataset.round132bBound === "true") return;

    track.dataset.round132Carousel = "true";
    track.style.overflowX = window.innerWidth <= 720 ? "auto" : "hidden";

    const measure = () => {
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "18") || 18;
      const cardWidth = cards[0]?.getBoundingClientRect().width || 1;
      const step = cardWidth + gap;
      const visibleCards = Math.max(1, Math.floor((track.clientWidth + gap) / step));
      const maxShift = Math.max(0, (cards.length - visibleCards) * step);
      return { step, maxShift };
    };

    let index = Number(track.dataset.round132Index || "0") || 0;
    let touchStartX = 0;

    const set = (nextIndex, options = {}) => {
      const { step, maxShift } = measure();
      index = Math.max(0, Math.min(cards.length - 1, nextIndex));
      const left = Math.min(index * step, maxShift);
      track.dataset.round132Index = String(index);
      if (options.manual) {
        track.dataset.round132LockUntil = String(Date.now() + 60000);
      }
      track.style.setProperty("--mp-carousel-x", `${left}px`);
      if (window.innerWidth <= 720) {
        track.style.transform = "translateX(0px)";
        track.scrollLeft = left;
      } else {
        track.style.transform = `translateX(-${left}px)`;
        track.scrollLeft = 0;
      }
      cards.forEach((card, cardIndex) => card.classList.toggle("is-current", cardIndex === index));
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
    };

    const restartAuto = () => {
      window.clearInterval(round132CarouselTimer);
      round132CarouselTimer = window.setInterval(() => {
        if (document.hidden || isGameRoute() || !isHomeRoute()) return;
        const lockedUntil = Number(track.dataset.round132LockUntil || 0);
        if (lockedUntil > Date.now()) {
          set(index);
          return;
        }
        set((index + 1) % cards.length);
      }, 7600);
    };

    if (!region.dataset.round132bBound) {
      region.dataset.round132bBound = "true";
      const activateControl = (event) => {
        const control = event.target.closest("[data-carousel], [data-carousel-dot]");
        if (!control || !region.contains(control)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        track.dataset.round132LastClick = control.getAttribute("data-carousel-dot") || control.getAttribute("data-carousel") || "";
        if (control.hasAttribute("data-carousel-dot")) {
          set(Number(control.getAttribute("data-carousel-dot") || "0"), { manual: true });
        } else {
          const direction = control.getAttribute("data-carousel") === "next" ? 1 : -1;
          set((index + direction + cards.length) % cards.length, { manual: true });
        }
        restartAuto();
      };
      region.addEventListener("pointerup", activateControl, true);
      region.addEventListener("click", activateControl, true);

      carousel.addEventListener("touchstart", (event) => {
        touchStartX = event.touches?.[0]?.clientX || 0;
        window.clearInterval(round132CarouselTimer);
      }, { passive: true });

      carousel.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches?.[0]?.clientX || touchStartX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) > 34) {
          set((index + (delta < 0 ? 1 : -1) + cards.length) % cards.length, { manual: true });
        }
        restartAuto();
      }, { passive: true });

      window.addEventListener("resize", () => set(index));
      window.setInterval(() => {
        if (!track.isConnected || isGameRoute() || !isHomeRoute()) return;
        const lockedUntil = Number(track.dataset.round132LockUntil || 0);
        if (lockedUntil > Date.now()) set(index);
      }, 800);
    }

    set(index);
    restartAuto();
  }

  function scheduleEnhance() {
    window.requestAnimationFrame(() => window.setTimeout(enhanceCarousel, 80));
  }

  function watchForCarousel() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      enhanceCarousel();
      const track = document.querySelector("[data-carousel-track]");
      if (track?.dataset.round132Carousel === "true" || attempts > 30 || isGameRoute()) {
        window.clearInterval(timer);
      }
    }, 160);
  }

  window.addEventListener("hashchange", scheduleEnhance);
  window.addEventListener("load", scheduleEnhance);
  document.addEventListener("DOMContentLoaded", scheduleEnhance);
  watchForCarousel();
  if ("MutationObserver" in window) {
    const observer = new MutationObserver(() => enhanceCarousel());
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  scheduleEnhance();
})();
