(() => {
  const toggleBtn = document.querySelector('.toggle-theme');
  
  toggleBtn.addEventListener('click', toggleTheme);
  
  function toggleTheme() {
    let attr = document.documentElement.getAttribute('class');
    if (attr === 'light') {
      attr = 'dark';
    } else {
      attr = 'light';
    };
    window.__setPreferredTheme(attr);
  }
})();

(() => {
  const btn = document.querySelector('.nav__burger');
  const menu = document.querySelector('.header');
  btn.addEventListener('click', function(event) {
    btn.firstElementChild.classList.toggle('menu-opened');
    menu.classList.toggle('menu-opened');
  })
})();
