import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultWorkouts = {
  Monday: [
    { id: 1, name: 'Bench Press', sets: 4, reps: 8 },
    { id: 2, name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
  ],
  Tuesday: [
    { id: 1, name: 'Deadlifts', sets: 3, reps: 5 },
    { id: 2, name: 'Barbell Rows', sets: 4, reps: 8 },
  ],
  Wednesday: [
    { id: 1, name: 'Leg Press', sets: 4, reps: 10 },
    { id: 2, name: 'Leg Curls', sets: 3, reps: 12 },
  ],
  Thursday: [
    { id: 1, name: 'Military Press', sets: 4, reps: 8 },
    { id: 2, name: 'Lateral Raises', sets: 3, reps: 12 },
  ],
  Friday: [
    { id: 1, name: 'Squats', sets: 4, reps: 6 },
    { id: 2, name: 'Front Squats', sets: 3, reps: 8 },
  ],
  Saturday: [
    { id: 1, name: 'Pull-ups', sets: 4, reps: 8 },
    { id: 2, name: 'Lat Pulldowns', sets: 3, reps: 10 },
  ],
  Sunday: [],
}

const useStore = create(
  persist(
    (set) => ({
      workouts: defaultWorkouts,
      setWorkoutDay: (day, exercises) => set((s) => ({ workouts: { ...s.workouts, [day]: exercises } })),
      addExercise: (day, exercise) => set((s) => {
        const dayExercises = s.workouts[day] || []
        const maxId = dayExercises.length > 0 ? Math.max(...dayExercises.map((e) => e.id)) : 0
        return {
          workouts: {
            ...s.workouts,
            [day]: [...dayExercises, { ...exercise, id: maxId + 1 }],
          },
        }
      }),
      removeExercise: (day, exerciseId) => set((s) => ({
        workouts: {
          ...s.workouts,
          [day]: (s.workouts[day] || []).filter((e) => e.id !== exerciseId),
        },
      })),

      completions: {},
      toggleCompletion: (dateKey) => set((s) => {
        const next = { ...s.completions }
        if (next[dateKey]) delete next[dateKey]
        else next[dateKey] = true
        return { completions: next }
      }),

      nutritionGoals: { protein: 200, calories: 2500 },
      setNutritionGoals: (goals) => set(() => ({ nutritionGoals: goals })),

      nutritionEntries: {},
      addNutritionEntry: (entry) => set((s) => {
        const dateKey = entry.date
        const existing = s.nutritionEntries[dateKey] || []
        return {
          nutritionEntries: {
            ...s.nutritionEntries,
            [dateKey]: [...existing, entry],
          },
        }
      }),
    }),
    { name: 'gymtrackerai-storage' }
  )
)

export default useStore
