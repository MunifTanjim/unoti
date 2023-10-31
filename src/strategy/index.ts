import type { NotiProvider, NotiProviderSenderResponse } from '../provider'

export type NotiStrategy<NotiParams> = (
  providers: Array<NotiProvider<NotiParams>>,
) => NotiStrategicSender<NotiParams>

export interface NotiStrategicSenderResponse
  extends NotiProviderSenderResponse {
  providerId: string
}

export type NotiStrategicSender<NotiParams> = (
  params: NotiParams,
) => Promise<NotiStrategicSenderResponse>

export * from './fallback'
export * from './random'
