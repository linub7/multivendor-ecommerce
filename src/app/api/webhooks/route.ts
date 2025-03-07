import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const eventType = evt.type;

  // When user is created or updated
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const data = JSON.parse(body).data;
    // because of user.updated -> we have to use Partial<User> to avoid error on user.updated, because we updated only some fields
    const user: Partial<User> = {
      id: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      picture: data.image_url,
    };

    if (!user) return;

    // Upsert user in the database (update if exists, create if not)
    const dbUser = await db.user.upsert({
      // if u created user in db by yourself, id may not be same with clerk id, so we check by email
      where: { email: user.email },
      update: user,
      create: {
        id: user.id!,
        name: user.name!,
        email: user.email!,
        picture: user.picture!,
        role: user.role || 'USER',
      },
    });

    // Update user's metadata in Clerk with the role information
    const clerkInstance = await clerkClient();
    await clerkInstance.users.updateUserMetadata(data.id, {
      privateMetadata: {
        role: dbUser.role || 'USER',
      },
    });
  }

  // When user is deleted
  if (eventType === 'user.deleted') {
    const userId = JSON.parse(body).data.id;
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  return new Response('Webhook received', { status: 200 });
}
