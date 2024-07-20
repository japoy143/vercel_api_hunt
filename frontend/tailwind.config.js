/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
      },
      textColor: {
        primary: "#151515",
      },
      colors: {
        buttonColor: "#151515",
      },
      backgroundColor: {
        buttonColor: "#151515",
        bgwhite: "#F5F7F8",
        bgCommentSection: "#FFFFFF",
      },
      screens: {
        xs: "300px",
      },
    },
  },
  plugins: [],
};
