/**
 * Generate an 8-character code from any string using SHA-256 and Base62 encoding.
 * @param input - The string to shorten
 * @returns An 8-character alphanumeric code (0-9, A-Z, a-z)
 * @throws {TypeError} If input is missing or empty
 * @example
 * ```ts
 * import shortener from 'theshortener';
 * 
 * const code = shortener.gen('https://google.com');
 * console.log(code); // "Qhq1TQ2n"
 * ```
 */
export function gen(input: string): string;
