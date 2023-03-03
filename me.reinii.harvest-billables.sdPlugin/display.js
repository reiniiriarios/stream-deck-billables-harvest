/**
 * Get the hours formatted for display.
 */
const formatHours = (hours) => {
  return (hours >= 0 ? '+' : '') + hours.toFixed(2);
};

/**
 * Get the icon to display based on hours.
 */
const getStatusIcon = (hours) => {
  if (hours >= 0.5) {
    return 'stop-really';
  }
  if (hours >= 0.25) {
    return 'stop';
  }
  if (hours <= 0.25) {
    return 'continue';
  }
  return 'success';
};

/**
 * Display the hours remaining.
 */
const displayHoursRemaining = (hours) => {
  const hoursFormatted = formatHours(hours);
  const icon = getStatusIcon(hours);

  console.log(hoursFormatted, icon);
};
