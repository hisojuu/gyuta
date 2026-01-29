'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Scan } from 'lucide-react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function BarcodeScanner({ onScanComplete, onCancel }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [editing, setEditing] = useState(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!scanning || !scannerRef.current) return

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    scanner.render(
      async (barcode) => {
        scanner.clear()
        setScanning(false)
        fetchFoodData(barcode)
      },
      (error) => console.log('Scan error:', error)
    )

    return () => {
      try {
        scanner.clear()
      } catch (e) {}
    }
  }, [scanning])

  async function fetchFoodData(barcode) {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      )

      if (!response.ok) {
        alert('Product not found in OpenFoodFacts database')
        return
      }

      const data = await response.json()
      const product = data.product

      if (!product) {
        alert('Product not found')
        return
      }

      const nutritionData = {
        name: product.product_name || 'Unknown Product',
        calories: product.nutriments?.['energy-kcal'] || 0,
        protein: product.nutriments?.proteins || 0,
        barcode,
      }

      setResult(nutritionData)
      setEditing(nutritionData)
    } catch (err) {
      alert('Error fetching product data: ' + err.message)
    }
  }

  function handleSave() {
    if (editing) {
      onScanComplete({
        name: editing.name,
        calories: parseFloat(editing.calories) || 0,
        protein: parseFloat(editing.protein) || 0,
        source: 'barcode-scan',
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

        <h3 className="text-xl font-bold text-white mb-4">Scan Barcode</h3>

        {!result && !scanning && (
          <button
            onClick={() => setScanning(true)}
            className="glass-button-primary w-full flex items-center justify-center gap-2 py-3"
          >
            <Scan size={20} /> Start Scanning
          </button>
        )}

        {scanning && (
          <div className="space-y-4">
            <div id="qr-reader" className="rounded-lg overflow-hidden" />
            <button
              onClick={() => setScanning(false)}
              className="glass-button w-full text-sm"
            >
              Cancel Scan
            </button>
          </div>
        )}

        {result && editing && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 bg-white/5 p-2 rounded">
              Barcode: {result.barcode}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">Product Name</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="glass-input w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Calories</label>
                <input
                  type="number"
                  value={editing.calories}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
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
                  value={editing.protein}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      protein: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="glass-input w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setResult(null)
                  setEditing(null)
                  setScanning(true)
                }}
                className="flex-1 glass-button text-sm"
              >
                Rescan
              </button>
              <button onClick={handleSave} className="flex-1 glass-button-primary text-sm">
                Save Meal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
