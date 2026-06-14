module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: [
        'contracts/**/*.tact',
        '!contracts/**/*.d.ts',
    ],
    globals: {
        'ts-jest': {
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
            },
        },
    },
    testTimeout: 60000,
    verbose: true,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                module: 'esnext',
                target: 'es2020',
                lib: ['es2020'],
                moduleResolution: 'node',
                declaration: true,
                declarationMap: true,
                sourceMap: true,
                outDir: './build',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                resolveJsonModule: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
            },
            isolatedModules: true,
        }],
    },
};
