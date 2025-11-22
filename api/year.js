const axios = require('axios');

module.exports = async (req, res) => {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'API reachable. Use POST to submit a year.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { year } = req.body || {};
  if (!year) {
    return res.status(400).json({ error: 'Year is required' });
  }

  const QUEUE_NAME = process.env.QUEUE_NAME || 'YearRequest';
  const UIPATH_URL = process.env.UIPATH_URL;
  const UIPATH_TOKEN = process.env.UIPATH_TOKEN;
  const UIPATH_FOLDER_ID = process.env.UIPATH_FOLDER_ID;

  if (!UIPATH_URL || !UIPATH_TOKEN || !UIPATH_FOLDER_ID) {
    console.error('Missing UiPath configuration environment variables');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    await axios.post(
      UIPATH_URL,
      {
        itemData: {
          Name: QUEUE_NAME,
          Priority: 'Normal',
          SpecificContent: { Year: year }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${UIPATH_TOKEN}`,
          'X-UIPATH-OrganizationUnitId': UIPATH_FOLDER_ID,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`Year submitted to Queue: ${year}`);
    return res.status(200).json({ success: true, message: 'Year submitted successfully' });
  } catch (err) {
    console.error('Error pushing to UiPath:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to push to UiPath Queue' });
  }
};
