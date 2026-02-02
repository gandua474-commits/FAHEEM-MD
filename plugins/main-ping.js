const config = require('../config');
const { cmd } = require('../command');

const botNameStyles = [
    const botNameStyles = [
    "𝘍𝘈𝘏𝘌𝘌𝘔-𝘔𝘋",
    "𝙁𝘼𝙃𝙀𝙀𝙈-𝙈𝘿",
    "🅵🅰🅷🅴🅴🅼-🅼🅳",
    "🄵🄰🄷🄴🄴🄼-🄼🄳",
    "𝔽𝔸ℍ𝔼𝔼𝕄-𝕄𝔻",
    "𝑭𝑨𝑯𝑬𝑬𝑴-𝑴𝑫",
    "ⒻⒶⒽⒺⒺⓂ-ⓂⒹ",
    "FAHEEM-MD",
    "ＦＡＨＥＥＭ-ＭＤ",
    "𝓕𝓐𝓗𝓔𝓔𝓜-𝓜𝓓"
];

let currentStyleIndex = 0;

cmd({
    pattern: "ping",
    alias: ["speed","pong"],
    react: "🌡️",
    filename: __filename
}, async (conn, mek, m, { from, sender }) => {
    const start = Date.now();

    const reactionEmojis = ['🔥','⚡','🚀','💨','🎯','🎉','🌟','💥','🕐','🔹'];
    const textEmojis = ['💎','🏆','⚡️','🚀','🎶','🌠','🌀','🔱','🛡️','✨'];

    let reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    if (textEmoji === reactionEmoji) textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

    await conn.sendMessage(from, { react: { text: textEmoji, key: mek.key } });

    const responseTime = Date.now() - start;
    const fancyBotName = botNameStyles[currentStyleIndex];
    currentStyleIndex = (currentStyleIndex + 1) % botNameStyles.length;

    await conn.sendMessage(from, { 
        text: `> *${fancyBotName} SPEED: ${responseTime}ms ${reactionEmoji}*`,
        contextInfo: { 
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '0029VbBDkMV05MUnspQOhf1A@newsletter',
                newsletterName: "FAHEEM-MD",
                serverMessageId: 143
            }
        } 
    }, { quoted: mek });
});

cmd({
    pattern: "ping2",
    react: "🍂",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    const start = Date.now();
    const msg = await conn.sendMessage(from, { text: '*PINGING...*' });
    const ping = Date.now() - start;
    await conn.sendMessage(from, { text: `*FAHEEM-MD SPEED: ${ping}ms*` }, { quoted: msg });
});