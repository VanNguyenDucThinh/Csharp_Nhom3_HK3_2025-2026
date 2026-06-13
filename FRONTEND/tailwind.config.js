module.exports = {
    // Khai báo nơi Tailwind cần quét class.
    content: ['./index.html', './src/**/*.{ts,tsx}'],

    theme: {
        extend: {
            colors: {
                bg: {
                    base: 'var(--bg-base)',
                    highlight: 'var(--bg-highlight)',
                },
                text: {
                    subdued: 'var(--text-subdued)',
                },
                essential: {
                    base: 'var(--essential-base)',
                },
                accent: {
                    base: 'var(--accent-base)',
                },
            },
        },
    },
    plugins: [],
}