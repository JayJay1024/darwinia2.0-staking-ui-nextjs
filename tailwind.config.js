/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF0083",
        component: "#242A2E",
        "app-black": "#1A1D1F",
      },
      spacing: {
        small: "0.3125rem", // 5px
        middle: "0.625rem", // 10px
        large: "0.9375rem", // 15px
      },
      screens: {
        "2xl": "1280px",
      },
      keyframes: {
        rightenter: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        rightleave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        notificationfadeout: {
          "100%": { height: 0 },
        },
      },
      animation: {
        "notification-enter": "rightenter 400ms ease-out",
        "notification-leave": "rightleave 400ms ease-out",
        "notification-fadeout": "notificationfadeout 200ms ease-out",
      }
    },
  },
  plugins: [],
};
