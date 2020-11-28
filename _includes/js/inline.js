(function() {
  window.__onThemeChange = function() {}
  function setTheme(newTheme) {
    document.documentElement.setAttribute('class', newTheme)
    window.__theme = newTheme
    preferredTheme = newTheme
    window.__onThemeChange(newTheme)
  }

  var preferredTheme = localStorage.getItem('theme')
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

  setTheme(preferredTheme )
})();