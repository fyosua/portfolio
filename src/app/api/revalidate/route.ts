import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { secret, path } = await request.json();
    
    // Verify secret token for security
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate specific path or entire homepage
    const pathToRevalidate = path || '/';
    
    revalidatePath(pathToRevalidate);
    
    console.log(`✅ Cache cleared for: ${pathToRevalidate}`);
    
    return NextResponse.json({ 
      revalidated: true, 
      path: pathToRevalidate,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cache revalidation error:', error);
    return NextResponse.json({ error: 'Error revalidating cache' }, { status: 500 });
  }
}

// Optional: GET method for easy testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  try {
    const pathToRevalidate = path || '/';
    revalidatePath(pathToRevalidate);
    
    return NextResponse.json({ 
      revalidated: true, 
      path: pathToRevalidate,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error revalidating cache' }, { status: 500 });
  }
}