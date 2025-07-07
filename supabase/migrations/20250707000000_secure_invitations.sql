
-- Add a secure token to the event_invitations table
ALTER TABLE "public"."event_invitations"
ADD COLUMN "token" UUID DEFAULT gen_random_uuid() NOT NULL;

-- Create a unique index on the token
CREATE UNIQUE INDEX event_invitations_token_idx ON "public"."event_invitations" (token);

-- Revoke all permissions from the anon role
REVOKE ALL ON TABLE "public"."event_invitations" FROM "anon";

-- Enable RLS on the table
ALTER TABLE "public"."event_invitations" ENABLE ROW LEVEL SECURITY;

-- Create a policy that denies all access by default.
-- This is a good practice for tables that should not be publicly accessible.
CREATE POLICY "Deny all access"
ON "public"."event_invitations"
FOR ALL
USING (false)
WITH CHECK (false);
