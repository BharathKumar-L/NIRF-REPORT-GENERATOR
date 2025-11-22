const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// === UiPath Configurations (use environment variables) ===
// Set these in production (Vercel Environment Variables) or locally via a .env file
const QUEUE_NAME = process.env.QUEUE_NAME || 'YearRequest';
const UIPATH_URL = process.env.UIPATH_URL || 'https://cloud.uipath.com/enterqpwogff/DefaultTenant/orchestrator_/odata/Queues/UiPathODataSvc.AddQueueItem';
const UIPATH_TOKEN = process.env.UIPATH_TOKEN || ''; // Personal Access Token (REPLACE via env vars)
const UIPATH_FOLDER_ID = process.env.UIPATH_FOLDER_ID || '';

// === API Route to receive patient data ===
app.post('/api/year', async (req, res) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).send({ error: 'Year is required' });
  }

  if (!UIPATH_TOKEN || !UIPATH_FOLDER_ID) {
    console.error('⚠️ Missing UIPATH_TOKEN or UIPATH_FOLDER_ID environment variables');
    return res.status(500).send({ error: 'Server misconfigured (missing secrets)' });
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

    console.log(`🟢 Year submitted to Queue: ${year}`);
    res.status(200).send({ success: true, message: 'Year submitted successfully!' });

  } catch (err) {
    console.error('🔥 Error:', err.response?.data || err.message);
    res.status(500).send({ error: 'Failed to push to UiPath Queue' });
  }
});

// === Start the server ===
app.listen(3000, () => console.log('🚀 NIRF REPORT Server running on http://localhost:3000'));
