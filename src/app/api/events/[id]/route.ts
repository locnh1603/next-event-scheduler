import {auth} from '@/auth';
import {NextResponse} from 'next/server';
import dbConnect from '@/app/lib/dbConnect';

export const GET = auth(async (req, { params }) => {
  const param = await params;
  if (req.auth && param) {
    const {id} = param;
    await dbConnect();
    // TODO : handle get events
    console.log(id);
    return NextResponse.json({ message : 'success'}, {status: 200});
  }
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
})
