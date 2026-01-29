
'use client'
import { useState } from 'react'
import { Camera, Upload, X } from 'lucide-react'

export default function GeminiMealAnalyzer({ onAnalysisComplete, onCancel }) {
  const [imageData, setImageData] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [editedResult, setEditedResult] = useState(null)

  async function analyzeImage(base64Image) {
    setAnalyzing(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        alert('Gemini API key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local')
        setAnalyzing(false)
        return
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Analyze this food image and return ONLY a valid JSON object with these exact fields: food_name (string), calories (number, estimated total), protein_g (number). Return ONLY the JSON, no other text.',
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: base64Image.split(',')[1],
                    },
                  },
                ],
              },
            ],
          }),
        }
      )

      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(`API Error: ${data.error?.message || response.statusText || 'Unknown error'}`)
      }

      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      if (!responseText) {
        throw new Error('No response from AI. Try a clearer food image.')
      }

      // Parse JSON from response
      let parsed = null
      try {
        parsed = JSON.parse(responseText)
      } catch (e) {
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0])
        }
      }

      if (parsed && parsed.food_name) {
        setResult({
          food_name: parsed.food_name,
          calories: parsed.calories || 0,
          protein_g: parsed.protein_g || 0,
        })
        setEditedResult({
          food_name: parsed.food_name,
          calories: parsed.calories || 0,
          protein_g: parsed.protein_g || 0,
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      alert('Error analyzing image: ' + err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleCapture(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setImageData(base64)
      analyzeImage(base64)
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (editedResult) {
      onAnalysisComplete({
        name: editedResult.food_name,
        calories: parseFloat(editedResult.calories) || 0,
        protein: parseFloat(editedResult.protein_g) || 0,
        source: 'gemini-ai',
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4">Analyze Your Meal</h3>

        {!imageData ? (
          <div className="space-y-3">
            <label className="block glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors text-center">
              <Camera className="w-8 h-8 text-white mx-auto mb-2" />
              <span className="text-white font-medium">Take Photo</span>
              <input type="file" accept="image/*" onChange={handleCapture} className="hidden" capture />
            </label>

            <label className="block glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors text-center">
              <Upload className="w-8 h-8 text-white mx-auto mb-2" />
              <span className="text-white font-medium">Upload Image</span>
              <input type="file" accept="image/*" onChange={handleCapture} className="hidden" />
            </label>
          </div>
        ) : analyzing ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Analyzing your meal...</p>
          </div>
        ) : result && editedResult ? (
          <div className="space-y-4">
            {imageData && (
              <img
                src={imageData}
                alt="Meal preview"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-2">Food Name</label>
              <input
                type="text"
                value={editedResult.food_name}
                onChange={(e) =>
                  setEditedResult({ ...editedResult, food_name: e.target.value })
                }
                className="glass-input w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Calories</label>
                <input
                  type="number"
                  value={editedResult.calories}
                  onChange={(e) =>
                    setEditedResult({
                      ...editedResult,
                      calories: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="glass-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={editedResult.protein_g}
                  onChange={(e) =>
                    setEditedResult({
                      ...editedResult,
                      protein_g: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setImageData(null)
                  setResult(null)
                  setEditedResult(null)
                }}
                className="flex-1 glass-button text-sm"
              >
                Retake
              </button>
              <button onClick={handleSave} className="flex-1 glass-button-primary text-sm">
                Save Meal
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
