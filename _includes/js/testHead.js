const COLOR_SCHEME_BUTTON_CLASSNAME = 'toggle-theme'

const COLOR_SCHEME_DARK_CLASSNAME = 'dark'

const COLOR_SCHEME_KEY = 'colorScheme'
const COLOR_SCHEME_DARK_VALUE = 'colorSchemeDark'
const COLOR_SCHEME_LIGHT_VALUE = 'colorSchemeLight'

// Handle initial dark scheme state
const storedColorScheme = localStorage.getItem(COLOR_SCHEME_KEY)
const shouldApplyDarkScheme = storedColorScheme === COLOR_SCHEME_DARK_VALUE

if (storedColorScheme === COLOR_SCHEME_DARK_VALUE) {
  document.documentElement.classList.add(COLOR_SCHEME_DARK_CLASSNAME)
}

// Save color scheme state in web storage
localStorage.setItem(
  COLOR_SCHEME_KEY,
  shouldApplyDarkScheme ? COLOR_SCHEME_DARK_VALUE : COLOR_SCHEME_LIGHT_VALUE
)