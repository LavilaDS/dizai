import Router from './router.js';
import Home from './pages/Home.js';
import LearMore from './pages/LearnMore.js';


const routes = {
  '/': Home,
  '/about': LearMore,
};


document.addEventListener('DOMContentLoaded', () => {
  const main = document.createElement('main');
  document.body.insertBefore(main, document.querySelector('.footer'));
  
  new Router(routes);
});