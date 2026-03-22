import { useTheme as useThemeCtx } from '../App'

/**
 * Re-export the theme context hook so pages/components import from one place.
 * Usage: const { isDark, toggleTheme } = useTheme()
 */
export const useTheme = useThemeCtx
