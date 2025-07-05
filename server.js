const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/fetch", (req, res) => {
  const url = req.body.url;
  if (!url) return res.json({ error: "No URL provided" });

  const command = `yt-dlp -j --cookies cookies.txt "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) return res.json({ error: "Download failed: " + stderr });

    try {
      const result = JSON.parse(stdout);
      const episodes = result.entries || [result];

      const links = episodes.map(ep => ({
        title: ep.title,
        url: ep.url || ep.original_url
      }));

      res.json({ episodes: links });
    } catch (err) {
      res.json({ error: "Failed to parse result" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
