// src/App.tsx
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes.tsx'
import { PlayerProvider } from './pages/PlayerContext.tsx';

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PlayerProvider>
  )
}

export default App
