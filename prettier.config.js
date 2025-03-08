/** @type {import("prettier").Config} */
export default {
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss',
  ],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
}
