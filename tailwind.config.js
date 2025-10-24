const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@material-tailwind/react/theme/components**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: ["@tailwindcss/typography"],
});