# Blink Stream

### Doc Ideas
- How to set this up for yourself
- How it works
- Code info
- Config stuff like env

### Todo
- Set up a database
- Set up some donation actions
- Set up helius webhooks
- Host an action icon

### Signing Up For Helius

1. Go to the [Helius](https://www.helius.dev/) website and create an account
2. Go to the webhooks section of the developer portal
3. Create a new webhook with the following settings
- Network: Mainnet
- Webhook Type: Enhanced
- Transaction Type: Any
- Webhook Url: <url from ngrok>/api/helius
- Account Address: Pubkey from your .local.env file
