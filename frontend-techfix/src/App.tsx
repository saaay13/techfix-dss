import { useEffect, useState } from 'react'
import { ping } from './services/api'

function App() {
  const [status, setStatus] = useState('Verificando conexión...')

  useEffect(() => {
    ping()
      .then(data => setStatus(JSON.stringify(data, null, 2)))
      .catch(() => setStatus('Error de conexión con el backend'))
  }, [])

  return <pre>{status}</pre>
}

export default App
