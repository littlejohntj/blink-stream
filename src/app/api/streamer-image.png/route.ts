import { streamerInfo } from '@/utils/streamer-info';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);
    const pubkey = requestUrl.searchParams.get("pubkey")!;

    const streamer = await streamerInfo(pubkey)

    const createTextImage = (text: string, width: number, height: number, fontSize: number, color: string) => {
        const svgImage = `
            <svg width="${width}" height="${height}">
                <rect width="100%" height="100%" fill="transparent"/>
                <text x="50%" y="50%" font-size="${fontSize}" fill="${color}" text-anchor="middle" alignment-baseline="middle">${text}</text>
            </svg>
        `;
        return Buffer.from(svgImage);
    };

    const image = createTextImage(streamer!.name, 2000, 2000, 96, "blue")

    const processedImage = await sharp(image).png().toBuffer();

    const response = new NextResponse(processedImage, { status: 200, headers: { 'Content-Type': 'image/png' } })
    return response
}

