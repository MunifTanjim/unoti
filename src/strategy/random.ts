import type { NotiProvider } from '../provider'
import type { NotiStrategicSender } from '../strategy'

export function randomStrategy<T>(
  providers: Array<NotiProvider<T>>,
): NotiStrategicSender<T> {
  const index = Math.floor(Math.random() * providers.length)

  const provider = providers[index]

  if (typeof provider === 'undefined') {
    throw new Error('uNoti: SEND_FAILURE')
  }

  return async (params) => {
    const response = await provider.send(params)

    return {
      ...response,
      providerId: provider.id,
    }
  }
}
