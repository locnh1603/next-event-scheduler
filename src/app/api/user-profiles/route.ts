import { NextRequest, NextResponse } from 'next/server';
import {
  IRequestBody,
  IResponseBody,
} from '@/services/app/server/server-fetch';
import { UserProfileCommands } from '@/enums/event.enum';
import { handleError } from '@/app/api/api-error-handler';
import { userProfileValidator } from '@/app/api/user-profiles/user-profile.validator';
import { userProfileService } from '@/services/api/user-profile.service';

export const POST = async (req: NextRequest) => {
  try {
    const data: IRequestBody = await req.json();
    const { command } = data;
    const response: IResponseBody = {
      command,
      payload: null,
    };
    let validatedData;
    switch (command) {
      case UserProfileCommands.getUserProfile:
        response.payload = await userProfileService.getUserProfile();
        break;
      case UserProfileCommands.getUserProfiles:
        validatedData = userProfileValidator.getUserProfiles.parse(data);
        response.payload = await userProfileService.getUserProfiles(
          validatedData.payload.userIds
        );
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid command' },
          { status: 400 }
        );
    }
    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
};
