// /api/naver-stock.js
// 네이버 금융에서 한국 주식 시세 가져오기

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'code 파라미터가 필요합니다 (예: 005930)' });
  }

  // 종목코드 형식 검증 (6자리 숫자)
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: '종목코드는 6자리 숫자여야 합니다' });
  }

  const naverUrl = `https://polling.finance.naver.com/api/realtime/domestic/stock/${code}`;

  try {
    const naverRes = await fetch(naverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LENZ/1.0)',
        'Referer': 'https://finance.naver.com/',
      },
    });

    if (!naverRes.ok) {
      return res.status(naverRes.status).json({
        error: '네이버 금융 호출 실패',
        status: naverRes.status,
      });
    }

    const data = await naverRes.json();

    // 네이버 응답 구조에서 필요한 필드만 추출
    const stockData = data?.datas?.[0];

    if (!stockData) {
      return res.status(404).json({ error: '해당 종목 데이터를 찾을 수 없습니다' });
    }

    const result = {
      code: stockData.itemCode,
      name: stockData.stockName,
      price: stockData.closePrice,           // 현재가
      change: stockData.compareToPreviousClosePrice,  // 전일대비
      changeRate: stockData.fluctuationsRatio,        // 등락률 (%)
      changeType: stockData.compareToPreviousPrice?.code,  // 1: 상승, 2: 상한, 3: 보합, 4: 침체, 5: 하한
      open: stockData.openPrice,
      high: stockData.highPrice,
      low: stockData.lowPrice,
      volume: stockData.accumulatedTradingVolume,
      marketCap: stockData.marketValue,      // 시가총액 (억원)
      timestamp: stockData.localTradedAt,
    };

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      error: '서버 오류',
      message: err.message,
    });
  }
}
