import {
  NotiChannelError,
  NotiError,
  NotiProviderError,
  NotiTemplateError,
} from '.'

describe('NotiError', () => {
  it('can be constructed', () => {
    const error = new NotiError('unknown', 'NotiError', {
      cause: new Error('cause'),
      errors: [new Error('error')],
      metadata: { isTest: true },
    })
    expect(error).toBeInstanceOf(NotiError)
    expect(error.name).toBe('NotiError')

    expect(error.message).toBe('NotiError')
    expect(error.code).toBe('unknown')

    expect(error.cause).toBeInstanceOf(Error)
    expect((error.cause as Error).message).toBe('cause')

    expect(error.errors).toHaveLength(1)
    const err = error.errors![0]
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('error')

    expect(error.metadata).toMatchObject({
      isTest: true,
    })
  })
})

for (const testCase of [
  {
    cls: NotiChannelError,
    code: 'channel_send_failure',
    message: 'ChannelError',
    cause: new Error('cause'),
    metadata: {
      channelId: '42',
    },
    error: new Error('error'),
    construct() {
      return new this.cls(this.code, this.message, {
        cause: this.cause,
        metadata: this.metadata,
        errors: [this.error],
      })
    },
    fromError(error: unknown) {
      return this.cls.create(error, this.code, {
        metadata: this.metadata,
        errors: [this.error],
      })
    },
    fromSelf() {
      const self = this.construct()
      return {
        self,
        error: this.cls.create(self, this.code, {
          metadata: this.metadata,
          errors: [this.error],
        }),
      }
    },
  },
  {
    cls: NotiProviderError,
    code: 'provider_send_failure',
    message: 'ProviderError',
    cause: new Error('cause'),
    metadata: {
      providerId: '42',
    },
    error: new Error('error'),
    construct() {
      return new this.cls(this.code, this.message, {
        cause: this.cause,
        metadata: this.metadata,
        errors: [this.error],
      })
    },
    fromError(error: unknown) {
      return this.cls.create(error, this.code, {
        metadata: this.metadata,
        errors: [this.error],
      })
    },
    fromSelf() {
      const self = this.construct()
      return {
        self,
        error: this.cls.create(self, this.code, {
          metadata: this.metadata,
          errors: [this.error],
        }),
      }
    },
  },
  {
    cls: NotiTemplateError,
    code: 'template_render_failure',
    message: 'TemplateError',
    cause: new Error('cause'),
    metadata: {
      templateId: '42',
    },
    error: new Error('error'),
    construct() {
      return new this.cls(this.code, this.message, {
        cause: this.cause,
        metadata: this.metadata,
        errors: [this.error],
      })
    },
    fromError(error: unknown) {
      return this.cls.create(error, this.code, {
        metadata: this.metadata,
        errors: [this.error],
      })
    },
    fromSelf() {
      const self = this.construct()
      return {
        self,
        error: this.cls.create(self, this.code, {
          metadata: this.metadata,
          errors: [this.error],
        }),
      }
    },
  },
] as const) {
  describe(testCase.cls.name, () => {
    it('can be constructed', () => {
      const error = testCase.construct()

      expect(error).toBeInstanceOf(NotiError)
      expect(error).toBeInstanceOf(testCase.cls)

      expect(error.name).toBe(testCase.cls.name)

      expect(error.message).toBe(testCase.message)

      expect(error.code).toBe(testCase.code)

      expect(error.cause).toBe(testCase.cause)

      expect(error.errors).toMatchObject([testCase.error])

      expect(error.metadata).toMatchObject(testCase.metadata)
    })

    it('can be created from self', () => {
      const { self, error } = testCase.fromSelf()
      expect(error).toBe(self)
    })

    it('can be created from Error', () => {
      const error = testCase.fromError(testCase.cause)

      expect(error).toBeInstanceOf(NotiError)
      expect(error).toBeInstanceOf(testCase.cls)

      expect(error.name).toBe(testCase.cls.name)

      expect(error.message).toBe(testCase.cause.message)

      expect(error.code).toBe(testCase.code)

      expect(error.cause).toBe(testCase.cause)

      expect(error.errors).toMatchObject([testCase.error])

      expect(error.metadata).toMatchObject(testCase.metadata)
    })

    it('can be created from unknown', () => {
      const error = testCase.fromError('Unknown')

      expect(error).toBeInstanceOf(NotiError)
      expect(error).toBeInstanceOf(testCase.cls)

      expect(error.name).toBe(testCase.cls.name)

      expect(error.message).toBe(`Unexpected ${testCase.cls.name}`)

      expect(error.code).toBe(testCase.code)

      expect(error.cause).toBe('Unknown')

      expect(error.errors).toMatchObject([testCase.error])

      expect(error.metadata).toMatchObject(testCase.metadata)
    })
  })
}
