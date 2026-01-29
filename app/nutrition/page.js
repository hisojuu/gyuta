"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Scan } from 'lucide-react'
import dynamic from 'next/dynamic'
import useStore from '../../lib/store'

const GeminiMealAnalyzer = dynamic(() => import('../../components/GeminiMealAnalyzer'), { ssr: false })
const BarcodeScanner = dynamic(() => import('../../components/BarcodeScanner'), { ssr: false })

function formatDateKey(d) {
  return d.toISOString().slice(0, 10)
}

export default function NutritionPage() {
  const addNutritionEntry = useStore((s) => s.addNutritionEntry)
  const entries = useStore((s) => s.nutritionEntries)
  const nutritionGoals = useStore((s) => s.nutritionGoals)

  const [todayKey, setTodayKey] = useState(formatDateKey(new Date()))
  const [showGemini, setShowGemini] = useState(false)
  const [showBarcode, setShowBarcode] = useState(false)
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTodayKey(formatDateKey(new Date()))
    setMounted(true)
  }, [])

  function handleAddManual() {
    if (!name || !calories || !protein) {
      alert('Please fill in all fields')
      return
    }
    addNutritionEntry({
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      date: todayKey,
      source: 'manual',
    })
    setName('')
    setCalories('')
    setProtein('')
  }

  function handleGeminiResult(result) {
    addNutritionEntry({
      ...result,
      date: todayKey,
    })
    setShowGemini(false)
    alert('Meal added successfully!')
  }

  function handleBarcodeResult(result) {
    addNutritionEntry({
      ...result,
      date: todayKey,
    })
    setShowBarcode(false)
    alert('Product added successfully!')
  }

  const todayEntries = entries[todayKey] || []
  const totalProtein = todayEntries.reduce((sum, e) => sum + e.protein, 0)
  const totalCalories = todayEntries.reduce((sum, e) => sum + e.calories, 0)

  const proteinPercent = Math.min(100, Math.round((totalProtein / (nutritionGoals.protein || 200)) * 100))
  const caloriesPercent = Math.min(100, Math.round((totalCalories / (nutritionGoals.calories || 2500)) * 100))

  if (!mounted) return null

  return (
    <main className="min-h-screen p-4 md:p-6 max-w-2xl mx-auto">
      <header className="mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold text-white mb-2">Nutrition Tracker</h1>
        <p className="text-gray-400">Log your daily meals and track macros</p>
      </header>

      <section className="glass-panel p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Daily Progress</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Protein</span>
              <span className="text-gray-400">{totalProtein}g / {nutritionGoals.protein}g</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${proteinPercent}%` }}
                className="h-full bg-white/50 rounded-full transition-all"
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
                className="h-full bg-white/40 rounded-full transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Add</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Meal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input w-full"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="glass-input"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="glass-input"
            />
          </div>

          <button
            onClick={handleAddManual}
            className="glass-button w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Meal
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setShowGemini(true)}
          className="glass-panel hover:bg-white/20 transition-all p-4 text-center"
        >
          <div className="text-2xl mb-2">📷</div>
          <h3 className="font-semibold text-white mb-1">AI Analyzer</h3>
          <p className="text-xs text-gray-400">Photo → Nutrition</p>
        </button>

        <button
          onClick={() => setShowBarcode(true)}
          className="glass-panel hover:bg-white/20 transition-all p-4 text-center"
        >
          <div className="text-2xl mb-2">📱</div>
          <h3 className="font-semibold text-white mb-1">Barcode</h3>
          <p className="text-xs text-gray-400">Scan → Lookup</p>
        </button>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-lg font-bold text-white mb-4">Today's Meals</h2>
        {todayEntries.length === 0 ? (
          <p className="text-sm text-gray-400">No meals logged yet</p>
        ) : (
          <div className="space-y-2">
            {todayEntries.map((entry, idx) => (
              <div key={idx} className="glass-card p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{entry.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{entry.source}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-white">{entry.calories} kcal</p>
                    <p className="text-gray-400">{entry.protein}g protein</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showGemini && (
        <GeminiMealAnalyzer
          onAnalysisComplete={handleGeminiResult}
          onCancel={() => setShowGemini(false)}
        />
      )}

      {showBarcode && (
        <BarcodeScanner
          onScanComplete={handleBarcodeResult}
          onCancel={() => setShowBarcode(false)}
        />
      )}
    </main>
  )
}

