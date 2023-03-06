/// <reference path="libs/js/stream-deck.js" />

/**
 * Get the hours formatted for display.
 */
const formatHours = (hours) => {
  if (Math.abs(hours) < 1) return (hours >= 0 ? '+' : '') + Math.round(hours * 60) + 'm';
  return (hours >= 0 ? '+' : '') + hours.toFixed(2) + 'h';
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
};

/**
 * Get the icon to display based on hours.
 */
const getStatusIcon = (hours) => {
  if (hours >= 0.5) {
    return ICONS.stopReally;
  }
  if (hours >= 0.25) {
    return ICONS.stop;
  }
  if (hours <= 0.25) {
    return ICONS.continue;
  }
  return ICONS.success;
};

const CANVAS_SIZE = 144;
const TEXT_COLOR = '#fff';
const FONT_SIZE = 32;

/**
 * Display the hours remaining.
 */
export const displayHoursRemaining = (context, hours) => {
  console.log(formatHours(hours), getStatusIcon(hours).color);
  // Canvas
  let canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Icon
  const icon = getStatusIcon(hours);
  const path = new Path2D(icon.path);
  ctx.fillStyle = icon.color;
  ctx.fill(path);

  // Text
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${FONT_SIZE}px Helvetica, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatHours(hours), CANVAS_SIZE * 0.5, CANVAS_SIZE * 0.8);

  const finalImage = canvas.toDataURL('image/png');
  $SD.setImage(context, finalImage);
};
