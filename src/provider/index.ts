export interface NotiProviderSenderResponse {
  id: string
}

export type NotiProviderSender<NotiParams> = (
  params: NotiParams,
) => Promise<NotiProviderSenderResponse>

export interface NotiProvider<NotiParams> {
  id: string
  send: NotiProviderSender<NotiParams>
}
