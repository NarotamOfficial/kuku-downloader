const express = require('express');
const { exec } = require('child_process');
const ytdlp = require('yt-dlp-exec');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/fetch', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const result = await ytdlp(url, {
      dumpSingleJson: true,
      referer: 'https://www.kukufm.com',
      cookies: './cookies.txt',
      noWarnings: true,
      noCheckCertificate: true
    });

    const episodes = result.entries?.map((ep) => ({
      title: ep.title,
      url: ep.url || ep.original_url || ep.webpage_url
    })) || [{
      title: result.title,
      url: result.url || result.original_url || result.webpage_url
    }];

    res.json({ episodes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "yt-dlp failed to fetch. Check cookies or link." });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Kuku Downloader Backend is Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
