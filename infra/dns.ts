export const domain =
  {
    production: 'briefer.5head.org',
    dev: 'dev.briefer.5head.org',
  }[$app.stage] || $app.stage + '.dev.briefer.5head.org'
