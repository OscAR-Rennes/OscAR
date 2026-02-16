// Custom console.warn filter to ignore specific warnings
const originalWarn = console.warn;

console.warn = (...args) => {
    const warningsToIgnore = [
        '[Layout children]: No route named "connection"',
        '[Layout children]: No route named "profil"',
    ];

    if (warningsToIgnore.some((warning) => args[0]?.includes(warning))) {
        return; // Ignore these warnings
    }

    originalWarn(...args); // Display other warnings
};