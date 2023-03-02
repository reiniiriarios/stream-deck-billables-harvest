import { ACTIONS } from './const'
import { updateStatus } from './update-status'

let ws: WebSocket | null = null

const connectElgatoStreamDeckSocket = (
  inPort: number,
  inPluginUUID: string,
  inRegisterEvent: any,
  inInfo: any
) => {
  ws = new WebSocket(`ws://127.0.0.1:${inPort}`)
  ws.addEventListener('open', () => {
    console.log({
      event: inRegisterEvent,
      uuid: inPluginUUID,
    })
    ws?.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inPluginUUID,
      })
    )
  })

  ws.addEventListener('close', (event: CloseEvent) => {
    console.log('WEBSOCKET CLOSED', event)
  })

  ws.addEventListener('error', (event: Event) => {
    console.warn('WEBSOCKET ERROR', event)
  })

  ws.addEventListener('message', async (event: MessageEvent<any>) => {
    const eventData = JSON.parse(event.data)
    console.log(eventData)
    switch (eventData.event) {
      case 'keyDown':
        switch (eventData.action) {
          case ACTIONS.UPDATE_STATUS:
            await updateStatus(eventData.payload?.settings)
            break
        }
        break
    }
  })
}

;(window as any)['connectElgatoStreamDeckSocket'] = connectElgatoStreamDeckSocket
