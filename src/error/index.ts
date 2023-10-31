type NotiErrorMetadata<M extends Record<string, boolean | number | string>> =
  Partial<M & Record<string, boolean | number | string>>

type NotiErrorOptions<M extends Record<string, boolean | number | string>> =
  ErrorOptions & {
    errors?: Error[]
    metadata?: NotiErrorMetadata<M>
  }

export class NotiError<
  C extends string,
  M extends Record<string, boolean | number | string>,
> extends Error {
  code: C
  metadata: NotiErrorMetadata<M>

  errors?: Error[]

  constructor(code: C, message: string, options?: NotiErrorOptions<M>) {
    super(message, options)

    this.name = this.constructor.name

    this.code = code
    this.metadata = options?.metadata ?? {}

    this.errors = options?.errors
  }
}

const getCreateNotiError = <
  Code extends string,
  Metadata extends Record<string, boolean | number | string>,
  C extends typeof NotiError<Code, Metadata> = typeof NotiError<Code, Metadata>,
>(
  cls: C,
) => {
  return (
    err: unknown,
    code: ConstructorParameters<C>[0],
    options: ConstructorParameters<C>[2],
  ) => {
    if (err instanceof cls) {
      return err
    }
    return new cls(
      code,
      err instanceof Error ? err.message : `Unexpected ${cls.name}`,
      { cause: err, ...options },
    )
  }
}

export class NotiChannelError extends NotiError<
  'channel_send_failure',
  { channelId: string }
> {
  static create = getCreateNotiError(NotiChannelError)
}

export class NotiProviderError extends NotiError<
  'provider_send_failure',
  { providerId: string }
> {
  static create = getCreateNotiError(NotiProviderError)
}

export class NotiTemplateError extends NotiError<
  | 'template_not_found'
  | 'template_renderer_not_found'
  | 'template_render_failure',
  {
    templateId: string
    rendererId?: string
  }
> {
  static create = getCreateNotiError(NotiTemplateError)
}
