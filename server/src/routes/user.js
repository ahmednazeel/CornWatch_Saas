// import { Router } from 'express';
// import { requireAuth } from '../middleware/auth.js';
// import Monitor from '../models/Monitor.js';
// import { PLAN_LIMITS } from '../config/env.js';

// const router = Router();

// router.use(requireAuth);

// // GET /api/me
// router.get('/', async (req, res, next) => {
//   try {
//     const monitorCount = await Monitor.countDocuments({ userId: req.user._id });
//     const limit = PLAN_LIMITS[req.user.plan] ?? PLAN_LIMITS.free;

//     res.json({
//       user: {
//         id: req.user._id,
//         email: req.user.email,
//         plan: req.user.plan,
//         subscriptionStatus: req.user.subscriptionStatus,
//       },
//       usage: {
//         monitors: monitorCount,
//         limit: limit === Infinity ? null : limit,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// export default router;

import { Router } from 'express';
import Monitor from '../models/Monitor.js';
import { requireAuth } from '../middleware/auth.js';
import { PLAN_LIMITS } from '../config/env.js';

const router = Router();

router.use(requireAuth);

// GET /api/me
router.get('/', async (req, res, next) => {
  try {
    const monitorCount = await Monitor.countDocuments({
      userId: req.user._id,
    });

    const limit = PLAN_LIMITS[req.user.plan] ?? PLAN_LIMITS.free;

    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        plan: req.user.plan,
        subscriptionStatus: req.user.subscriptionStatus,
      },
      usage: {
        monitors: monitorCount,
        limit: limit === Infinity ? null : limit,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
