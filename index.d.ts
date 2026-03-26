/**
 * Generate a short code from any string using SHA-256 and Base62 encoding.
 * @param input - The string to shorten
 * @param length - Output length (1-22, default: 8)
 * @returns An alphanumeric code (0-9, A-Z, a-z) of the specified length
 * @throws {TypeError} If input is missing, not a string, or empty
 * @throws {RangeError} If input exceeds 64KB or length is out of range
 * @example
 * ```ts
 * import { gen } from 'theshortener';
 *
 * const code = gen('https://google.com');
 * console.log(code); // "Qhq1TQ2n"
 *
 * const short = gen('https://google.com', 6);
 * console.log(short); // "Qhq1TQ"
 * ```
 */
export function gen(input: string, length?: number): string;

/**
 * Async version of gen(). Runs SHA-256 + Base62 encoding in a worker thread.
 * @param input - The string to shorten
 * @param length - Output length (1-22, default: 8)
 * @returns Promise resolving to an alphanumeric code of the specified length
 * @throws {TypeError} If input is missing, not a string, or empty
 * @throws {RangeError} If input exceeds 64KB or length is out of range
 * @example
 * ```ts
 * import { genAsync } from 'theshortener';
 *
 * const code = await genAsync('https://google.com');
 * console.log(code); // "Qhq1TQ2n"
 * ```
 */
export function genAsync(input: string, length?: number): Promise<string>;

