import {auth} from '@/auth';
import {NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';

export const GET = async (req: Request, { params }: {params: Promise<{id: string}>}) => {
  const { id } = await params;
  const authSession = await auth();
  if (authSession && id) {
    await dbConnect();
    // TODO : handle get events
    console.log(id);
    return NextResponse.json({ message : 'success'}, {status: 200});
  }
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
}

