/// <reference path="libs/js/stream-deck.js" />

/**
 * Get the hours formatted for display.
 */
const formatHours = (hours) => {
  return (hours >= 0 ? '+' : '') + hours.toFixed(2) + 'h';
};

/**
 * The icon svg data.
 *
 * Easy editor: https://yqnn.github.io/svg-path-editor/
 */
const ICONS = {
  continue: {
    path: 'M 38.0464 12.3971 H 47.4942 v 75.5827 H 38.0464 V 12.3971 z m 31.0897 2.4564 L 61.666 18.6957 v 62.9856 l 7.4701 3.8421 l 44.0899 -31.4928 V 46.3464 l -44.0899 -31.4928 z M 102.3547 50.1885 l -31.2409 22.3158 V 27.8727 L 102.3547 50.1885 z',
    color: '#0e74e8',
  },
  stop: {
    path: 'M 52.68 11.52 H 60.36 a 3.84 3.84 90 0 1 3.84 3.84 V 76.8 a 3.84 3.84 90 0 1 -3.84 3.84 H 52.68 a 3.84 3.84 90 0 1 -3.84 -3.84 V 15.36 A 3.84 3.84 90 0 1 52.68 11.52 Z m 30.72 69.12 h 7.68 a 3.84 3.84 90 0 0 3.84 -3.84 V 15.36 a 3.84 3.84 90 0 0 -3.84 -3.84 H 83.4 a 3.84 3.84 90 0 0 -3.84 3.84 V 76.8 A 3.84 3.84 90 0 0 83.4 80.64 Z',
    color: '#fa5c00',
  },
  stopReally: {
    path: 'M 44.044 57.908 a 6.912 6.912 90 0 0 6.912 6.912 h 41.472 a 6.912 6.912 90 0 0 6.912 -6.912 V 16.436 a 6.912 6.912 90 0 0 -6.912 -6.912 H 50.956 a 6.912 6.912 90 0 0 -6.912 6.912 v 41.472 z',
    color: '#e02222',
  },
  success: {
    path: 'M 113.9098 18.7556 L 64.8163 67.8491 L 39.4054 42.4381 L 31.0416 50.8019 l 33.7747 33.7806 l 57.4631 -57.4572 z',
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
const displayHoursRemaining = (context, hours) => {
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
