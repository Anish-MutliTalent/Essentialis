/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'sm':  '480px',   // large mobile / portrait tablet
      'md':  '768px',   // tablet / small laptop
      'lg':  '1440px',  // standard desktop (default working size ~1739px sits here)
      'xl':  '1920px',  // 1080p / FHD
      '2xl': '2560px',  // QHD
      '3xl': '3840px',  // 4K
    },
    extend: {
      fontWeight: {
        normal: '350',
      },
    },
  },
  plugins: [],
};