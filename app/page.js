"use client"
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Zap, Utensils, Settings } from 'lucide-react'
import useStore from '../lib/store'

const Calendar = dynamic(() => import('../components/Calendar'), { ssr: false })
const WorkoutManager = dynamic(() => import('../components/WorkoutManager'), { ssr: false })

function formatDateKey(d) {
  return d.toISOString().slice(0, 10)
}

export default function Home() {
  const workouts = useStore((s) => s.workouts)
  const completions = useStore((s) => s.completions)
  const toggleCompletion = useStore((s) => s.toggleCompletion)
  const nutritionEntries = useStore((s) => s.nutritionEntries)
  const nutritionGoals = useStore((s) => s.nutritionGoals)

  const [todayKey, setTodayKey] = useState(formatDateKey(new Date()))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTodayKey(formatDateKey(new Date()))
    setMounted(true)
  }, [])

  const weekdayNames = useMemo(() => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], [])
  const todayName = weekdayNames[new Date().getDay()]
  const rawWorkouts = workouts[todayName]
  // Handle both old (string) and new (array) formats
  const todayExercises = Array.isArray(rawWorkouts) ? rawWorkouts : []

  const todayEntries = nutritionEntries[todayKey] || []
  const totalProtein = todayEntries.reduce((sum, e) => sum + e.protein, 0)
  const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0)

  const proteinPercent = Math.min(100, Math.round((totalProtein / (nutritionGoals.protein || 200)) * 100))
  const caloriesPercent = Math.min(100, Math.round((totalCalories / (nutritionGoals.calories || 2500)) * 100))

  if (!mounted) return null

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">GymTrackerAI</h1>
        <p className="text-gray-400">Your minimalist fitness companion</p>
        <nav className="flex gap-4 mt-4">
          <Link href="/workouts" className="text-sm text-gray-400 hover:text-white transition-colors">
            Workouts
          </Link>
          <Link href="/nutrition" className="text-sm text-gray-400 hover:text-white transition-colors">
            Nutrition
          </Link>
          <Link href="/settings" className="text-sm text-gray-400 hover:text-white transition-colors">
            Settings
          </Link>
        </nav>
      </header>

      <section className="mb-6">
        <Calendar completions={completions} />
      </section>

      <section className="glass-panel p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">Today's Workout</h2>
        </div>

        {todayExercises.length === 0 ? (
          <p className="text-gray-400 text-sm">No exercises scheduled for today. Rest day!</p>
        ) : (
          <div className="space-y-2 mb-4">
            {todayExercises.map((exercise) => (
              <div key={exercise.id} className="glass-card p-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{exercise.name}</span>
                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                    {exercise.sets} × {exercise.reps}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => toggleCompletion(todayKey)}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            completions && completions[todayKey]
              ? 'glass-button-primary bg-white/40 text-white'
              : 'glass-button-primary'
          }`}
        >
          {completions && completions[todayKey] ? '✓ Day Completed' : 'Complete Day'}
        </button>
      </section>

      <section className="glass-panel p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">Daily Nutrition</h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Protein</span>
              <span className="text-gray-400">{totalProtein}g / {nutritionGoals.protein}g</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${proteinPercent}%` }}
                className="h-full bg-white/50 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Calories</span>
              <span className="text-gray-400">{totalCalories} kcal / {nutritionGoals.calories} kcal</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${caloriesPercent}%` }}
                className="h-full bg-white/40 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <Link
          href="/nutrition"
          className="glass-button w-full mt-4 text-center block"
        >
          Log Meal
        </Link>
      </section>
    </main>
  )
}
