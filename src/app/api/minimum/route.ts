import { updateMinimum } from '@/utils/update-minimum';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);
    const minimum = parseInt(requestUrl.searchParams.get("minimum")!)
    const pubkey = requestUrl.searchParams.get("pubkey")!;
    
    await updateMinimum(minimum, pubkey)

    if ( minimum != null && pubkey != null ) {
        return NextResponse.json({ minimum: minimum }, { status: 200 });
    } else {
        return NextResponse.json({}, { status: 401 });
    }

    
}