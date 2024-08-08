import { streamerInfo } from '@/utils/streamer-info';
import { updateMinimum } from '@/utils/update-minimum';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);
    const pubkey = requestUrl.searchParams.get("pubkey")!;

    if ( pubkey == null ) {
        return NextResponse.json({}, { status: 401 });
    }
    
    const streamer = await streamerInfo(pubkey)
    
    if ( streamer == null ) {
        return NextResponse.json({ streamer: null }, { status: 200 });
    }

    return NextResponse.json({ streamer: streamer }, { status: 200 });
    
}