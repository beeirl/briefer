export class VisibleError extends Error {
  constructor(
    public kind: 'input' | 'auth' | 'billing',
    public code: string,
    public message: string
  ) {
    super(message)
  }
}
