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
- Add the tiplink wallet adapter
- Helius Auth Code
- Show a connected wallet they have not authorized with Streamlabs
- Make an info page
- Custom gif
- Use the stremaer minimum
- Let streamer pick a token to receive
- Add token swaps from the sender token to the receiver token

### Nice to have
- Message filtering
- Let streamers set their donation amount and token
- Script to generate pubkey

### Signing Up For Helius

1. Go to the [Helius](https://www.helius.dev/) website and create an account
2. Go to the webhooks section of the developer portal
3. Create a new webhook with the following settings
- Network: Mainnet
- Webhook Type: Enhanced
- Transaction Type: Any
- Webhook Url: <url from ngrok>/api/helius
- Account Address: Pubkey from your .local.env file

## Docs Outline
- Register w/ Streamlabs
- Setting Up Helius
- Setting Up Database
- How to Works ( Sequence Diagrams )
- Env File
- Video Demo