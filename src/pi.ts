import { Settings } from './types'

export let ws: WebSocket | null = null
let uuid: string
let settings: Settings

const connectElgatoStreamDeckSocket = (
  inPort: number,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any,
  inActionInfo: string
) => {
  const actionInfo = JSON.parse(inActionInfo)
  uuid = inPluginUUID
  settings = actionInfo.payload.settings
  console.log(settings)
  ws = new WebSocket(`ws://127.0.0.1:${inPort}`)
  ws.addEventListener('open', () => {
    console.log({
      event: inRegisterEvent,
      uuid: inPluginUUID,
    })
    if (ws == null) return
    ws.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inPluginUUID,
      })
    )
    ws.send(
      JSON.stringify({
        event: 'getSettings',
        context: inPluginUUID,
      })
    )
  })

  piSetup()
}

ws.addEventListener('close', (event: CloseEvent) => {
  console.log('WEBSOCKET CLOSED', event)
})

ws.addEventListener('error', (event: Event) => {
  console.warn('WEBSOCKET ERROR', event)
})

ws.addEventListener('message', (event: MessageEvent<any>) => {
  const { eventName, payload } = JSON.parse(event.data)

  switch (eventName) {
    case 'didReceiveGlobalSettings':
      settings = payload.settings
      break
  }
})

const piSetup = () => {
  const harvestAccountToken = document.querySelector<HTMLInputElement>('#harvest-account-token')
  const harvestAccountId = document.querySelector<HTMLInputElement>('#harvest-account-id')
  const forecastAccountId = document.querySelector<HTMLInputElement>('#forecast-account-id')
  const howtoButton = document.querySelector<HTMLButtonElement>('#howto-button')

  const updateSettings = (value: string, key: string): void => {
    if (ws == null) return
    settings = {
      harvestAccountToken: harvestAccountToken?.value ?? '',
      harvestAccountId: harvestAccountId?.value ?? '',
      forecastAccountId: forecastAccountId?.value ?? '',
    }
    settings[key] = value
    console.log('updateSettings', settings)
    ws.send(
      JSON.stringify({
        event: 'setSettings',
        context: uuid,
        settings,
      })
    )
  }

  const openUrl = (url: string): void => {
    if (ws == null) return
    ws.send(
      JSON.stringify({
        event: 'openUrl',
        context: uuid,
        payload: {
          url,
        },
      })
    )
  }

  if (harvestAccountToken != null) {
    harvestAccountToken.value = settings?.harvestAccountToken ?? ''
    harvestAccountToken.addEventListener('change', (event: any) => {
      updateSettings(event.target.value, 'harvestAccountToken')
    })
  }
  if (harvestAccountId != null) {
    harvestAccountId.value = settings?.harvestAccountId ?? ''
    harvestAccountId.addEventListener('change', (event: any) => {
      updateSettings(event.target.value, 'harvestAccountId')
    })
  }
  if (forecastAccountId != null) {
    forecastAccountId.value = settings?.forecastAccountId ?? ''
    forecastAccountId.addEventListener('change', (event: any) => {
      updateSettings(event.target.value, 'harvestAccountId')
    })
  }
  if (howtoButton != null) {
    howtoButton.addEventListener('click', () => {
      openUrl('https://github.com/reiniiriarios/stream-deck-billables-harvest/#readme')
    })
  }
}
