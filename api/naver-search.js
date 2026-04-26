// /api/naver-search.js
// Vercel Serverless Function - 네이버 검색 API 프록시

export default async function handler(req, res) {
  // CORS 헤더 (같은 도메인이지만 안전을 위해)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, type = 'news', display = 10, sort = 'sim' } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'query 파라미터가 필요합니다' });
  }

  // 허용된 검색 타입 (네이버 검색 API 카테고리)
  const allowedTypes = ['news', 'blog', 'webkr', 'cafearticle', 'encyc'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: `type은 ${allowedTypes.join(', ')} 중 하나여야 합니다` });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: '서버에 네이버 API 키가 설정되지 않았습니다' });
  }

  const encodedQuery = encodeURIComponent(query);
  const naverUrl = `https://openapi.naver.com/v1/search/${type}.json?query=${encodedQuery}&display=${display}&sort=${sort}`;

  try {
    const naverRes = await fetch(naverUrl, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!naverRes.ok) {
      const errText = await naverRes.text();
      return res.status(naverRes.status).json({
        error: '네이버 API 호출 실패',
        status: naverRes.status,
        detail: errText,
      });
    }

    const data = await naverRes.json();

    // 캐시 헤더 (같은 검색어 5분간 캐시)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: '서버 오류',
      message: err.message,
    });
  }
}
