/** @type {import('tailwindcss').Config} **/ 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

  const onColorClass = {
    red: 'bg-red-500 shadow-red-500/50',
    green: 'bg-green-500 shadow-green-500/50',
    blue: 'bg-blue-500 shadow-blue-500/50',
    yellow: 'bg-yellow-400 shadow-yellow-400/50',
  }[ledColor] || 'bg-gray-500';

  const offColorClass = {
    red: 'bg-red-800',
    green: 'bg-green-800',
    blue: 'bg-blue-800',
    yellow: 'bg-yellow-700',
  }[ledColor] || 'bg-gray-800';