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

  ws.addEventListener('close', (event: CloseEvent) => {
    console.log('WEBSOCKET CLOSED', event)
  })
  
  ws.addEventListener('error', (event: Event) => {
    console.warn('WEBSOCKET ERROR', event)
  })

  ws.addEventListener('message', (event: MessageEvent<any>) => {
    const eventData = JSON.parse(event.data)  
    switch (eventData.event) {
      case 'didReceiveGlobalSettings':
      case 'didReceiveSettings':
        settings = eventData.payload.settings
        break
    }
  })

  const fieldHarvestAccountToken = document.getElementById('harvest-account-token') as HTMLInputElement
  const fieldHarvestAccountId = document.getElementById('harvest-account-id') as HTMLInputElement
  const fieldForecastAccountId = document.getElementById('forecast-account-id') as HTMLInputElement
  const buttonHowTo = document.getElementById('howto-button') as HTMLInputElement

  if (fieldHarvestAccountToken != null) {
    fieldHarvestAccountToken.value = settings?.harvestAccountToken ?? ''
    fieldHarvestAccountToken.addEventListener('input', (event: any) => {
      updateSettings(event.target.value, 'harvestAccountToken')
    })
  }
  if (fieldHarvestAccountId != null) {
    fieldHarvestAccountId.value = settings?.harvestAccountId ?? ''
    fieldHarvestAccountId.addEventListener('input', (event: any) => {
      updateSettings(event.target.value, 'harvestAccountId')
    })
  }
  if (fieldForecastAccountId != null) {
    fieldForecastAccountId.value = settings?.forecastAccountId ?? ''
    fieldForecastAccountId.addEventListener('input', (event: any) => {
      updateSettings(event.target.value, 'harvestAccountId')
    })
  }
  if (buttonHowTo != null) {
    buttonHowTo.addEventListener('click', () => {
      openUrl('https://github.com/reiniiriarios/stream-deck-billables-harvest/#readme')
    })
  }

  const updateSettings = (value: string, key: string): void => {  
    if (ws == null) return
    settings = {
      harvestAccountToken: fieldHarvestAccountToken?.value ?? '',
      harvestAccountId: fieldHarvestAccountId?.value ?? '',
      forecastAccountId: fieldForecastAccountId?.value ?? '',
    }
    settings[key] = value
    ws.send(
      JSON.stringify({
        event: 'setSettings',
        context: uuid,
        payload: settings,
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
}

;(window as any)['connectElgatoStreamDeckSocket'] = connectElgatoStreamDeckSocket
