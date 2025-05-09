import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication by calling the auth check endpoint
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const authResponse = await fetch('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      return NextResponse.json({ error: 'Authorization check failed' }, { status: 401 });
    }

    const authData = await authResponse.json();

    if (!authData.isAuthorized) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as Blob | null;
    const owner = formData.get('owner') as string | null;

    if (!imageFile || !owner) {
      return NextResponse.json(
        { error: 'Image and owner are required' },
        { status: 400 }
      );
    }

    const uuid = uuidv4();

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saveDir = path.join(process.cwd(), 'public', 'media', 'saved');
    const savePath = path.join(saveDir, `${uuid}.png`);

    await fs.mkdir(saveDir, { recursive: true });

    await fs.writeFile(savePath, buffer);

    const queryText = 'INSERT INTO saved (owner, uuid) VALUES ($1, $2) RETURNING *';
    const values = [owner, uuid];
    const result = await query(queryText, values);

    return NextResponse.json(
      { message: 'Image saved successfully', data: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving image:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}