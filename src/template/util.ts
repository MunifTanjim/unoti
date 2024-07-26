type MergeDefaults<A, B> = B extends undefined
  ? A
  : A extends undefined
    ? B
    : A extends Record<string, unknown>
      ? B extends Record<string, unknown>
        ? DefaultsDeep<A, B>
        : A
      : A

type DefaultsDeep<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
> = {
  [K in keyof A | keyof B]: K extends keyof A & keyof B
    ? MergeDefaults<A[K], B[K]>
    : K extends keyof A
      ? A[K]
      : K extends keyof B
        ? B[K]
        : never
}

const isPlainObject = (obj: unknown): obj is Record<string, unknown> => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export const defaults = <
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
>(
  object: A,
  defaultObject: B,
): DefaultsDeep<A, B> => {
  const result: Record<string, unknown> = object

  for (const key in result) {
    if (isPlainObject(result[key]) && isPlainObject(defaultObject[key])) {
      result[key] = defaults(result[key], defaultObject[key])
    }
  }

  for (const key in defaultObject) {
    if (typeof result[key] === 'undefined') {
      result[key] = defaultObject[key]
    }
  }

  return result as DefaultsDeep<A, B>
}
