/*
 * supported-features.ts
 * 
 * Utility functions for checking what features the environment supports.
 */

/**
 * Determines whether or not the code is executing in a browser as opposed to Node.js or something else similar.
 * @returns `true` if the code is running in a browser - `false` otherwise
 */
function isBrowser(): boolean {
	return 'window' in globalThis && 'document' in globalThis;
}

export { isBrowser };
