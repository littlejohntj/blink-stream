# Blink Stream

### Doc Ideas
- How to set this up for yourself
- How it works
- Code info
- Config stuff like env

## Todo

### Need to have
- Add usdc support
- Add multiple donation amounts
- Fix UI css bug
- Add a real domain name
- Deploy with next
- Outline the full set up flow
- Let streamers set their donation amount and token
- Clean up code so it actually works
- Add the tiplink wallet adapter

### Nice to have
- Message filtering

### Signing Up For Helius

1. Go to the [Helius](https://www.helius.dev/) website and create an account
2. Go to the webhooks section of the developer portal
3. Create a new webhook with the following settings
- Network: Mainnet
- Webhook Type: Enhanced
- Transaction Type: Any
- Webhook Url: <url from ngrok>/api/helius
- Account Address: Pubkey from your .local.env file

### More dono paramters
- Parse it cleaner on the helius webhook
- Make a usdc dono transaction, have it create the token account if non exists yet ( sad! )