import { useState, useCallback } from 'react'

/**
 * Persist state in localStorage with JSON serialisation.
 *
 * @param {string} key       – localStorage key
 * @param {*}      initial   – value used when key is absent
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage(key, initial) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch {
      return initial
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const next = value instanceof Function ? value(storedValue) : value
        setStoredValue(next)
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch (err) {
        console.error(`useLocalStorage[${key}] set error:`, err)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initial)
    } catch (err) {
      console.error(`useLocalStorage[${key}] remove error:`, err)
    }
  }, [key, initial])

  return [storedValue, setValue, removeValue]
}
