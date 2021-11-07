/**
 * Wraps setTimeout in an async promise function,
 * allowing awaiting for a certain duration of time
 * @param {number} duration - Duration in ms to wait before resolving
 */
export default async function delay(duration: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), duration);
    });
}