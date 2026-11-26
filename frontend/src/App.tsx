import { useQuery } from '@tanstack/react-query'
import { Route, Routes } from 'react-router'
import { apiFetch } from './lib/api.ts'

function Home() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<{ ok: boolean }>('/api/health'),
  })

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-3xl font-bold">Bowlathon</h1>
      <p className="mt-2 text-sm text-gray-600">
        API: {health.isPending ? 'checking…' : health.isError ? 'unreachable' : 'ok'}
      </p>
    </main>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
