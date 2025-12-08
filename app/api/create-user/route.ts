import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; // Import from your lib file

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userData } = body;

    // This command uses the Admin SDK, so it BYPASSES client-side security rules.
    // It creates (or updates) a document in the 'users' collection.
    await db.collection('users').doc(userId).set({
      ...userData,
      createdAt: new Date().toISOString(),
      source: 'openai-agent'
    });

    return NextResponse.json({ success: true, message: 'User collection created/updated' });
  } catch (error) {
    console.error('Error writing to Firebase:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}
