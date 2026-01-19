import { NextResponse } from 'next/server';

export async function GET() {
    const PAGE_ID = process.env.META_PAGE_ID;
    const ACCESS_TOKEN = process.env.META_USER_ACCESS_TOKEN;

    if (!PAGE_ID || !ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    try {
        // Fetch Page Details
        const response = await fetch(
            `https://graph.facebook.com/v21.0/${PAGE_ID}?fields=id,name,category&access_token=${ACCESS_TOKEN}`
        );

        const data = await response.json();

        if (data.error) {
            return NextResponse.json({ success: false, error: data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully connected to Meta Graph API',
            page: data,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
