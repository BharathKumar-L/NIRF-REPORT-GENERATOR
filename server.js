const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// === UiPath Configurations ===
// Make sure the Queue "YearRequest" exists in your UiPath Orchestrator folder.
const QUEUE_NAME = 'YearRequest';
const UIPATH_URL = 'https://cloud.uipath.com/enterqpwogff/DefaultTenant/orchestrator_/odata/Queues/UiPathODataSvc.AddQueueItem';
const UIPATH_TOKEN ='rt_82C54078EB494544650BFCF95C457B4ED77B7B7C8247A3112E12E8CB8907304E-1'; // Personal Access Token
const UIPATH_FOLDER_ID = '175288'; // Folder ID of your Orchestrator folder

// === API Route to receive patient data ===
app.post('/api/year', async (req, res) => {
  const { year } = req.body;

  if (!year) {
    return res.status(400).send({ error: 'Year is required' });
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
