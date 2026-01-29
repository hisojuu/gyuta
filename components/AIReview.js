"use client"
import { useState } from 'react'
import { X } from 'lucide-react'

export default function AIReview({ imageData, onConfirm, onCancel, isLoading, aiResult }) {
  const [name, setName] = useState(aiResult?.name || '')
  const [calories, setCalories] = useState(aiResult?.calories || '')
  const [protein, setProtein] = useState(aiResult?.protein || '')

  function handleConfirm() {
    if (!name || !calories || !protein) {
      alert('Please fill in all fields')
      return
    }
    onConfirm({
      name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      source: 'ai-camera',
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Review & Adjust</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {imageData && (
          <img
            src={imageData}
            alt="Captured meal"
            className="w-full rounded-lg mb-4"
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            <p className="ml-2 text-gray-300">Analyzing image...</p>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Meal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900 text-white p-2 rounded border border-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-gray-900 text-white p-2 rounded border border-gray-700"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-gray-900 text-white p-2 rounded border border-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-gray-900"
              >
                Save Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
