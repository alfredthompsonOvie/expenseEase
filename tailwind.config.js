/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}", "./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        text: 'var(--text)',
        accent: 'var(--accent)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        bgTop: 'var(--background-alt)',
        listItem: 'var(--listItem)',
      }
    },
  },
  plugins: [],
}

