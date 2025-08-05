import { Hero } from '@/(home)/Hero'
import { ThemeToggle } from '@/components/ThemeToggle'

function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <ThemeToggle />
      <Hero />
    </div>
  )
}

export default App
