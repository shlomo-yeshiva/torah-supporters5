/**
 * Netlify Function - Proxy לגישה ל-Google Apps Script
 * פותר בעיית CORS - הבקשות יוצאות מהשרת ולא מהדפדפן
 */
exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const url = event.queryStringParameters?.url;
    const action = event.queryStringParameters?.action || 'getAll';

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing url parameter' })
      };
    }

    const baseUrl = decodeURIComponent(url);
    const sep = baseUrl.includes('?') ? '&' : '?';
    const targetUrl = baseUrl + sep + 'action=' + action;
    const res = await fetch(targetUrl);
    const data = await res.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error('sheets-proxy error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
