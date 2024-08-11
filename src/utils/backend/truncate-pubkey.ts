export const truncatePubkey = (str: string): string => {
    if (str.length <= 6) {
        return str;
    }
    return str.slice(0, 3) + '...' + str.slice(-3);
}