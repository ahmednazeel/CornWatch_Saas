// import { Router } from 'express';
// import mongoose from 'mongoose';
// import Monitor from '../models/Monitor.js';
// import CheckLog from '../models/CheckLog.js';
// import { requireAuth } from '../middleware/auth.js';
// import { enforceMonitorLimit } from '../middleware/planGate.js';
// import parser from 'cron-parser';

// const router = Router();

// router.use(requireAuth);

// function isValidObjectId(id) {
//   return mongoose.Types.ObjectId.isValid(id);
// }

// function validateMonitorPayload(body, { partial = false } = {}) {
//   const errors = [];
//   const allowed = {};

//   if (!partial || body.name !== undefined) {
//     if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
//       errors.push('name is required');
//     } else {
//       allowed.name = body.name.trim();
//     }
//   }

//   if (!partial || body.url !== undefined) {
//     try {
//       const u = new URL(body.url);
//       if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
//       allowed.url = body.url;
//     } catch {
//       errors.push('url must be a valid http(s) URL');
//     }
//   }

//   if (!partial || body.schedule !== undefined) {
//     try {
//       parser.parseExpression(body.schedule);
//       allowed.schedule = body.schedule;
//     } catch {
//       errors.push('schedule must be a valid cron expression');
//     }
//   }

//   if (body.gracePeriod !== undefined) {
//     const g = Number(body.gracePeriod);
//     if (Number.isNaN(g) || g < 0) errors.push('gracePeriod must be a non-negative number');
//     else allowed.gracePeriod = g;
//   }

//   if (body.timezone !== undefined) allowed.timezone = body.timezone;
//   if (body.alertChannels !== undefined) allowed.alertChannels = body.alertChannels;
//   if (body.isActive !== undefined) allowed.isActive = Boolean(body.isActive);

//   return { errors, data: allowed };
// }

// // GET /api/monitors
// router.get('/', async (req, res, next) => {
//   try {
//     const monitors = await Monitor.find({ userId: req.user._id }).sort({ createdAt: -1 });
//     res.json({ monitors });
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/monitors/:id
// router.get('/:id', async (req, res, next) => {
//   try {
//     if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });

//     const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user._id });
//     if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

//     res.json({ monitor });
//   } catch (err) {
//     next(err);
//   }
// });

// // POST /api/monitors
// router.post('/', enforceMonitorLimit, async (req, res, next) => {
//   try {
//     const { errors, data } = validateMonitorPayload(req.body);
//     if (errors.length) return res.status(400).json({ errors });

//     const monitor = await Monitor.create({
//       ...data,
//       userId: req.user._id,
//     });

//     res.status(201).json({ monitor });
//   } catch (err) {
//     next(err);
//   }
// });

// // PUT /api/monitors/:id
// router.put('/:id', async (req, res, next) => {
//   try {
//     if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });

//     const { errors, data } = validateMonitorPayload(req.body, { partial: true });
//     if (errors.length) return res.status(400).json({ errors });

//     const monitor = await Monitor.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       { $set: data },
//       { new: true, runValidators: true }
//     );

//     if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

//     res.json({ monitor });
//   } catch (err) {
//     next(err);
//   }
// });

// // DELETE /api/monitors/:id
// router.delete('/:id', async (req, res, next) => {
//   try {
//     if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });

//     const monitor = await Monitor.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
//     if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

//     await CheckLog.deleteMany({ monitorId: monitor._id });

//     res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/monitors/:id/logs?limit=50&before=<ISO date>
// router.get('/:id/logs', async (req, res, next) => {
//   try {
//     if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });

//     const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user._id }).select('_id');
//     if (!monitor) return res.status(404).json({ error: 'Monitor not found' });

//     const limit = Math.min(Number(req.query.limit) || 50, 500);
//     const filter = { monitorId: monitor._id };
//     if (req.query.before) {
//       filter.checkedAt = { $lt: new Date(req.query.before) };
//     }

//     const logs = await CheckLog.find(filter).sort({ checkedAt: -1 }).limit(limit);

//     res.json({ logs });
//   } catch (err) {
//     next(err);
//   }
// });

// export default router;
import { Router } from 'express';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';
import net from 'node:net';
import parser from 'cron-parser';

import Monitor from '../models/Monitor.js';
import CheckLog from '../models/CheckLog.js';
import { requireAuth } from '../middleware/auth.js';
import { enforceMonitorLimit } from '../middleware/planGate.js';

const router = Router();

router.use(requireAuth);

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// async function isSafeUrl(value) {
//   try {
//     const url = new URL(value);

//     if (!['http:', 'https:'].includes(url.protocol)) {
//       return false;
//     }

//     const hostname = url.hostname.toLowerCase();

//     if (
//       hostname === 'localhost' ||
//       hostname.endsWith('.localhost') ||
//       hostname.endsWith('.local')
//     ) {
//       return false;
//     }

//     // Direct IP address.
//     if (net.isIP(hostname)) {
//       return !isPrivateIp(hostname);
//     }

//     // Resolve the hostname and make sure it does not point
//     // to a private/internal address.
//     const addresses = await dns.lookup(hostname, { all: true });

