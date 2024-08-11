# Blink Stream

### Doc Ideas
- How to set this up for yourself
- How it works
- Code info
- Config stuff like env

## Todo

### Need to have
- Outline the full set up flow
- Make it work with current unfurling logic, were using stuff that's too new
- Get to a better "base" ui that i can at least apply with
- Set up the domaine

### Nice to have
- Have different pages for "landing" and "app"
- Build in "levels of confusing" modes ie. Just message + Send $1 vs.  All the tokens appearing
- Let streamers set their donation amount and token
- Let streamer pick a token to receive
- Add token swaps from the sender token to the receiver token
- See if we should be sending a donation post request instead of an alert

### Bugs
- Double notifactions when running locally since were using the same pubkeys for mainnet and local
- Fails on sol transfers since there is no tokenTransfers struct in the helius response
- Streamer name text does not render on production for the streamer image

### Branding Todos
- Make an info page
- New favicon
- Custom gif
- Add a real domain name


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

### Auth Flows
- Sign out flow ( how the user goes from signed in to signed out )
- Sign in flow ( how the user goes from signed out locally to signed in )
- Frontend -> Backend request flow ( how the frontend makes requests to the backend to modify state )
- Streamlabs auth flow ( how the user goes and gets a stream labs acess token )
- On page load flow ( determins if the user is log in and what state to show )

