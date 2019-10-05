export type NotiProviderSenderResponse = {
  id: string
}

export type NotiProviderSender<NotiParams> = (
  params: NotiParams
) => Promise<NotiProviderSenderResponse>

export type NotiProvider<NotiParams> = {
  id: string
  send: NotiProviderSender<NotiParams>
}
