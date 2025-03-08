import React from 'react'
import { Breakpoint, useBreakpoint } from '../hooks/use-breakpoint'

export type Scaling = Record<Breakpoint, number> | number

export function Scalable(props: {
  children: ((scaling: number) => React.ReactElement) | React.ReactElement
  scaling: Scaling
}) {
  const breakpoint = useBreakpoint()

  let scaling = 1
  if (typeof props.scaling === 'number') {
    scaling = props.scaling
  } else if (breakpoint) {
    scaling = props.scaling[breakpoint]
  }
  const child = typeof props.children === 'function' ? props.children(scaling) : props.children
  const childProps = child.props as any

  return React.cloneElement(child, {
    ...childProps,
    style: {
      ...childProps.style,
      '--scaling': scaling,
    },
  })
}
