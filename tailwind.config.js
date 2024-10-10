/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/index.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        'heartful': ['Heartful', 'sans-serif']
      },
      colors: {
        // Background Colors
        'background-light': '#F4F4F4',  // Light background for general areas
        'background-dark': '#3ab9ba',   // Dark background for main sections
        'background-card': '#C3C2BA',   // Light beige for cards or containers

        // Primary Colors
        'primary-blue': '#3ab9ba',      // Deep greenish blue for primary elements
        'primary-blue-shades': {
          'lightest': '#ecf9f9',
          'light': '#c5eced',
          'medium-light': '#9ee0e1',
          'medium': '#77d4d5',
          'dark': '#50c7c8',
          'darker': '#37aeaf',
          'darkest': '#2a8788',
          'deepest': '#123a3a',
          'nearly-black': '#061313',
        },
        'primary-orange': '#ea9d50',    // Rich orange for accents
        'primary-orange-shades': {
          'lightest': '#fcf2e8',
          'light': '#f6d4b3',
          'medium-light': '#f0b881',
          'medium': '#ea9c4e',
          'dark': '#e4801b',
          'darker': '#b16315',
          'darkest': '#7e470f',
          'deepest': '#4c2a09',
          'nearly-black': '#190e03',
        },

        // Accent Colors
        'accent-light-orange': '#F4A65C', // Light orange for accents or highlights
        'accent-light-green': '#4CAF50',  // Fresh green for positive indicators or accents
        'accent-beige': '#D0C9B0',        // Subtle beige for accents

        // Text Colors
        'text-primary': '#333333',      // Primary text color for readability
        'text-secondary': '#6C6C6C',    // Secondary text color for less emphasis

        // Border and Shadow Colors
        'border-light': '#E0E0E0',      // Light border color for inputs or cards
        'border-dark': '#B0B0B0',       // Darker border color for better contrast
        'shadow-color': '#000000',      // Shadow color for depth

        // Button Colors
        'button-primary': '#24413A',    // Deep green for primary buttons
        'button-primary-text': '#FFFFFF', // White text color for primary buttons
        'button-secondary': '#F4A65C',  // Light orange for secondary buttons
        'button-secondary-text': '#6A4C4B', // Dark blue text color for secondary buttons

        // Icon Colors
        'icon-primary': '#4A5D77',      // Lighter blue for primary icons
        'icon-secondary': '#DC7E3C',    // Warm orange for secondary icons
        'icon-tertiary': '#E0E4E8',     // Light grey for tertiary icons

        // Link Colors
        'link-color': '#24413A',        // Deep green for links
        'link-hover': '#4A6B60',        // Lighter green for link hover effects

        // Status Colors
        'success-green': '#28A745',     // For success messages or indicators
        'error-red': '#DC3545',         // For error messages or indicators
        'warning-orange': '#FFC107',    // For warning messages or highlights

        // Simple White
        'white': '#ffffff',
      },
    },
  },
  plugins: [],
}