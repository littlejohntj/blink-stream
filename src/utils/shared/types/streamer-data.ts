export interface StreamerData {
    streamerInfo: {
        name: string | null
    },
    donationSettings: {
        minimum: number
    },
    services: {
        authorizedStreamlabs: boolean
    }
}