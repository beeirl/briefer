import { customAlphabet } from 'nanoid'
import { ulid } from 'ulid'

const prefixes = {
  brief: 'brf',
  user: 'usr',
} as const

export function createID(prefix: keyof typeof prefixes) {
  return [prefixes[prefix], ulid()].join('_')
}

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

export function createShortId() {
  return nanoid()
}
