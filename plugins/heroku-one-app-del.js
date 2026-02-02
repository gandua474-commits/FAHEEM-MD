const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

// Your requested API Key
let HEROKU_API_KEY = "HRKU-AApIbQDixa3NgVLG-ol-07fsSMe7YEQjO59PJKcUYEfQ_____w-IpCbIwEWv";
const OWNER_NUMBER = "923337862496";

let HEROKU_APP_CACHE = {};

cmd({
    pattern: "hlist",
    desc: "List Heroku apps and delete by reply number(s)",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { sender, reply }) => {

    // Improved owner check to avoid "Owner only" error
    if (!sender.includes(OWNER_NUMBER)) return reply("❌ Error: Owner only command.");

    try {
        const res = await axios.get("https://api.heroku.com/apps", {
            headers: {
                Authorization: `Bearer ${HEROKU_API_KEY}`,
                Accept: "application/vnd.heroku+json; version=3"
            }
        });

        const apps = res.data;
        if (!apps.length) return reply("⚠️ No apps found in your Heroku account.");

        HEROKU_APP_CACHE[m.key.remoteJid] = apps;

        let msg = "🗂️ *HEROKU APP LIST*\n\n";
        apps.forEach((app, i) => {
            msg += `*${i + 1}* ➜ ${app.name}\n`;
        });

        msg += "\n📌 Reply to this message with app number(s) to delete.\n";
        msg += "✅ Examples: `1 3 5` or `1-2-3`";

        await conn.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m });

        const listener = async (update) => {
            const msgx = update.messages[0];
            if (!msgx.message || msgx.key.remoteJid !== m.key.remoteJid || msgx.key.fromMe) return;

            const text = msgx.message.conversation || msgx.message.extendedTextMessage?.text;
            if (!text) return;

            let numbers = text.split(/[\s,-]+/).map(n => parseInt(n)).filter(n => !isNaN(n));
            const list = HEROKU_APP_CACHE[m.key.remoteJid];
            
            if (!list || !numbers.length) return;

            numbers = numbers.filter(n => n >= 1 && n <= list.length);
            if (!numbers.length) return;

            conn.ev.off("messages.upsert", listener);

            let deletedApps = [];
            for (const i of numbers) {
                const app = list[i - 1];
                try {
                    await axios.delete(`https://api.heroku.com/apps/${app.id}`, {
                        headers: {
                            Authorization: `Bearer ${HEROKU_API_KEY}`,
                            Accept: "application/vnd.heroku+json; version=3"
                        }
                    });
                    deletedApps.push(app.name);
                } catch (err) {
                    console.error("Error deleting app:", app.name, err.message);
                }
            }

            delete HEROKU_APP_CACHE[m.key.remoteJid];

            reply(
                `✅ *Success:* Apps deleted successfully:\n\n` +
                deletedApps.map(a => `🗑️ ${a}`).join("\n")
            );
        };

        conn.ev.on("messages.upsert", listener);

    } catch (e) {
        console.error(e);
        reply("🚨 Failed to fetch or delete apps. Check your API key.");
    }
});

cmd({
    pattern: "hupdate",
    alias: ["hup"],
    desc: "Update Heroku API Key",
    category: "owner",
    use: ".hupdate <api_key>",
    filename: __filename
}, async (conn, mek, m, { sender, args, reply }) => {

    if (!sender.includes(OWNER_NUMBER)) return reply("❌ Error: Owner only command.");

    const newKey = args[0];
    if (!newKey) return reply("Usage: .hupdate YOUR_NEW_API_KEY");

    try {
        const filePath = __filename;
        let content = fs.readFileSync(filePath, "utf8");

        const keyRegex = /(let|const) HEROKU_API_KEY = ".*?";/;
        const updated = content.replace(keyRegex, `let HEROKU_API_KEY = "${newKey}";`);

        if (content === updated) return reply("⚠️ API key variable not found in code.");

        fs.writeFileSync(filePath, updated, "utf8");
        HEROKU_API_KEY = newKey;

        reply(
            "✅ *Success:* Heroku API key updated.\n\n" +
            "🔑 New Key: " + newKey.substring(0, 10) + "********\n\n" +
            "♻️ Applied successfully."
        );

    } catch (err) {
        console.error(err);
        reply("❌ Failed to update API key in file.");
    }
});
