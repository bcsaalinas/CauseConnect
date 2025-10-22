import express from "express";
const router = express.Router();
const users = [];
router.get("/signup", (req, res) => {
  res.render("pages/signup", {
    title: "Sign Up",
    page: "signup",
    error: null,
  });
});

router.get("/login", (req, res) => {
  res.render("pages/login", {
    title: "Login",
    page: "login",
    error: null, 
  });
});

router.post("/signup", (req, res) => {

  const { username, password } = req.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    res.render("pages/signup", {
      title: "Sign Up",
      page: "signup",
      error: "Ese nombre de usuario ya existe. Elige otro.",
    });
  } else {
    
    users.push({ username, password });
    console.log("¡Usuario nuevo registrado!", users); 
    res.redirect("/login");
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;


  const foundUser = users.find((user) => user.username === username);

  if (!foundUser || foundUser.password !== password) {

    res.render("pages/login", {
      title: "Login",
      page: "login",
      error: "Usuario o contraseña incorrectos.",
    });
  } else {
    res.redirect("/");
  }
});

export default router;