import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const hash = (await kv.hgetall('submissions')) || {};
      const submissions = Object.values(hash).map((v) => {
        if (typeof v === 'string') {
          try { return JSON.parse(v); } catch (e) { return null; }
        }
        return v; // already-parsed object case
      }).filter(Boolean);
      const voters = Object.keys(hash);
      res.status(200).json({ voters, submissions });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      if (body.type === 'submission') {
        if (!body.name || !body.ratings) {
          res.status(400).json({ ok: false, error: 'missing fields' });
          return;
        }
        // 이름을 key로 저장하므로, 같은 이름으로 다시 제출하면 이전 답변을 덮어씀
        await kv.hset('submissions', { [body.name]: JSON.stringify(body.ratings) });
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
