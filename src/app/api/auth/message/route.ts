import { NextResponse } from 'next/server';
import type {
    SolanaSignInInput,
} from "@solana/wallet-standard-features";

export async function GET() {

    const signInMessage: SolanaSignInInput = {
        
    }

    return NextResponse.json({}, { status: 200 });
}

