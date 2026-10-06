export const test = async (description, testFunction) => {
    try {
        await testFunction();
        console.log(`%c✅ PASS: ${description}`, 'color: #10B981; font-weight: bold');
    } catch (error) {
        console.error(`%c❌ FAIL: ${description}`, 'color: #EF4444; font-weight: bold');
        console.error(error);
    }
};

export const expect = (actual) => ({
    toBe: (expected) => {
        if (actual !== expected) throw new Error(`Se esperaba ${expected}, pero se recibió ${actual}`);
    }
});