<h1 align="center">🌐 CauseConnect</h1>

<p align="center">
  Connects citizens with NGOs and foundations in Guadalajara — <b>SDG 17</b>.
</p>

<p align="center">
  <a href="https://bcsaalinas.github.io/CauseConnect/">
    <img src="https://img.shields.io/badge/Live%20Preview-GitHub%20Pages-blue?style=for-the-badge" alt="Live Preview">
  </a>
</p>

---

## 🚀 Live Preview

✨ **Check out the project here:**  
👉 [https://bcsaalinas.github.io/CauseConnect/](https://bcsaalinas.github.io/CauseConnect/)

---

## 📖 About the Project

CauseConnect is a platform built to connect citizens with NGOs and foundations in Guadalajara.  
The goal is to make social participation simpler, more organized, and more effective.

## 🧭 Front-end notes

- the layout uses glass panels, fade-up classes, and bootstrap grid — tweak tokens in `src/public/css/main.css` to keep spacing consistent.
- gsap + scrolltrigger come from the npm package (served via `server.js`); `src/public/js/scroll-effects.js` holds the hero keynote sequence and section timelines with plain comments for tweaks.
- want to tone animations down? remove `data-animate="skip"` from any block and the simple fade fallback takes over automatically.
- navbar behavior and scroll fades respect prefers-reduced-motion; if you add new animated blocks, reuse the `fade-up` class or plug into the existing gsap timeline.
- form validation lives in `src/public/js/form-handlers.js` with simple checks so backend responses can hook in later.
