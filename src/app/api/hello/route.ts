import { NextResponse } from 'next/server';
import { filterMessage } from '../../../utils/filter-message'

export async function GET() {

  await filterMessage("")

  return NextResponse.json({ message: 'Hello from the API!' });
}

