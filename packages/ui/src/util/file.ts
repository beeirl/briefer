export const fileExtensionMap = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
} as const
export type FileExtension = keyof typeof fileExtensionMap
