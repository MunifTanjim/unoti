type NotiProvider<T> = import('../provider').NotiProvider<T>
type NotiProviderSenderResponse = import('../provider').NotiProviderSenderResponse

export type NotiStrategy<NotiParams> = (
  providers: Array<NotiProvider<NotiParams>>
) => NotiStrategicSender<NotiParams>

export type NotiStrategicSenderResponse = NotiProviderSenderResponse & {
  providerId: string
}

export type NotiStrategicSender<NotiParams> = (
  params: NotiParams
) => Promise<NotiStrategicSenderResponse>

export * from './fallback'
export * from './random'
