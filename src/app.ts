import { ACTIONS } from './const'
import { updateStatus } from './update-status'

export let ws: WebSocket | null = null

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
    const data = JSON.parse(event.data)
    const { eventName, payload, action } = data
    console.table(payload?.settings)
    switch (eventName) {
      case 'keyDown':
        switch (action) {
          case ACTIONS.UPDATE_STATUS:
            await updateStatus(payload.settings)
            break
        }
        break
    }
  })
}
