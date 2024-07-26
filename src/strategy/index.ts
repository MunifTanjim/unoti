import type { NotiProvider, NotiProviderSenderResponse } from '../provider'

export type NotiStrategy<NotiParams> = (
  channelId: string,
) => NotiStrategicSender<NotiParams>

export interface NotiStrategicSenderResponse
  extends NotiProviderSenderResponse {
  providerId: string
}

export type NotiStrategicSender<NotiParams> = (
  params: NotiParams,
  providers: Array<NotiProvider<NotiParams>>,
) => Promise<NotiStrategicSenderResponse>

export * from './fallback'
export * from './random'
