type NotiProvider<T> = import('../provider').NotiProvider<T>
type NotiStrategy<T> = import('../strategy').NotiStrategy<T>
type NotiStrategicSenderResponse = import('../strategy').NotiStrategicSenderResponse

export interface NotiChannel<NotiParams> {
  id: string
  send: NotiChannelSender<NotiParams>
}

export type NotiChannelConfig<NotiParams> = {
  id: string
  providers: Array<NotiProvider<NotiParams>>
  strategy: NotiStrategy<NotiParams>
}

export interface NotiChannelSenderResponse extends NotiStrategicSenderResponse {
  channelId: string
}

export type NotiChannelSender<NotiParams> = (
  params: NotiParams
) => Promise<NotiChannelSenderResponse>

export function NotiChannel<NotiParams>(
  config: NotiChannelConfig<NotiParams>
): NotiChannel<NotiParams> {
  const { id, providers, strategy } = config

  const strategicSend = strategy(providers)

  const send: NotiChannelSender<NotiParams> = async (params) => {
    const respnose = await strategicSend(params)

    return {
      ...respnose,
      channelId: id,
    }
  }

  const channel: NotiChannel<NotiParams> = {
    id,
    send,
  }

  return channel
}
