import axios from 'axios';
import { jupTokenIdForSupportedToken, SupportedToken } from './supported-tokens';

export async function priceOfSupportedToken( supportedToken : SupportedToken): Promise<number> {
    try {

        const jupId = jupTokenIdForSupportedToken(supportedToken)

        const response = await axios.get(`https://price.jup.ag/v6/price?ids=${jupId}`);
        const data = response.data.data;
        
        if (data && data[jupId] && data[jupId].price) {
            return data[jupId].price;
        } else {
            throw new Error(`Price not found for token: ${jupId}`);
        }
    } catch (error) {
        console.error(`Error fetching price for ${supportedToken}:`, error);
        throw error;
    }
}
