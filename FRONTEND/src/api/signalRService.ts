// src/api/signalRService.ts
import * as signalR from '@microsoft/signalr'

// =============================================
// SIGNALR SERVICE — nhận thông báo real-time
// Cài package: npm install @microsoft/signalr
// =============================================

let connection: signalR.HubConnection | null = null

const signalRService = {

  // Kết nối tới Hub thông báo của backend
  connect: async (onNotification: (message: string) => void) => {
    const token = localStorage.getItem('token')
    if (!token) return

    connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/hubs/notifications', {
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
      console.log('SignalR disconnected')
    }
  },

  // Trạng thái kết nối
  isConnected: (): boolean => {
    return connection?.state === signalR.HubConnectionState.Connected
  },
}

export default signalRService