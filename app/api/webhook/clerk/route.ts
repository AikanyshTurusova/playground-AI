import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUserDocument } from '../../../firebase/utils';

// Type for Clerk user data
interface ClerkUserData {
  id: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with ID: ${id} and type: ${eventType}`);
  console.log('Webhook body:', body);

  // Handle user creation
  if (eventType === 'user.created') {
    try {
      const userData = evt.data as unknown as ClerkUserData;
      console.log('Creating Firebase user document for:', userData.id);
      
      const success = await createUserDocument(userData.id, userData);
      if (success) {
        console.log('Firebase user document created successfully');
      } else {
        console.error('Failed to create Firebase user document');
      }
    } catch (error) {
      console.error('Error creating Firebase user document:', error);
    }
  }

  // Handle user updates
  if (eventType === 'user.updated') {
    try {
      const userData = evt.data;
      console.log('User updated:', userData.id);
      // You can add logic here to update the Firebase user document
    } catch (error) {
      console.error('Error handling user update:', error);
    }
  }

  // Handle user deletion
  if (eventType === 'user.deleted') {
    try {
      const userData = evt.data;
      console.log('User deleted:', userData.id);
      // You can add logic here to delete the Firebase user document
    } catch (error) {
      console.error('Error handling user deletion:', error);
    }
  }

  return new Response('', { status: 200 });
}
