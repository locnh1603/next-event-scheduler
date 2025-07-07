-- This policy allows event creators to view the invitations for their own events.
-- It is intended for use by authenticated users on a secure API endpoint.

CREATE POLICY "Allow event owners to view their invitations"
ON "public"."event_invitations"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.events
    WHERE events.id = event_invitations.event_id
      AND events.created_by = auth.uid()
  )
);
