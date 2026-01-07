import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { readFile } from 'fs/promises';
import { join } from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    const filename = searchParams.get('file');

    if (!sessionId || !filename) {
      return NextResponse.json(
        { error: 'Missing session_id or file parameter' },
        { status: 400 }
      );
    }

    // Verify the session is valid and paid
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status !== 'paid') {
        return NextResponse.json(
          { error: 'Payment not completed' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 403 }
      );
    }

    // Security: Only allow .pbix files and prevent directory traversal
    if (!filename.endsWith('.pbix') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid file' },
        { status: 400 }
      );
    }

    // Read file from downloads directory
    const filePath = join(process.cwd(), 'downloads', filename);
    
    try {
      const fileBuffer = await readFile(filePath);
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



