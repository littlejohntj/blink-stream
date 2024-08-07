export const blinkUrl = ( toPubkey: string ): string => {
    return `http://localhost:3000/donate?to=${toPubkey}&message={message}&amount={amount}&name={name}`
}