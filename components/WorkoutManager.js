"use client"
import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import useStore from '../lib/store'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function WorkoutManager() {
  const workouts = useStore((s) => s.workouts)
  const addExercise = useStore((s) => s.addExercise)
  const removeExercise = useStore((s) => s.removeExercise)

  const [expandedDay, setExpandedDay] = useState('Monday')
  const [newExercise, setNewExercise] = useState({ name: '', sets: '3', reps: '10' })

  function handleAddExercise() {
    if (!newExercise.name) {
      alert('Please enter an exercise name')
      return
    }
    addExercise(expandedDay, {
      name: newExercise.name,
      sets: parseInt(newExercise.sets) || 3,
      reps: parseInt(newExercise.reps) || 10,
    })
    setNewExercise({ name: '', sets: '3', reps: '10' })
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Workout Manager</h2>
      <p className="text-sm text-gray-400 mb-6">Edit your weekly workout routine</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weekdays.map((day) => (
          <div key={day} className="glass-panel p-4">
            <button
              onClick={() => setExpandedDay(day === expandedDay ? null : day)}
              className="w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{day}</h3>
              <p className="text-xs text-gray-400">
                {(Array.isArray(workouts[day]) ? workouts[day] : []).length} exercises
              </p>
            </button>

            {expandedDay === day && (
              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                {(Array.isArray(workouts[day]) ? workouts[day] : []).map((exercise) => (
                  <div
                    key={exercise.id}
                    className="glass-card p-3 flex items-start justify-between group"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{exercise.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {exercise.sets} × {exercise.reps} reps
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(day, exercise.id)}
                      className="ml-2 p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                <div className="space-y-2 border-t border-white/10 pt-3">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    value={newExercise.name}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, name: e.target.value })
                    }
                    className="glass-input w-full text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      value={newExercise.sets}
                      onChange={(e) =>
                        setNewExercise({ ...newExercise, sets: e.target.value })
                      }
                      className="glass-input text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={newExercise.reps}
                      onChange={(e) =>
                        setNewExercise({ ...newExercise, reps: e.target.value })
                      }
                      className="glass-input text-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddExercise}
                    className="glass-button w-full text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Exercise
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
