export function truncateString(str?: string) {
    if (str) {
        return str.length > 10 ? str.slice(0, 15) + '...' : str;
    }
    return "";
}