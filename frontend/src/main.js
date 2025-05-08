import Router from "./router.js";
import Home from "./pages/Home.js";
import LearMore from "./pages/LearnMore.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";

const routes = {
  "/": Home,
  "/about": LearMore,
  "/login": Login,
  "/signup": Signup,
};

document.addEventListener("DOMContentLoaded", () => {
  const main = document.createElement("main");
  document.body.insertBefore(main, document.querySelector(".footer"));

  new Router(routes);
});
