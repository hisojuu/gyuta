"use client"
import Link from 'next/link'
import dynamic from 'next/dynamic'

const WorkoutManager = dynamic(() => import('../../components/WorkoutManager'), { ssr: false })

export default function WorkoutsPage() {
  return (
    <main className="min-h-screen p-4 md:p-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Workout Manager</h1>
        <p className="text-gray-400">Design your weekly training routine</p>
      </header>

      <WorkoutManager />
    </main>
  )
}
