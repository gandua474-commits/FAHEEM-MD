const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

cmd({
  on: "body"
},
async (conn, mek, m, { from, body }) => {
    const filePath = path.join(__dirname, '../assets/autosticker.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (config.AUTO_STICKER === 'true') {
                const stickerPath = path.join(__dirname, '../assets/autosticker', data[text]);

                if (fs.existsSync(stickerPath)) {
                    const stickerBuffer = fs.readFileSync(stickerPath);

                    await conn.sendMessage(from, {
                        sticker: stickerBuffer,
                        packname: ' ꜛ-🫂❤‍🩹⏤͟͟͞͞᚜ု᪳₀͞₃₃ᷫᷫ₃ᷧᷧ₇ͪͪ₈ͤͤ₆ͤͤ₂ᷟᷟ₄₉͞₆ှ᪳᚛͟͞⏤💍

             *👀🙈'³𝐈✞'s-👅*
*‹✯›⃔:᚜ု᪳ 𒁍⃝ꄘɑ᪳͢卄ɛ̽͜ɛ̽͜爪↰⁴͢⁹͢⁶ှ᪳᚛:⃕‹✯›*

   🌎🍿────🐼🐣',
                        author: 'AUTO-STICKER'
                    }, { quoted: mek });
                } else {
                    console.warn(`Sticker not found: ${stickerPath}`);
                }
            }
        }
    }
});
