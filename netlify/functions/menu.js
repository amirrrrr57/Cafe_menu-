const { getStore } = require('@netlify/blobs');

function getMenuStore() {
  return getStore({
    name: 'cafe-menu',
    siteID: process.env.BLOBS_SITE_ID,
    token: process.env.BLOBS_TOKEN
  });
}

exports.handler = async (event) => {
  const store = getMenuStore();

  if (event.httpMethod === 'GET') {
    const data = await store.get('menu', { type: 'json' });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || null)
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      await store.setJSON('menu', body);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true })
      };
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

  return { statusCode: 405, body: 'Method not allowed' };
};
