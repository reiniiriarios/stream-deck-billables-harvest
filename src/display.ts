/// <reference path="libs/js/stream-deck.js" />

/**
 * Get the hours formatted for display.
 *
 * @param {number} hours
 * @returns {string} formatted hours
 */
const formatHours = (hours: number): string => {
  // Display hours as a value of how far a user has to go.
  // -2h = 2 hours remaining to work
  // 2h = 2 hours over
  hours = hours * -1;
  if (Math.abs(hours) < 1) return (hours >= 0 ? '+' : '') + Math.round(hours * 60) + 'm';
  return (hours >= 0 ? '+' : '') + hours.toFixed(2) + 'h';
};

/**
 * Get a timer's hours formatted for display.
 *
 * @param {number} hours
 * @returns {string} formatted hours
 */
const formatTimer = (hours: number): string => {
  if (hours < 1) return Math.round(hours * 60) + 'm';
  return hours.toFixed(2) + 'h';
};

/**
 * The icon svg data.
 *
 * Easy editor: https://yqnn.github.io/svg-path-editor/
 */
const ICONS = {
  continue: {
    path: 'M 38 18 C 38 13 47 13 47 18 v 64 C 47 87 38 87 38 82 V 20 z m 31 -3 C 66 13 62 14 62 19 v 62 c 0 5 4 5 7 3 l 44 -30 C 116 52 116 48 113 46 l -44 -31 z M 102 50 l -31 22 V 28 L 102 50 z',
    color: '#0e74e8',
  },
  stop: {
    path: 'M 53 12 H 60 a 4 4 90 0 1 4 4 V 77 a 4 4 90 0 1 -4 4 H 53 a 4 4 90 0 1 -4 -4 V 16 A 4 4 90 0 1 53 12 Z m 31 69 h 7 a 4 4 90 0 0 4 -4 V 16 a 4 4 90 0 0 -4 -4 H 84 a 4 4 90 0 0 -4 4 V 77 A 4 4 90 0 0 84 81 Z',
    color: '#fa5c00',
  },
  stopReally: {
    path: 'M 44 58 a 7 7 90 0 0 7 7 h 41 a 7 7 90 0 0 7 -7 V 16 a 7 7 90 0 0 -7 -7 H 51 a 7 7 90 0 0 -7 7 v 41 z',
    color: '#e02222',
  },
  success: {
    path: 'M 114 19 L 65 68 L 39 42 L 31 50 l 34 34 l 57 -57 z',
    color: '#0cc952',
  },
  timerRunning: {
    path: 'M 60.4 39 C 58 37.4 54.8 38.2 54.8 42.2 v 49.6 c 0 4 3.2 4 5.6 2.4 l 35.2 -24 C 98 68.6 98 65.4 95.6 63.8 l -35.2 -24.8 z M 86.8 67 l -24.8 17.6 V 49.4 L 86.8 67 z',
    color: '#fa5c00',
  },
  timerStopped: {
    path: 'M 57.58 40.52 H 62.9 a 3.04 3.04 90 0 1 3.04 3.04 V 89.92 a 3.04 3.04 90 0 1 -3.04 3.04 H 57.58 a 3.04 3.04 90 0 1 -3.04 -3.04 V 43.56 A 3.04 3.04 90 0 1 57.58 40.52 Z m 23.56 52.44 h 5.32 a 3.04 3.04 90 0 0 3.04 -3.04 V 43.56 a 3.04 3.04 90 0 0 -3.04 -3.04 H 81.14 a 3.04 3.04 90 0 0 -3.04 3.04 V 89.92 A 3.04 3.04 90 0 0 81.14 92.96 Z',
    color: '#575757',
  },
};

/**
 * Get the icon to display based on hours remaining.
 *
 * @param {number} hours
 * @returns {{ path: string; color: string }} icon data
 */
const getStatusIcon = (hours: number): { path: string; color: string } => {
  if (hours < 0.5) {
    return ICONS.stopReally;
  }
  if (hours < 0.25) {
    return ICONS.stop;
  }
  if (hours > 0.25) {
    return ICONS.continue;
  }
  return ICONS.success;
};

const CANVAS_SIZE = 144;
const TEXT_COLOR = '#fff';
const FONT_SIZE = 32;

/**
 * Display the hours remaining.
 *
 * @param {string} context
 * @param {number} hoursRemaining
 * @param {number} assignedHours
 */
export const displayHoursRemaining = (
  context: string,
  hoursRemaining: number,
  assignedHours: number
): void => {
  // Canvas
  let canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Icon
  if (!assignedHours) {
    // @todo draw something else?
  }
  else {
    let percentageRemaining = assignedHours - hoursRemaining / assignedHours;
    // check success with an error margin
    if (percentageRemaining <= 0.01 && percentageRemaining >= -0.01) {
      // @todo draw checkbox
    }
    else {
      // draw pie chart
      let workedHours: number;
      let filledColor: string, emptyColor: string;
      if (hoursRemaining < 0) {
        // overage, we worked too long today
        filledColor = '#f00';
        emptyColor = '#fa5c00';
        // hours worked should display as the amount over we are
        workedHours = hoursRemaining * -1;
      }
      else {
        // under, there are hours remaining to be worked
        filledColor = '#fa5c00';
        emptyColor = '#333';
        workedHours = assignedHours - hoursRemaining;
      }
      const centerX = CANVAS_SIZE * 0.5;
      const centerY = CANVAS_SIZE * 0.35;
      const radius = CANVAS_SIZE * 0.3;
      const startAngle = Math.PI * -0.5; // radians
      const offset = radius * 0.175;
      // draw slice of hours fulfilled
      const workedHoursAngle = (workedHours / assignedHours) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + workedHoursAngle, false);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = filledColor;
      ctx.fill();
      // draw the rest empty
      const remainingAngle = ((assignedHours - workedHours) / assignedHours) * 2 * Math.PI;
      const endAngle = startAngle + workedHoursAngle + remainingAngle;
      const angleCenter = (startAngle + workedHoursAngle + endAngle) * 0.5;
      const offsetX = Math.cos(angleCenter) * offset;
      const offsetY = Math.sin(angleCenter) * offset;
      ctx.beginPath();
      ctx.moveTo(centerX + offsetX, centerY + offsetY);
      ctx.arc(centerX + offsetX, centerY + offsetY, radius * 0.75, startAngle + workedHoursAngle, endAngle, false);
      ctx.lineTo(centerX + offsetX, centerY + offsetY);
      ctx.fillStyle = emptyColor;
      ctx.fill();
    }
  }

  // Text
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${FONT_SIZE}px Helvetica, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatHours(hoursRemaining), CANVAS_SIZE * 0.5, CANVAS_SIZE * 0.85);

  const finalImage = canvas.toDataURL('image/png');
  $SD.setImage(context, finalImage);
};

/**
 * Display a timer's status.
 *
 * @param {string} context
 * @param {boolean} is_running
 * @param {number} time
 */
export const displayTimerStatus = (context: string, is_running: boolean, time: number): void => {
  // Canvas
  let canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Icon
  const icon = is_running ? ICONS.timerRunning : ICONS.timerStopped;
  const path = new Path2D(icon.path);
  ctx.fillStyle = icon.color;
  ctx.fill(path);

  // Text
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${FONT_SIZE}px Helvetica, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatTimer(time), CANVAS_SIZE * 0.5, CANVAS_SIZE * 0.85);

  const finalImage = canvas.toDataURL('image/png');
  $SD.setImage(context, finalImage);
};
