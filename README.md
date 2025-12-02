<h1 align="center">🌐 CauseConnect</h1>

<p align="center">
  Connects citizens with NGOs and foundations in Guadalajara — <b>SDG 17</b>.
</p>

<p align="center">
  <a href="https://plankton-app-q5a3a.ondigitalocean.app">
    <img src="https://img.shields.io/badge/Live%20Preview-DigitalOcean-blue?style=for-the-badge" alt="Live Preview">
  </a>
</p>

---

## 🚀 Live Preview

✨ **Check out the project here:**  
👉 [https://plankton-app-q5a3a.ondigitalocean.app](https://plankton-app-q5a3a.ondigitalocean.app)

---

## 📖 About the Project

CauseConnect is a platform built to connect citizens with NGOs and foundations in Guadalajara.  
The goal is to make social participation simpler, more organized, and more effective.

## � Documentation

- [**Dev Log**](./DEVLOG.md): Track the development progress.
- [**Design Document**](./DESIGN.md): Sketches, diagrams, and workflows.
- [**Conclusion & Reflections**](./CONCLUSION.md): Challenges, solutions, and team reflections.

## �🛠️ Tech Stack

- **Frontend:** React, Vite, Bootstrap 5, GSAP
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **External APIs:** GlobalGiving API

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a connection string)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/bcsaalinas/CauseConnect.git
    cd CauseConnect
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/causeconnect
    JWT_SECRET=your_jwt_secret_key
    GLOBALGIVING_API_KEY=your_api_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```
    This will start both the backend server (port 3000) and the frontend client (port 5173).

5.  Open your browser and visit `http://localhost:5173`.

## 🚀 Deployment

To build the project for production:

```bash
npm run build
```


## 🧭 Front-end notes

- the layout uses glass panels, fade-up classes, and bootstrap grid — tweak tokens in `src/public/css/main.css` to keep spacing consistent.
- gsap + scrolltrigger come from the npm package (served via `server.js`); `src/public/js/scroll-effects.js` holds the hero keynote sequence and section timelines with plain comments for tweaks.
- want to tone animations down? remove `data-animate="skip"` from any block and the simple fade fallback takes over automatically.
- navbar behavior and scroll fades respect prefers-reduced-motion; if you add new animated blocks, reuse the `fade-up` class or plug into the existing gsap timeline.
- form validation lives in `src/public/js/form-handlers.js` with simple checks so backend responses can hook in later.
