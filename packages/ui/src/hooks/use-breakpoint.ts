import React from 'react'

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
export type Breakpoint = keyof typeof breakpoints

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>()

  React.useEffect(() => {
    function handleChange() {
      const width = window.innerWidth
      if (width < breakpoints.sm) {
        setBreakpoint('sm')
      } else if (width < breakpoints.md) {
        setBreakpoint('sm')
      } else if (width < breakpoints.lg) {
        setBreakpoint('md')
      } else if (width < breakpoints.xl) {
        setBreakpoint('lg')
      } else if (width < breakpoints['2xl']) {
        setBreakpoint('xl')
      } else {
        setBreakpoint('2xl')
      }
    }
    handleChange()
    window.addEventListener('resize', handleChange)
    return () => window.removeEventListener('resize', handleChange)
  }, [])

  return breakpoint
}
