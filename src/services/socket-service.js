import { Manager } from 'socket.io-client'
import { SERVICES_DNS, MODE } from '../config'

class SocketService {
  constructor() {
    const pathService =
      MODE === 'development'
        ? 'http://localhost:1515'
        : `${SERVICES_DNS}/socket.io`
    this.manager = new Manager(pathService)
    this.initSocket()
  }

  initSocket(accessToken) {
    this.socket = this.manager.socket('/', {
      auth: {
        token: accessToken,
      },
    })
  }

  getSocket() {
    return this.socket
  }
}

export const socketService = new SocketService()
export default socketService
