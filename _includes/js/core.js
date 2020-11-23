(function() {
  window.__onThemeChange = function() {}
  function setTheme(newTheme) {
    window.__theme = newTheme
    preferredTheme = newTheme
    document.documentElement.setAttribute('class', newTheme)
    window.__onThemeChange(newTheme)
  }

  var preferredTheme
  try {
    preferredTheme = localStorage.getItem('theme')
  } catch (err) {}

  window.__setPreferredTheme = function(newTheme) {
    setTheme(newTheme)
    try {
      localStorage.setItem('theme', newTheme)
    } catch (err) {}
  }

  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkQuery.addListener(function(e) {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light')
  })

  setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'))

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
