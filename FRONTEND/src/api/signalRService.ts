// src/api/signalRService.ts
import * as signalR from '@microsoft/signalr'

// Đọc URL từ .env
const HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL

let connection: signalR.HubConnection | null = null

const signalRService = {

  // Kết nối tới Hub — gọi sau khi login thành công
  connect: async (onNotification: (message: string) => void) => {
    const token = localStorage.getItem('token')
    if (!token) return

    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    // Lắng nghe sự kiện "ReceiveNotification" từ backend
    connection.on('ReceiveNotification', (message: string) => {
      onNotification(message)
    })

    try {
      await connection.start()
      console.log('SignalR connected')
    } catch (err) {
      console.error('SignalR connection error:', err)
    }
  },

  // Ngắt kết nối khi logout
  disconnect: async () => {
    if (connection) {
      await connection.stop()
      connection = null
    }
  },

  isConnected: (): boolean => {
    return connection?.state === signalR.HubConnectionState.Connected
  },
}

export default signalRService