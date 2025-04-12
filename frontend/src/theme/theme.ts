/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // チャットアプリの画像に合わせたカスタムカラー
        "chat-green": "#25D366",
        "chat-light-green": "#DCF8C6",
        "chat-bg": "#ECECEC",
        "chat-read": "#4FC3F7",
        "chat-header": "#075E54",
        "chat-header-light": "#128C7E",
        "message-out": "#DCF8C6",
        "message-in": "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Meiryo",
          "游ゴシック",
          "Yu Gothic",
          "sans-serif",
        ],
      },
      boxShadow: {
        message: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
      },
    },
  },
  plugins: [],
};
