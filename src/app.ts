import { ACTIONS } from './const'
import updateStatus from './update-status'

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

  ws.addEventListener('message', async (e) => {
    const data = JSON.parse(e.data)
    const { event, payload, action } = data
    console.table(payload?.settings)
    switch (event) {
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
