"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import useStore from '../lib/store'

const CameraCapture = dynamic(() => import('../components/CameraCapture'), { ssr: false })
const AIReview = dynamic(() => import('../components/AIReview'), { ssr: false })

function formatDateKey(d) {
  return d.toISOString().slice(0, 10)
}

export default function NutritionAI() {
  const addNutritionEntry = useStore((s) => s.addNutritionEntry)
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [aiResult, setAIResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false)

  async function handleCapture(imageData) {
    setCapturedImage(imageData)
    setShowCamera(false)

    const savedKey = localStorage.getItem('google-api-key')
    if (!savedKey) {
      setShowApiKeyPrompt(true)
      return
    }

    await analyzeImage(imageData, savedKey)
  }

  async function analyzeImage(imageData, key) {
    setIsAnalyzing(true)
    try {
      const base64Image = imageData.split(',')[1]
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64Image },
                features: [
                  { type: 'LABEL_DETECTION', maxResults: 10 },
                  { type: 'TEXT_DETECTION' },
                ],
              },
            ],
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'API Error')
      }

      const data = await response.json()
      const labels = data.responses[0]?.labelAnnotations || []
      const labelText = labels.map((l) => l.description).join(', ')

      // Parse nutrition estimate from labels (basic heuristic)
      const estimatedNutrition = parseNutritionEstimate(labelText)

      setAIResult({
        name: labelText || 'Unrecognized Meal',
        calories: estimatedNutrition.calories,
        protein: estimatedNutrition.protein,
      })
    } catch (err) {
      alert('Error analyzing image: ' + err.message)
      setCapturedImage(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function parseNutritionEstimate(labels) {
    // Simple heuristic: common food types
    const lower = labels.toLowerCase()

    let calories = 400
    let protein = 20

    if (lower.includes('chicken')) {
      calories = 350
      protein = 40
    } else if (lower.includes('fish') || lower.includes('salmon')) {
      calories = 400
      protein = 45
    } else if (lower.includes('beef')) {
      calories = 450
      protein = 50
    } else if (lower.includes('salad')) {
      calories = 150
      protein = 10
    } else if (lower.includes('rice')) {
      calories = 300
      protein = 8
    } else if (lower.includes('pasta')) {
      calories = 400
      protein = 15
    } else if (lower.includes('protein')) {
      protein = 45
    }

    return { calories, protein }
  }

  function handleSaveWithKey() {
    if (!apiKey) {
      alert('Please enter your Google API Key')
      return
    }
    localStorage.setItem('google-api-key', apiKey)
    setShowApiKeyPrompt(false)
    analyzeImage(capturedImage, apiKey)
  }

  function handleConfirmEntry(entry) {
    addNutritionEntry({
      ...entry,
      date: formatDateKey(new Date()),
    })
    setCapturedImage(null)
    setAIResult(null)
    alert('Nutrition entry saved!')
  }

  return (
    <main className="p-4 max-w-3xl mx-auto pb-10">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Nutrition Scanner</h1>
        <nav className="space-x-3">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/nutrition" className="text-sm text-gray-300 hover:text-white">
            Log
          </Link>
        </nav>
      </header>

      <section className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="font-semibold text-lg mb-3">📷 Take a Photo</h2>
        <button
          onClick={() => setShowCamera(true)}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-lg font-semibold text-lg"
        >
          Open Camera & Analyze
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Point your camera at your meal. AI will estimate nutrition content.
        </p>
      </section>

      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="font-semibold text-lg mb-3">Google API Key Required</h3>
            <p className="text-sm text-gray-300 mb-4">
              To use AI image analysis, you need a Google Cloud Vision API key.
              <a
                href="https://cloud.google.com/vision/docs/setup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 ml-1 underline"
              >
                Get one here
              </a>
            </p>
            <input
              type="password"
              placeholder="Paste your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-900 text-white p-2 rounded border border-gray-700 mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowApiKeyPrompt(false)
                  setCapturedImage(null)
                }}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWithKey}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-gray-900"
              >
                Save & Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {capturedImage && !showApiKeyPrompt && (
        <AIReview
          imageData={capturedImage}
          aiResult={aiResult}
          isLoading={isAnalyzing}
          onConfirm={handleConfirmEntry}
          onCancel={() => {
            setCapturedImage(null)
            setAIResult(null)
          }}
        />
      )}

      <section className="bg-gray-800 p-4 rounded-lg">
        <h2 className="font-semibold text-lg mb-3">How It Works</h2>
        <div className="text-sm text-gray-300 space-y-2">
          <p>1. 📷 Take a photo of your meal</p>
          <p>2. 🤖 AI analyzes the image and detects food items</p>
          <p>3. ✏️ Review and adjust estimated calories & protein</p>
          <p>4. 💾 Save to your daily nutrition log</p>
        </div>
      </section>
    </main>
  )
}
