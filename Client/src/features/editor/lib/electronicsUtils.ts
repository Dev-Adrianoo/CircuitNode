const RESISTOR_COLOR_MAP : { [ key: number]: string } = {
  0: '#000000', // Black
  1: '#A52A2A', // Brown
  2: '#FF0000', // Red
  3: '#FFA500', // Orange
  4: '#FFFF00', // Yellow
  5: '#008000', // Green
  6: '#0000FF', // Blue
  7: '#EE82EE', // Violet
  8: '#808080', // Gray
  9: '#FFFFFF', // White
};

/**
 * Calcula as 3 primeiras faixinhas de cor de um resistor com base em seu valor.
 * resistance - O valor da resistência em Ohms (ex: 2200).
 * retorna Um array com 3 strings de cores (ex: ['red', 'red', 'red']).
 */

export function getResistorColorBands(resistance: number): [string, string, string] {

  if (resistance < 10) {
    return [RESISTOR_COLOR_MAP[0], RESISTOR_COLOR_MAP[resistance], RESISTOR_COLOR_MAP[0]]
  }

  const s = String(resistance);
  const firstDigit = parseInt(s[0]);
  const secondDigit = parseInt(s[1]);
  const multiplier = s.length - 2;

  const band1 = RESISTOR_COLOR_MAP[firstDigit] || '#000000';
  const band2 = RESISTOR_COLOR_MAP[secondDigit] || '#000000';
  const band3 = RESISTOR_COLOR_MAP[multiplier] || '#000000';

  return [band1, band2, band3]
}


export const LED_COLOR_MAP: { [key: string]: { on: string, off: string, shadow: string, gradientFrom: string } } = {
  red:    { on: '#F87171', off: '#450A0A', shadow: '0 0 15px 5px #F87171', gradientFrom: '#FECACA' },
  green:  { on: '#4ADE80', off: '#0C2B1B', shadow: '0 0 15px 5px #4ADE80', gradientFrom: '#D1FAE5' },
  blue:   { on: '#60A5FA', off: '#1E3A8A', shadow: '0 0 15px 5px #60A5FA', gradientFrom: '#DBEAFE' },
  yellow: { on: '#FACC15', off: '#423B04', shadow: '0 0 15px 5px #FACC15', gradientFrom: '#FEF9C3' },
};

export const JUMPERS_COLOR_MAP:{ [key: number]  : string} = {
   0: '#ee3a03',
   1: '#10550a',
   2: '#0932b8'  ,
   3: '#dad6d6',
   4: '#c4d80d',
   5: '#b6018f',
   6: '#04d604',
   7: '#0932b8'  ,
   8: '#ffc400',
   9: '#128783',
   10: '#633800',
   11: '#002e63',
   12: '#0004ed'  ,
   13: '#d804db',
   14: '#4e4e99',
} 