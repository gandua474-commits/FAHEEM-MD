const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pindl",
    alias: ["pinterestdl", "pin", "pindownload"],
    desc: "Download Pinterest Image",
    category: "download",
    filename: __filename
}, async (conn, m, store, { args, from, reply }) => {
    try {
        if (!args[0]) return reply('❌ Pinterest link do');

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://api.nekolabs.web.id/downloader/pinterest?url=${encodeURIComponent(args[0])}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.success || !data.result || !data.result.medias) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply('❌ API response invalid');
        }

        const result = data.result;
        const media = result.medias.sort((a, b) => b.size - a.size)[0];

        if (!media || !media.url) return reply('❌ Image URL nahi mila');

        const style4 = `╭━〔 📥 PINTEREST DL 〕━╮

  💬 Title: ${result.title || 'Pinterest Image'}
  🖼️ Type: Image 📸
  ✨ Quality: ${media.quality}
  📊 Size: ${media.formattedSize}

╰━━━━━━━━━━━━━━━╯
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴅᴇᴇʟ-ᴍᴅ 👑`;

        const style5 = `💠 ━━ PINTEREST DL ━━ 💠

  [👤] Title: ${result.title || 'Pinterest Image'}
  [🎬] Type: Image 📸
  [🔥] Quality: ${media.quality}
  [💾] Size: ${media.formattedSize}

💠 ━━━━━━━━━━━━━━━━ 💠
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ғᴀʜᴇᴇᴍ-ᴍᴅ 👑`;

        const selectedCaption = Math.random() < 0.5 ? style4 : style5;

        await conn.sendMessage(from, { react: { text: '📥', key: m.key } });

        await conn.sendMessage(from, {
            image: { url: media.url },
            caption: selectedCaption
        }, { quoted: m });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('Pinterest Error:', err);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply('⚠️ Server error');
    }
});
