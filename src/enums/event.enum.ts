export enum EventCommands {
  getEvents = 'getEvents',
  createEvent = 'createEvent',
  getDashboardEvents = 'getDashboardEvents',
  filterEvents = 'filterEvents',
  updateEventDetails = 'updateEventDetails',
  getParticipants = 'getParticipants',
  joinEvent = 'joinEvent',
  inviteEmails = 'inviteEmail',
  inviteUsers = 'inviteUser',
  getInvitation = 'getInvitation',
  getEventByInvitationId = 'getEventByInvitationId',
  getInvitationsByEventId = 'getInvitationsByEventId',
  acceptInvitation = 'acceptInvitation',
  declineInvitation = 'declineInvitation',
}

export enum UserCommands {
  getUsers = 'getUsers',
  inviteUsers = 'inviteUsers',
  inviteEmails = 'inviteEmails',
}

export enum UserProfileCommands {
  getUserProfile = 'getUserProfile',
  getUserProfiles = 'getUserProfiles',
}
