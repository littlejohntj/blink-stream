import { streamerInfo } from '@/utils/backend/streamer-info';
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
                <text x="50%" y="50%" font-family="Arial" font-size="${fontSize}" fill="${color}" text-anchor="middle" alignment-baseline="middle">${text}</text>
            </svg>
        `;
        return Buffer.from(svgImage);
    };

    const createSolidColorImage = (color: string, width: number, height: number) => {
        const svgImage = `
          <svg width="${width}" height="${height}">
            <rect width="100%" height="100%" fill="${color}" />
          </svg>
        `;
        return Buffer.from(svgImage);
    };

    const textImage = createTextImage(`donate to ${streamer!.name.toLowerCase()}`, 2000, 2000, 128, "white")
    const colorImage = createSolidColorImage("blue", 2000, 2000)

    const processedImage = await sharp(colorImage).composite([{input: textImage}]) .png().toBuffer();

    const response = new NextResponse(processedImage, { status: 200, headers: { 'Content-Type': 'image/png' } })
    return response
}

