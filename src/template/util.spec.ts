import { defaults } from './util'

describe('template/util/defaults', () => {
  it('should deep assign default properties if missing in `object`', () => {
    expect(
      defaults(
        {
          a: { b: 2 },
          d: 4,
        },
        {
          a: { b: 3, c: 3 },
          e: 5,
        },
      ),
    ).toEqual({
      a: { b: 2, c: 3 },
      d: 4,
      e: 5,
    })
  })

  it('should not overwrite `null` values', () => {
    expect(defaults({ a: { b: null } }, { a: { b: 2 } }).a.b).toEqual(null)
  })

  it('should overwrite `undefined` values', () => {
    expect(defaults({ a: { b: undefined } }, { a: { b: 2 } }).a.b).toEqual(2)
  })
})
