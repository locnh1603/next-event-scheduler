import {NextRequest, NextResponse} from 'next/server';
import dbConnect from '@/lib/dbConnect';
import {IRequestBody, IResponseBody} from '@/utilities/fetch-util';
import {UserCommands} from '@/enums/event.enum';
import {handleError} from '@/app/api/api-error-handler';
import {userValidator} from '@/app/api/users/user.validator';
import {userService} from '@/app/api/users/user.service';

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    await dbConnect();
    const data: IRequestBody = await req.json();
    const {command} = data;
    const response: IResponseBody = {
      command,
      payload: null
    }
    let validatedData;
    switch (command) {
      case UserCommands.getUsers:
        validatedData = userValidator.getUsers.parse(data);
        response.payload = await userService.getUsers(validatedData.payload.ids);
        break;
      default:
        return NextResponse.json({message: 'Invalid command'}, {status: 400});
    }
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}
