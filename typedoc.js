module.exports = {
    readme: 'README.md',
    tsconfig: 'tsconfig.json',
    entryPoints: [
        "./lib/init.ts",
        "./lib/store.ts",
    ],
    exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/*.test.*'
    ],
    out: './docs',
    includes: 'lib/',
};
