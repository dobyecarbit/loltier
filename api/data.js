import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const raw = (await kv.lrange('submissions_anon', 0, -1)) || [];
      const submissions = raw.map((v) => {
        let parsed = v;
        if (typeof v === 'string') {
          try { parsed = JSON.parse(v); } catch (e) { parsed = null; }
        }
        return parsed ? { ratings: parsed } : null;
      }).filter(Boolean);
      res.status(200).json({ submissions, count: submissions.length });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      if (body.type === 'submission') {
        if (!body.ratings) {
          res.status(400).json({ ok: false, error: 'missing fields' });
          return;
        }
        // 완전 익명: 누가 제출했는지 서버도 저장하지 않음. 매 제출은 새 항목으로 추가됨.
        await kv.rpush('submissions_anon', JSON.stringify(body.ratings));
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
