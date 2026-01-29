"use client"
import { useState } from 'react'
import Link from 'next/link'
import useStore from '../../lib/store'

export default function SettingsPage() {
  const nutritionGoals = useStore((s) => s.nutritionGoals)
  const setNutritionGoals = useStore((s) => s.setNutritionGoals)

  const [protein, setProtein] = useState(nutritionGoals.protein.toString())
  const [calories, setCalories] = useState(nutritionGoals.calories.toString())

  function handleSave() {
    const newGoals = {
      protein: parseFloat(protein) || 200,
      calories: parseFloat(calories) || 2500,
    }
    setNutritionGoals(newGoals)
    alert('Goals saved!')
  }

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-2xl mx-auto">
      <header className="mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your fitness goals</p>
      </header>

      <section className="glass-panel p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Daily Nutrition Goals</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Daily Protein (grams)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="glass-input w-full"
            />
            <p className="text-xs text-gray-500 mt-2">Recommended: 0.8-2.0g per pound of bodyweight</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Daily Calorie Goal (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="glass-input w-full"
            />
            <p className="text-xs text-gray-500 mt-2">Typical range: 2000-3500 kcal depending on activity level</p>
          </div>

          <button
            onClick={handleSave}
            className="glass-button-primary w-full py-3 mt-4 font-semibold"
          >
            Save Goals
          </button>
        </div>
      </section>

      <section className="glass-panel p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-3">AI Configuration</h2>
        <div className="text-sm text-gray-300 space-y-3">
          <div className="glass-card p-3">
            <p className="font-medium text-white mb-2">Google Gemini API</p>
            <p className="text-xs text-gray-400">
              Add <code className="bg-black/50 px-2 py-1 rounded">NEXT_PUBLIC_GEMINI_API_KEY</code> to{' '}
              <code className="bg-black/50 px-2 py-1 rounded">.env.local</code> to enable AI meal analysis.
            </p>
          </div>
          <div className="glass-card p-3">
            <p className="font-medium text-white mb-2">OpenFoodFacts API</p>
            <p className="text-xs text-gray-400">
              Barcode scanning uses the free OpenFoodFacts API. No configuration needed.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-lg font-bold text-white mb-3">About</h2>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>GymTrackerAI</strong> • Version 0.2.0</p>
          <p className="text-gray-400">
            A minimalist fitness & nutrition tracker with AI-powered meal analysis and barcode scanning.
          </p>
          <p className="text-gray-400">
            Built with Next.js, Zustand, and Google Gemini AI.
          </p>
        </div>
      </section>
    </main>
  )
}
