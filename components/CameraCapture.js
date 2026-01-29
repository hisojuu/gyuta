"use client"
import { useRef, useState } from 'react'
import { X } from 'lucide-react'

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [streaming, setStreaming] = useState(false)

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStreaming(true)
      }
    } catch (err) {
      alert('Failed to access camera: ' + err.message)
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const context = canvasRef.current.getContext('2d')
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    context.drawImage(videoRef.current, 0, 0)
    const imageData = canvasRef.current.toDataURL('image/jpeg')
    
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
    }
    
    onCapture(imageData)
  }

  function handleClose() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-gray-800 p-2 rounded-full"
        >
          <X size={24} />
        </button>

        {!streaming ? (
          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <p className="mb-4">Ready to capture your meal?</p>
            <button
              onClick={startCamera}
              className="py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
            >
              📷 Open Camera
            </button>
          </div>
        ) : (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <button
              onClick={capturePhoto}
              className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded font-semibold text-gray-900"
            >
              📸 Capture
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
