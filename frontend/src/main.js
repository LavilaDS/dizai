import Router from "./router.js";
import Home from "./pages/Home.js";
import LearnMore from "./pages/LearnMore.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Dashboard from "./pages/Dashboard.js";


const routes = {
  "/": Home,
  "/about": LearnMore,
  "/login": Login,
  "/signup": Signup,
  "/dashboard": Dashboard, // O router vai tratar sub-rotas
};

document.addEventListener("DOMContentLoaded", () => {
  const main = document.createElement("main");
  document.body.insertBefore(main, document.querySelector(".footer"));
  new Router(routes);
});
