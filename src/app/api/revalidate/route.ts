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
    
    if (process.env.NODE_ENV !== 'production') console.log(`✅ Cache cleared for: ${pathToRevalidate}`);
    
    return NextResponse.json({ 
      revalidated: true, 
      path: pathToRevalidate,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('❌ Cache revalidation error:', error);
    return NextResponse.json({ error: 'Error revalidating cache' }, { status: 500 });
  }
}

// GET handler removed intentionally — secret-in-query-param is a security risk.
// Use POST only.