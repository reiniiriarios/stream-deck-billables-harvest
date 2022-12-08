/**
 * Get the hours formatted for display.
 *
 * @param {number} hours
 * @returns {string} formatted hours
 */
 export const formatHours = (hours: number): string => {
  return (hours >= 0 ? '+' : '') + hours.toFixed(2)
}

/**
 * Get the icon to display based on hours.
 *
 * @param {number} hours
 * @returns {string} icon name
 */
export const getStatusIcon = (hours: number): string => {
  if (hours >= 0.5) {
    return 'stop-really'
  }
  if (hours >= 0.25) {
    return 'stop'
  }
  if (hours <= 0.25) {
    return 'continue'
  }
  return 'success'
}

/**
 * Display the hours remaining.
 *
 * @param {number} hours
 */
export const displayHoursRemaining = (hours: number): void => {
  const hoursFormatted: string = formatHours(hours)
  const icon = getStatusIcon(hours)

  console.log(hoursFormatted, icon)
}
