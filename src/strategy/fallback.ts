import type { NotiProvider } from '../provider'
import type {
  NotiStrategicSender,
  NotiStrategicSenderResponse,
} from '../strategy'

async function sendWithFallbackStrategy<T>(
  params: T,
  providers: Array<NotiProvider<T>>,
): Promise<NotiStrategicSenderResponse> {
  const [provider, ...remainingProviders] = providers

  if (typeof provider === 'undefined') {
    throw new Error('uNoti: SEND_FAILURE')
  }

  try {
    const response = await provider.send(params)

    return {
      ...response,
      providerId: provider.id,
    }
  } catch (err) {
    console.error(err)

    return await sendWithFallbackStrategy(params, remainingProviders)
  }
}

export function fallbackStrategy<T>(
  providers: Array<NotiProvider<T>>,
): NotiStrategicSender<T> {
  return async (params) => await sendWithFallbackStrategy(params, providers)
}
