import { NextResponse } from 'next/server';
import { ActionGetResponse, ActionPostResponse, ACTIONS_CORS_HEADERS } from '@solana/actions'

export async function GET(request: Request) {

    const actionGetResponse: ActionGetResponse = {
        icon: 'icon.png',
        title: 'Donate title',
        description: 'Donate description',
        label: 'Button text'
    }

    return NextResponse.json(actionGetResponse, { status: 200, headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {

    const actionPostResponse: ActionPostResponse = {
        transaction: '',
        message: ''
    }

    return NextResponse.json(actionPostResponse, { status: 200, headers: ACTIONS_CORS_HEADERS });
}