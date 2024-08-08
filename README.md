# Blink Stream

### Doc Ideas
- How to set this up for yourself
- How it works
- Code info
- Config stuff like env

## Todo

### Need to have
- Add a real domain name
- Deploy with next
- Outline the full set up flow
- Helius Auth Code
- Make an info page
- Custom gif
- Use the stremaer minimum
  - I still need to show the user they did not meet the minimum
- Make the apis for the front end permissioned

### Nice to have
- Message filtering
- Let streamers set their donation amount and token
- Let streamer pick a token to receive
- Add token swaps from the sender token to the receiver token
- See if we should be sending a donation post request instead of an alert

### Setting Up Helius

1. Run the script with the command `npm run pubkey` to generate a new pubkey to use for Helius Webhooks
2. Add this pubkey as the HELIUS_WEBHOOK_PUBKEY var in your .env file
3. Add a secret string you come up with as the HELIUS_AUTH_HEADER var in your .env file
3. Go to the [Helius](https://www.helius.dev/) website and create an account
4. Go to the webhooks section of the developer portal
5. Create a new webhook with the following settings
- Network: Mainnet
- Webhook Type: Enhanced
- Transaction Type: Any
- Webhook Url: <url from ngrok>/api/helius
- Authentication Header: string from your .local.env file
- Account Address: Pubkey from your .local.env file
6. Go to your RPCs and copy the mainnet rpc url and add this as the RPC_URL var in your .env file

## Docs Outline
- Register w/ Streamlabs
- Setting Up Helius
- Setting Up Database
- How to Works ( Sequence Diagrams )
- Env File
- Video Demo