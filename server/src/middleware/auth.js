// import { createClerkClient } from '@clerk/backend';
// import { env } from '../config/env.js';
// import User from '../models/User.js';

// const clerkClient = createClerkClient({ secretKey: env.clerkSecretKey });

// /**
//  * Verifies the Clerk session JWT sent in the Authorization header
//  * (Bearer token), attaches `req.auth` (Clerk claims) and `req.user`
//  * (our Mongo User document, created on first sight) to the request.
//  */
// export async function requireAuth(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization || '';
//     const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

//     if (!token) {
//       return res.status(401).json({ error: 'Missing bearer token' });
//     }

//     const { isSignedIn, toAuth } = await clerkClient.authenticateRequest(
//       new Request('https://placeholder.local', {
//         headers: { authorization: authHeader },
//       }),
//       { jwtKey: env.clerkJwtKey }
//     ).catch(async () => {
//       // Fallback: verify token directly if authenticateRequest's Request-based
//       // API isn't compatible with the runtime.
//       const claims = await clerkClient.verifyToken(token);
//       return { isSignedIn: true, toAuth: () => ({ userId: claims.sub, claims }) };
//     });

//     if (!isSignedIn) {
//       return res.status(401).json({ error: 'Invalid or expired session' });
//     }

//     const auth = toAuth();
//     req.auth = auth;

//     // Look up (or lazily create) the local user record tied to this Clerk user.
//     let user = await User.findOne({ clerkId: auth.userId });

//     if (!user) {
//       const clerkUser = await clerkClient.users.getUser(auth.userId);
//       const primaryEmail =
//         clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
//           ?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

//       user = await User.create({
//         clerkId: auth.userId,
//         email: primaryEmail,
//       });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('[auth] verification failed:', err.message);
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// }

// /**
//  * Lightweight guard for routes that just need to confirm the request
//  * carries a valid Stripe/Clerk webhook signature — no user attached.
//  */
// export function requireRawBody(req, res, next) {
//   if (!Buffer.isBuffer(req.body)) {
//     return res.status(400).json({ error: 'Raw body required for signature verification' });
//   }
//   next();
// }

import { createClerkClient, verifyToken } from '@clerk/backend';
import { env } from '../config/env.js';
import User from '../models/User.js';

const clerkClient = createClerkClient({
  secretKey: env.clerkSecretKey,
});

export async function requireAuth(req, res, next) {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization || '';

    console.log('[auth] Authorization header exists:', !!authHeader);

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing bearer token',
      });
    }

    // 2. Extract token
    const token = authHeader.slice(7);

    // 3. Verify Clerk token
    const claims = await verifyToken(token, {
      secretKey: env.clerkSecretKey,
    });

    console.log('[auth] Token verified');
    console.log('[auth] Clerk user:', claims.sub);

    // 4. Attach Clerk auth information
    req.auth = {
      userId: claims.sub,
      claims,
    };

    // 5. Find our local MongoDB user
    let user = await User.findOne({
      clerkId: claims.sub,
    });

    // 6. Create local user if they don't exist
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(claims.sub);

      const primaryEmail =
        clerkUser.emailAddresses.find(
          (email) =>
            email.id === clerkUser.primaryEmailAddressId
        )?.emailAddress ||
        clerkUser.emailAddresses[0]?.emailAddress;

      user = await User.create({
        clerkId: claims.sub,
        email: primaryEmail,
      });

      console.log('[auth] Created local user:', user._id);
    }

    // 7. Attach MongoDB user to request
    req.user = user;

    // 8. Continue
    next();
  } catch (err) {
    console.error('[auth] verification failed:', err);

    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
}

export function requireRawBody(req, res, next) {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).json({
      error: 'Raw body required for signature verification',
    });
  }

  next();
}