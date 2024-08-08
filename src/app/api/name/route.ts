import { updateName } from '@/utils/update-name';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);
    const name = requestUrl.searchParams.get("name");
    const pubkey = requestUrl.searchParams.get("pubkey");
    
    await updateName(name!, pubkey!)

    if ( name != null && pubkey != null ) {
        return NextResponse.json({ name: name }, { status: 200 });
    } else {
        return NextResponse.json({}, { status: 401 });
    }

    
}