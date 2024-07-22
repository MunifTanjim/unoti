import { NotiChannelError, NotiProviderError } from '../error'
import type { NotiProvider } from '../provider'
import type { NotiStrategicSender } from '../strategy'

export function randomStrategy<T>(
  channelId: string,
  providers: Array<NotiProvider<T>>,
): NotiStrategicSender<T> {
  return async (params) => {
    const index = Math.floor(Math.random() * providers.length)

    const provider = providers[index]

    if (typeof provider === 'undefined') {
      throw new NotiChannelError(
        'channel_send_failure',
        'Failed to pick provider with random strategy',
        { metadata: { channelId } },
      )
    }

    try {
      const response = await provider.send(params)

      return {
        ...response,
        providerId: provider.id,
      }
    } catch (err) {
      throw new NotiChannelError(
        'channel_send_failure',
        'Failed to send with random strategy',
        {
          errors: [
            NotiProviderError.create(err, 'provider_send_failure', {
              metadata: { channelId, providerId: provider.id },
            }),
          ],
          metadata: { channelId },
        },
      )
    }
  }
}
