import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  console.log('Index component rendering')
  return <div className='flex flex-col min-h-screen px-4'>test</div>
}
