const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const QUEUE_NAME = process.env.QUEUE_NAME;
const UIPATH_URL = 'https://cloud.uipath.com/enterqpwogff/DefaultTenant/orchestrator_/odata/Queues/UiPathODataSvc.AddQueueItem';
const UIPATH_TOKEN = process.env.UIPATH_TOKEN; 
const UIPATH_FOLDER_ID = process.env.UIPATH_FOLDER_ID; 

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

app.listen(process.env.PORT || 3000, () => console.log('🚀 NIRF REPORT Server running on http://localhost:3000'));
