// Revelado al hacer scroll (ver README > Interactions & Behavior > Revelado al hacer scroll).
// El contenido es visible sin JS: solo si este script arranca se oculta
// primero y se revela con IntersectionObserver.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (targets.length) {
    targets.forEach((el) => el.classList.add('reveal-pending'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pending');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => io.observe(el));
  }
}
