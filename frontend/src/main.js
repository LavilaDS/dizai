import Router from "./router.js";
import Home from "./pages/Home.js";
import LearMore from "./pages/LearnMore.js";
import Login from "./pages/Login.js";

const routes = {
  "/": Home,
  "/about": LearMore,
  "/login": Login,
};

document.addEventListener("DOMContentLoaded", () => {
  const main = document.createElement("main");
  document.body.insertBefore(main, document.querySelector(".footer"));

  new Router(routes);
});
