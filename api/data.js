import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const voters = (await kv.get('voters')) || [];
      const submissionsRaw = (await kv.lrange('submissions', 0, -1)) || [];
      const submissions = submissionsRaw.map((s) => {
        // @vercel/kv may return objects already parsed or as strings depending on version
        if (typeof s === 'string') {
          try { return JSON.parse(s); } catch (e) { return null; }
        }
        return s;
      }).filter(Boolean);
      res.status(200).json({ voters, submissions });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      if (body.type === 'submission') {
        if (!body.id || !body.name || !body.ratings) {
          res.status(400).json({ ok: false, error: 'missing fields' });
          return;
        }
        await kv.rpush('submissions', JSON.stringify({ id: body.id, ratings: body.ratings }));

        const voters = (await kv.get('voters')) || [];
        if (!voters.includes(body.name)) {
          voters.push(body.name);
          await kv.set('voters', voters);
        }
        res.status(200).json({ ok: true });
        return;
      }
      res.status(400).json({ ok: false, error: 'unknown type' });
      return;
    }

    res.status(405).json({ ok: false, error: 'method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e && e.message ? e.message : e) });
  }
}
