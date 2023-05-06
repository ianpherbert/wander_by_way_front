export function truncateString(str: string) {
    return str.length > 10 ? str.slice(0, 15) + '...' : str;
}