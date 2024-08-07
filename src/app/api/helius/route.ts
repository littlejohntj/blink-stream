import { NextResponse } from 'next/server';
import * as bs58 from 'bs58';
import axios from 'axios';

export async function POST(request: Request) {

    const transactions = await request.json();
    const transaction = transactions[0]
    const instructions = transaction.instructions
    const lastInstruction = instructions[instructions.length - 1]
    const lastInstructionProgramId = lastInstruction.programId
    const lastInstructionData = lastInstruction.data

    const decoded = bs58.default.decode(lastInstructionData);
    const decodedString = Buffer.from(decoded).toString('utf-8');

    const reponse = await axios.post("https://streamlabs.com/api/v2.0/alerts", {
        "type": "donation",
        "image_href": "",
        "sound_href": "",
        "message": decodedString,
        "user_message": "Thanks for the donation :)",
        "duration": "4000",
        "special_text_color": "Blue"      
    }, {
        headers: {
            "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5Y2I0MjMxMi02MjNkLTQyYTYtOWUzOS1kZjM4YTFiODIzYTAiLCJqdGkiOiI2N2QzMDRlOGUxNjMxOWEyYjQyOGMxNDE5MGM1OWQ0NjJiMzVhY2RjMjNkMDBhZTVkNDYwYjMzMTBmNjVmM2U1NTFjMzllMzE5YjY1ZjE1NyIsImlhdCI6MTcyMjk3ODkxMC41MTgxMjEsIm5iZiI6MTcyMjk3ODkxMC41MTgxMjMsImV4cCI6MjM1NDEzMDkxMC40OTkwODQsInN1YiI6IjY3NzgzNzEwIiwic2NvcGVzIjpbImFsZXJ0cy5jcmVhdGUiXX0.OwgeIW4Y-UqbsRB2wUjq5miNOn18a_EUveYhWM4evqrm2yNBHNK98RvT5gAR1VN3naqteXocCNDYJFj-UDdZpqtMxt0koEHU-3Oq3pudYa_59bmLdGMx9qKkdnvAACdtfj6Jyi_Qagy6TUlm-lSdnjiQIynGsf7J5J9uw93PSUTwzaLo5QDL9ShD3BR1lVTknjYfV_Fp-PGXW4S_jx0-t1w6kwSDwStVxVXxeo399b3wNWKLVdEBH9ymSf8z0QBS951sN1T9MC8bZApJ1hD9x7XhtWxiHxtJa_vuuLWOyNNIwmveF7GNl0c9sCZHblrEaARdDLFHF_6GtUWdL-FyWrq_iGZo8II4Tv3OTzV4eOI0KMxv0N-vTU1gidA_AAuaZcI746VBOr9ppUXg-hjvJnAtUhh3MUfWTKmiLrI4dDNzueQ5WbE36hXgyIUrmxxcjaYr3p757CD_8R73HGvRFm5V2hi3wljf4MjjG_jjJ3wVnRHDr_iyR_QDEd6KcPSO2mFHU3whjJ4dOp5PgEKCxq7UX9lAN7vMUqLPplrbJ7pYVEbRtIDl6ivrYwKXmNzH5YKdZXX1r7xwaCnAIZdEZzI0s3njrTalVlF5G5uYwtgpHHUvZddsEpUJU_kx_eFj_8Hz6dexyxhEMifxT8a5vEdRsio-q7t-sDOm7QTafow`
        }
        }
    )

    console.log(reponse)
    
    return NextResponse.json({ status: 200 });
}