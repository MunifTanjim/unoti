import { NotiChannelError, NotiProviderError } from '../error'
import type { NotiProvider } from '../provider'
import type {
  NotiStrategicSender,
  NotiStrategicSenderResponse,
} from '../strategy'

async function sendWithFallbackStrategy<T>(
  params: T,
  channelId: string,
  providers: Array<NotiProvider<T>>,
  errors: NotiProviderError[] = [],
): Promise<NotiStrategicSenderResponse> {
  const [provider, ...remainingProviders] = providers

  if (typeof provider === 'undefined') {
    throw new NotiChannelError(
      'channel_send_failure',
      'Failed to send with fallback strategy',
      { errors, metadata: { channelId } },
    )
  }

  try {
    const response = await provider.send(params)

    return {
      ...response,
      providerId: provider.id,
    }
  } catch (err) {
    errors.push(
      NotiProviderError.create(err, 'provider_send_failure', {
        metadata: { channelId, providerId: provider.id },
      }),
    )
    return await sendWithFallbackStrategy(
      params,
      channelId,
      remainingProviders,
      errors,
    )
  }
}

export function fallbackStrategy<T>(channelId: string): NotiStrategicSender<T> {
  return async (params, providers) => {
    return await sendWithFallbackStrategy(params, channelId, providers)
  }
}
