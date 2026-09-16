const express = require('express');
const cors = require('cors');
const { getDirectUrl } = require('instagram-url-direct');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const mediaUrls = await getDirectUrl(url);
    
    if (!mediaUrls || mediaUrls.length === 0) {
      return res.status(404).json({ error: 'No media found at this URL' });
    }

    res.json({ 
      success: true, 
      media: mediaUrls.map(m => ({
        url: m.url,
        type: m.type,
        thumbnail: m.thumbnail
      }))
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download. The post may be private or deleted.' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.use(express.static('.'));
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;