export default function debug(from: string, msg?: string | null) {
    if (process.env.NODE_ENV === 'development') console.log(`[${from}] ${msg ?? 'No content'}`);
}