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
 * Icon config.
 */
const CANVAS_SIZE = 144;
const TEXT_COLOR = '#fff';
const BRAND_COLOR = '#fa5c00';
const OVERAGE_COLOR = '#f00';
const EMPTY_COLOR = '#333';
const FONT_SIZE = 32;

/**
 * Icon svg data.
 *
 * Easy editor: https://yqnn.github.io/svg-path-editor/
 */
const ICONS = {
  success: {
    path: 'M 114 19 L 65 68 L 39 42 L 31 50 l 34 34 l 57 -57 z',
    color: '#0cc952',
  },
  timerRunning: {
    path: 'M 60.4 39 C 58 37.4 54.8 38.2 54.8 42.2 v 49.6 c 0 4 3.2 4 5.6 2.4 l 35.2 -24 C 98 68.6 98 65.4 95.6 63.8 l -35.2 -24.8 z M 86.8 67 l -24.8 17.6 V 49.4 L 86.8 67 z',
    color: BRAND_COLOR,
  },
  timerStopped: {
    path: 'M 57.58 40.52 H 62.9 a 3.04 3.04 90 0 1 3.04 3.04 V 89.92 a 3.04 3.04 90 0 1 -3.04 3.04 H 57.58 a 3.04 3.04 90 0 1 -3.04 -3.04 V 43.56 A 3.04 3.04 90 0 1 57.58 40.52 Z m 23.56 52.44 h 5.32 a 3.04 3.04 90 0 0 3.04 -3.04 V 43.56 a 3.04 3.04 90 0 0 -3.04 -3.04 H 81.14 a 3.04 3.04 90 0 0 -3.04 3.04 V 89.92 A 3.04 3.04 90 0 0 81.14 92.96 Z',
    color: '#575757',
  },
  empty: {
    path: 'M 72 82.5 A 1.875 1.875 90 0 0 72 15 A 1.875 1.875 90 0 0 72 82.5 M 72 75 A 1.875 1.875 90 0 1 72 22.5 A 1.875 1.875 90 0 1 72 75 Z M 100.125 15 L 38.25 76.875 L 43.875 82.5 L 105.75 20.625 Z',
    color: EMPTY_COLOR,
  },
};

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
    drawIconNoAssignedHours(ctx);
  } else {
    let percentageRemaining = assignedHours - hoursRemaining / assignedHours;
    // check success with an error margin
    if (percentageRemaining <= 0.01 && percentageRemaining >= -0.01) {
      drawIconSuccess(ctx);
    } else {
      drawPieChart(ctx, hoursRemaining, assignedHours);
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
 * Draw icon for when there are no assigned hours.
 *
 * @param {&CanvasRenderingContext2D} ctx
 */
const drawIconNoAssignedHours = (ctx: CanvasRenderingContext2D) => {
  const path = new Path2D(ICONS.empty.path);
  ctx.fillStyle = ICONS.empty.color;
  ctx.fill(path);
};

/**
 * Draw icon when success.
 *
 * @param {&CanvasRenderingContext2D} ctx
 */
const drawIconSuccess = (ctx: CanvasRenderingContext2D) => {
  const path = new Path2D(ICONS.success.path);
  ctx.fillStyle = ICONS.success.color;
  ctx.fill(path);
};

/**
 * Draw pie chart based on assigned and remaining hours.
 *
 * @param {&CanvasRenderingContext2D} ctx
 * @param {number} hoursRemaining
 * @param {number} assignedHours
 */
const drawPieChart = (
  ctx: CanvasRenderingContext2D,
  hoursRemaining: number,
  assignedHours: number
) => {
  // normal or overage
  let workedHours: number;
  let filledColor: string, emptyColor: string;
  if (hoursRemaining < 0) {
    // overage, we worked too long today
    filledColor = OVERAGE_COLOR;
    emptyColor = BRAND_COLOR;
    // hours worked should display as the amount over we are
    workedHours = hoursRemaining * -1;
  } else {
    // under, there are hours remaining to be worked
    filledColor = BRAND_COLOR;
    emptyColor = EMPTY_COLOR;
    workedHours = assignedHours - hoursRemaining;
  }

  // size and position settings
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
  ctx.arc(
    centerX + offsetX,
    centerY + offsetY,
    radius * 0.75,
    startAngle + workedHoursAngle,
    endAngle,
    false
  );
  ctx.lineTo(centerX + offsetX, centerY + offsetY);
  ctx.fillStyle = emptyColor;
  ctx.fill();
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