//     if (!addresses.length) {
//       return false;
//     }

//     return addresses.every(({ address }) => !isPrivateIp(address));
//   } catch {
//     return false;
//   }
// }


async function isSafeUrl(value) {
  try {
    const url = new URL(value);

    console.log('[url] parsed:', url.href);
    console.log('[url] protocol:', url.protocol);

    if (!['http:', 'https:'].includes(url.protocol)) {
      console.log('[url] rejected: protocol');
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    console.log('[url] hostname:', hostname);

    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local')
    ) {
      console.log('[url] rejected: localhost/local');
      return false;
    }

    // Direct IP address
    if (net.isIP(hostname)) {
      const safe = !isPrivateIp(hostname);

      console.log('[url] IP address:', hostname);
      console.log('[url] private:', !safe);

      return safe;
    }

    // Resolve hostname
    const addresses = await dns.lookup(hostname, {
      all: true,
    });

    console.log('[url] DNS addresses:', addresses);

    if (!addresses.length) {
      console.log('[url] rejected: no DNS addresses');
      return false;
    }

    const safe = addresses.every(
      ({ address }) => !isPrivateIp(address)
    );

    console.log('[url] final result:', safe);

    return safe;
  } catch (err) {
    console.error('[url] validation error:', err);
    return false;
  }
}



function isPrivateIp(ip) {
  const version = net.isIP(ip);

  if (version === 4) {
    const [a, b, c, d] = ip.split('.').map(Number);

    return (
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 0) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }

  if (version === 6) {
    const normalized = ip.toLowerCase();

    return (
      normalized === '::1' ||
      normalized === '::' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb') ||
      normalized.startsWith('::ffff:127.') ||
      normalized.startsWith('::ffff:10.') ||
      normalized.startsWith('::ffff:192.168.') ||
      normalized.startsWith('::ffff:172.')
    );
  }

  return true;
}

async function validateMonitorPayload(body, { partial = false } = {}) {
  const errors = [];
  const data = {};

  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim())
      errors.push('name is required');
     else data.name = body.name.trim();
  }

  if (!partial || body.url !== undefined) {
    if (typeof body.url !== 'string' || !(await isSafeUrl(body.url)) ) 
      errors.push('url must be a valid public http(s) URL'); 
    else data.url = body.url.trim();
  }

  if (!partial || body.schedule !== undefined) {
    try {
      parser.parseExpression(body.schedule);
      data.schedule = body.schedule;
    } catch {
      errors.push('schedule must be a valid cron expression');
    }
  }

  if (body.gracePeriod !== undefined) {
    const gracePeriod = Number(body.gracePeriod);
    if (Number.isNaN(gracePeriod) || gracePeriod < 0) 
      errors.push('gracePeriod must be a non-negative number');
    else 
      data.gracePeriod = gracePeriod;
  }

  if (body.timezone !== undefined) 
    data.timezone = body.timezone;
  

  if (body.alertChannels !== undefined) 
    data.alertChannels = body.alertChannels;
  

  if (body.isActive !== undefined) 
    data.isActive = Boolean(body.isActive);
  

  return { errors, data };
}

// GET /api/monitors
router.get('/', async (req, res, next) => {
  try {
    const monitors = await Monitor.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ monitors });
  } catch (err) {
    next(err);
  }
});

// GET /api/monitors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const monitor = await Monitor.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!monitor) {
      return res.status(404).json({
        error: 'Monitor not found',
      });
    }

    res.json({ monitor });
  } catch (err) {
    next(err);
  }
});

// POST /api/monitors
router.post('/', enforceMonitorLimit, async (req, res, next) => {
  try {
    const { errors, data } = await validateMonitorPayload(req.body);
    console.log(req.body)
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const monitor = await Monitor.create({
      ...data,
      userId: req.user._id,
    });

    res.status(201).json({ monitor });
  } catch (err) {
    next(err);
  }
});

// PUT /api/monitors/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const { errors, data } = await validateMonitorPayload(
      req.body,
      { partial: true }
    );

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!monitor) {
      return res.status(404).json({
        error: 'Monitor not found',
      });
    }

    res.json({ monitor });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/monitors/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const monitor = await Monitor.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!monitor) {
      return res.status(404).json({
        error: 'Monitor not found',
      });
    }

    await CheckLog.deleteMany({
      monitorId: monitor._id,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/monitors/:id/logs
router.get('/:id/logs', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const monitor = await Monitor.findOne({
      _id: id,
      userId: req.user._id,
    }).select('_id');

    if (!monitor) {
      return res.status(404).json({
        error: 'Monitor not found',
      });
    }

    const limit = Math.min(
      Number(req.query.limit) || 50,
      500
    );

    const filter = {
      monitorId: monitor._id,
    };

    if (req.query.before) {
      filter.checkedAt = {
        $lt: new Date(req.query.before),
      };
    }

    const logs = await CheckLog.find(filter)
      .sort({ checkedAt: -1 })
      .limit(limit);

    res.json({ logs });
  } catch (err) {
    next(err);
  }
});

export default router;