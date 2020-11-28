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

// Check stored color scheme value
const isDarkSchemeApplied = document.documentElement.classList.contains(
  COLOR_SCHEME_DARK_CLASSNAME
)

const colorSchemeButton = document.getElementsByClassName(
  COLOR_SCHEME_BUTTON_CLASSNAME
)[0]

// Make button accessible for screen readers and set press state
colorSchemeButton.setAttribute('tabindex', '0')
colorSchemeButton.setAttribute(
  'aria-pressed',
  isDarkSchemeApplied ? 'true' : 'false'
)

// Toggle color scheme on button click event
colorSchemeButton.addEventListener('click', () => {
  const shouldChangeToDarkScheme = !document.documentElement.classList.contains(
    COLOR_SCHEME_DARK_CLASSNAME
  )

  // Update root element class name
  document.documentElement.classList.toggle(
    COLOR_SCHEME_DARK_CLASSNAME,
    shouldChangeToDarkScheme
  )

  // Set pressed attribute for button accessibility
  colorSchemeButton.setAttribute(
    'aria-pressed',
    shouldChangeToDarkScheme ? 'true' : 'false'
  )

  // Update cached state in web storage
  localStorage.setItem(
    COLOR_SCHEME_KEY,
    shouldChangeToDarkScheme
      ? COLOR_SCHEME_DARK_VALUE
      : COLOR_SCHEME_LIGHT_VALUE
  )
})