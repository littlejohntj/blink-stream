export const blinkUrl = ( toPubkey: string ): string => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/donate?to=${toPubkey}`
}