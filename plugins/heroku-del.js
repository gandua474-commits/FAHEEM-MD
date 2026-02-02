const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

// Updated to 'let' for real-time memory updates
let HEROKU_API_KEY = "HRKU-AAM9xlMMHemaQzRA_2lz02fsSMe7YEQjO59PJKcUYEfQ_____w1HKzdkhEo1";
const OWNER_NUMBER = "923337862496"; 

// --- 1. HEROKU APP DELETER COMMAND ---
cmd({
    pattern: "herokudel",
    desc: "Stylish Heroku App Deleter",
    use: ".herokudel",
    filename: __filename
}, async (conn, mek, m, { sender, reply }) => {

    if (!sender.includes(OWNER_NUMBER)) 
        return reply("✨ *「 ACCESS DENIED 」*\n\n❌ Only the owner can use this command.");

    try {
        // Updated stylish loading message
        await reply("⚡ *Connecting to Heroku...*");

        const teamRes = await axios.get("https://api.heroku.com/teams", {
            headers: {
                Authorization: `Bearer ${HEROKU_API_KEY}`,
                Accept: "application/vnd.heroku+json; version=3"
            }
        });

        const teams = teamRes.data;
        let options = [];
        options.push({ id: "personal", display: "PERSONAL ACCOUNT (PRIVATE)" });

        teams.forEach((team) => {
            options.push({ id: team.name, display: `TEAM: ${team.name.toUpperCase()}` });
        });

        let menuMsg = "╭─────────────────────╮\n";
        menuMsg += "│   🚀 *HEROKU MANAGER* │\n";
        menuMsg += "╰─────────────────────╯\n\n";
        menuMsg += "👋 *Hello Sir,* select the storage area you want to clean up:\n\n";
        
        options.forEach((opt, index) => {
            menuMsg += `*${index + 1}* ➢ ${opt.display}\n`;
        });
        
        menuMsg += `\n─────────────────────\n`;
        menuMsg += `💬 *Reply with a number (1-${options.length})* to confirm deletion.`;

        await conn.sendMessage(m.key.remoteJid, { text: menuMsg }, { quoted: m });

        const listener = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || msg.key.remoteJid !== m.key.remoteJid || msg.key.fromMe) return;

            const input = msg.message.conversation || msg.message.extendedTextMessage?.text;
            const selectedNumber = parseInt(input);

            if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > options.length) return;

            conn.ev.off('messages.upsert', listener);

            const selected = options[selectedNumber - 1];
            let apiUrl = selected.id === "personal" 
                ? "https://api.heroku.com/apps" 
                : `https://api.heroku.com/teams/${selected.id}/apps`;

            await reply(`⚙️ *Processing:* Wiping all apps from *${selected.display}*...`);

            const appsRes = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${HEROKU_API_KEY}`,
                    Accept: "application/vnd.heroku+json; version=3"
                }
            });

            const apps = appsRes.data;
            if (!apps.length) return reply(`⚠️ *Empty:* No apps found in this section.`);

            let deletedApps = [];
            for (const app of apps) {
                await axios.delete(`https://api.heroku.com/apps/${app.id}`, {
                    headers: {
                        Authorization: `Bearer ${HEROKU_API_KEY}`,
                        Accept: "application/vnd.heroku+json; version=3"
                    }
                });
                deletedApps.push(app.name);
            }

            let successMsg = "┏━━━━━━━━━━━━━━━━━━━━┓\n";
            successMsg += "┃   💥 *DELETION SUCCESS* ┃\n";
            successMsg += "┗━━━━━━━━━━━━━━━━━━━━┛\n\n";
            successMsg += `📍 *Source:* ${selected.display}\n`;
            successMsg += `🗑️ *Total Removed:* ${deletedApps.length} Apps\n\n`;
            successMsg += "📜 *List of Deleted Apps:*\n";
            successMsg += `> ${deletedApps.join("\n> ")}\n\n`;
            successMsg += "✨ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴅᴇᴇʟ-ᴍᴅ*";

            await reply(successMsg);
        };

        conn.ev.on('messages.upsert', listener);

    } catch (error) {
        console.error(error);
        reply("🚨 *ERROR:* Check if your API Key is valid.");
    }
});

// --- 2. HEROKU API KEY CHANGE (FIXED) ---

cmd({
    pattern: "setapikey",
    desc: "Update Heroku API Key and save it permanently.",
    category: "owner",
    use: ".setapikey <new_key>",
    filename: __filename
}, async (conn, mek, m, { sender, args, reply }) => {

    if (!sender.includes(OWNER_NUMBER)) 
        return reply("✨ *「 ACCESS DENIED 」*");

    const newKey = args[0];
    if (!newKey) return reply("📝 *Usage:* `.setapikey YOUR_NEW_KEY` ");

    try {
        const filePath = __filename;
        let content = fs.readFileSync(filePath, "utf8");

        const keyRegex = /(let|const) HEROKU_API_KEY = ".*?";/;
        const updatedContent = content.replace(keyRegex, `let HEROKU_API_KEY = "${newKey}";`);

        if (content === updatedContent) {
            return reply("⚠️ *Error:* API Key variable not found in the file.");
        }

        fs.writeFileSync(filePath, updatedContent, "utf8");

        // Instant Update in Memory
        HEROKU_API_KEY = newKey; 

        let successMsg = "┏━━━━━━━━━━━━━━━━━━━━┓\n";
        successMsg += "┃   ⚙️  *SYSTEM UPDATED* ┃\n";
        successMsg += "┗━━━━━━━━━━━━━━━━━━━━┛\n\n";
        successMsg += "✅ *API Key Saved & Applied!*\n\n";
        successMsg += `🔑 *New Key:* \`${newKey.substring(0, 10)}**********\`\n\n`;
        successMsg += "─────────────────────\n";
        successMsg += "🚀 *Status:* Key is active now. Ready to use without restart.\n\n";
        successMsg += "✨ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴅᴇᴇʟ-ᴍᴅ*";

        await reply(successMsg);

    } catch (error) {
        console.error(error);
        reply("❌ *Failed:* Could not update the key.");
    }
});
