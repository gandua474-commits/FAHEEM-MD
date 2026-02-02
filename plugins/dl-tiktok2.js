const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "tt2",
  alias: ["tiktok2", "ttdl2"],
  desc: "Direct TikTok Video Downloader",
  react: "📥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, args, reply, react }) => {
  try {
    const url = args[0];
    if (!url) return reply("❌ Please provide a TikTok URL.");
    if (!url.includes("tiktok.com")) return reply("❌ Invalid TikTok link.");

    // ⏳ Processing reaction
    if (react) await react(m, "⏳");

    const response = await fetch(
      `https://api.nekolabs.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      if (react) await react(m, "❌");
      throw new Error("API Connection Failed");
    }

    const data = await response.json();

    if (!data.success || !data.result) {
      if (react) await react(m, "❌");
      return reply("❌ Could not fetch the video.");
    }

    const res = data.result;

    const caption =
`🎬 *TIKTOK DOWNLOADER* 🎬

📌 *Title:* ${res.title || 'No Title'}
👤 *Author:* ${res.author?.name || 'Unknown'}

📊 *STATISTICS*
❤️ Likes: ${res.stats?.like?.toLocaleString() || 0}
💬 Comments: ${res.stats?.comment?.toLocaleString() || 0}
🔄 Shares: ${res.stats?.share?.toLocaleString() || 0}

✨ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴀʜᴇᴇᴍ-ᴍᴅ*`;

    await conn.sendMessage(from, {
      video: { url: res.videoUrl },
      caption,
      mimetype: "video/mp4",
      fileName: `${res.title || "tiktok"}.mp4`
    }, { quoted: m });

    // ✅ Done reaction
    if (react) await react(m, "✅");

  } catch (e) {
    console.error("TikTok Error:", e);
    if (react) await react(m, "❌");
    reply("❌ Something went wrong. Please try again later.");
  }
});