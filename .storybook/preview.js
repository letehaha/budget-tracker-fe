// In case we will put these .scss improts to `main.js` sass-loader options,
// they will be applied inside the SFC <style> tag, and in case SFC uses scoped
// styles, global styles and css-variables will be broken
import '../src/styles/index.scss';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
