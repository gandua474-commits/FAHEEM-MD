const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl", "tiktokdl"],
    desc: "Download TikTok video or photo slideshow",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a TikTok link.");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");

        if (react) await react(mek, "⏳");

        const apiUrl = `https://edith-apis.vercel.app/download/tiktok-v2?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.result?.data) {
            if (react) await react(mek, "❌");
            return reply("Failed to fetch TikTok data.");
        }

        const d = data.result.data;

        const author = d.author?.nickname || "Unknown";
        const username = d.author?.unique_id || "Unknown";
        const title = d.title || "No Title";
        const likes = d.digg_count || 0;
        const comments = d.comment_count || 0;
        const shares = d.share_count || 0;

        const images =
            d.images_hd ||
            d.images_original ||
            d.images ||
            [];

        if (Array.isArray(images) && images.length > 0) {

            const photoCaption =
`━━━ *TIKTOK DL* ━━━ 

  *» USER: ${author}* *(@${username})* 
  *» DATA: ${images.length} Photos* 
  *» ~STATUS~ : Success* 

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴀʜᴇᴇᴍ-ᴍᴅ* 👑`;

            for (const img of images) {
                await conn.sendMessage(from, {
                    image: { url: img },
                    caption: photoCaption
                }, { quoted: mek });
            }

            if (react) await react(mek, "✅");
            return;
        }

        const videoUrl = d.play || d.hdplay || d.wmplay;
        if (!videoUrl) {
            if (react) await react(mek, "❌");
            return reply("Video not found.");
        }

        const videoCaption =
`🎵 *TikTok Video* 🎵

👤 *User:* ${author} (@${username})
📖 *Title:* ${title}
👍 *Likes:* ${likes}
💬 *Comments:* ${comments}
🔁 *Shares:* ${shares}`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: videoCaption
        }, { quoted: mek });

        if (react) await react(mek, "✅");

    } catch (e) {
        console.error("TikTok Command Error:", e);
        if (react) await react(mek, "❌");
        reply("An error occurred while processing TikTok link.");
    }
});