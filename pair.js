const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { v4: makeid } = require('uuid'); 
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    fetchLatestBaileysVersion
} = require('baileys-pro'); // Using @whiskeysockets/baileys
require('dotenv').config(); // Load environment variables

// Environment variable for encryption key
const ENCRYPTION_KEY = process.env.SESSION_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Fallback for testing (not recommended for production)

// Simple in-memory rate limiter
const rateLimit = new Map();
const RATE_LIMIT_REQUESTS = 5; // Max requests per number
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

async function removeFile(filePath) {
    try {
        if (await fs.access(filePath).then(() => true).catch(() => false)) {
            await fs.rm(filePath, { recursive: true, force: true });
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

const router = express.Router();

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    // Rate limiting
    if (!num) {
        return res.status(400).send({ error: 'Phone number is required' });
    }
    num = num.replace(/[^0-9]/g, '');
    const rateKey = num;
    const now = Date.now();
    const userRequests = rateLimit.get(rateKey) || { count: 0, reset: now + RATE_LIMIT_WINDOW };
    if (userRequests.count >= RATE_LIMIT_REQUESTS && now < userRequests.reset) {
        return res.status(429).send({ error: 'Rate limit exceeded. Try again later.' });
    }
    rateLimit.set(rateKey, { count: userRequests.count + 1, reset: userRequests.reset });
    setTimeout(() => rateLimit.delete(rateKey), RATE_LIMIT_WINDOW);

    async function Toxic_MD_PAIR_CODE(attempt = 1, maxAttempts = 3) {
        const sessionPath = path.join(__dirname, 'temp', id);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        // Encrypt credentials before saving
        const originalSaveCreds = saveCreds;
        state.saveCreds = async () => {
            const credsPath = path.join(sessionPath, 'creds.json');
            const credsData = JSON.stringify(state.creds);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
            let encrypted = cipher.update(credsData, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            await fs.writeFile(credsPath, JSON.stringify({ iv: iv.toString('hex'), data: encrypted }));
            await originalSaveCreds();
        };

        // Decrypt credentials when loading
        const originalLoadCreds = state.loadCreds;
        state.loadCreds = async () => {
            const credsPath = path.join(sessionPath, 'creds.json');
            try {
                const encryptedData = await fs.readFile(credsPath, 'utf8');
                const { iv, data } = JSON.parse(encryptedData);
                const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
                let decrypted = decipher.update(data, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                state.creds = JSON.parse(decrypted);
            } catch {
                state.creds = {};
            }
            return originalLoadCreds ? originalLoadCreds() : state.creds;
        };

        try {
            // Fetch latest WhatsApp protocol version
            const { version } = await fetchLatestBaileysVersion();

            let Pair_Code_By_Toxic_Tech = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: [`Toxic-MD-${id.slice(0, 8)}`, 'Chrome', '1.0.0'],
                version,
            });

            if (!Pair_Code_By_Toxic_Tech.authState.creds.registered) {
                await delay(1000 + Math.random() * 500);
                const code = await Pair_Code_By_Toxic_Tech.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Toxic_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Toxic_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(5000);
                    const credsPath = path.join(sessionPath, 'creds.json');
                    let data = await fs.readFile(credsPath, 'utf8');
                    const { iv, data: encryptedData } = JSON.parse(data);
                    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
                    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    let b64data = Buffer.from(decrypted).toString('base64');

                    // Upload to Pastebin
 Ques
                    const pasteUrl = await pastebin.createPaste({
                        text: b64data,
                        title: `Toxic-MD Session ${id}`,
                        format: 'json',
                        privacy: 2,
                        expiration: '1D',
                    });

                    let Toxic_MD_TEXT = `
        𝙎𝙀𝙎𝙎𝙄𝙊𝙎𝙎𝙄𝙊𝙉 𝘾𝙊𝙅𝙅𝙀𝘾𝙏𝙀𝘿
        
         𝙏𝙤𝙭𝙞𝙘-𝙈𝘿 𝙇𝙤𝙜𝙜𝙚𝙙  

『••• 𝗦𝗲𝘀𝘀𝗶𝗼𝗻 𝗗𝗮𝘁𝗮 •••』
> **Session ID**: ${id}
> **Credentials**: ${pasteUrl}

『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
> 𝐎𝐰𝐧𝐞𝐫: 
_https://wa.me/254735342808_

> 𝐑𝐞𝐩𝐨: 
_https://github.com/xhclintohn/Toxic-v2_

> 𝐖𝐚𝐆𝐫𝐨𝐮𝐩: 
_https://chat.whatsapp.com/GoXKLVJgTAAC3556FXkfFI_

> 𝐖𝐚𝐂𝐡𝐚𝐧𝐧𝐞𝐥:
 _https://whatsapp.com/channel/0029VagJlnG6xCSU2tS1Vz19_
 
> 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦:
 _https://www.instagram.com/xh_clinton_

Don't Forget To Give Star and fork My Repo :)`;

                    await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: Toxic_MD_TEXT });

                    await delay(100 + Math.random() * 50);
                    await Pair_Code_By_Toxic_Tech.ws.close();
                    await removeFile(sessionPath);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    if (attempt < maxAttempts) {
                        const backoffDelay = Math.min(10000 * Math.pow(2, attempt), 60000);
                        await delay(backoffDelay + Math.random() * 100);
                        Toxic_MD_PAIR_CODE(attempt + 1, maxAttempts);
                    } else {
                        await removeFile(sessionPath);
                        if (!res.headersSent) {
                            await res.send({ error: 'Max reconnection attempts reached' });
                        }
                    }
                }
            });
        } catch (err) {
            await removeFile(sessionPath);
            if (!res.headersSent) {
                await res.send({ error: 'Service Currently Unavailable' });
            }
        }
    }

    return await Toxic_MD_PAIR_CODE();
});

module.exports = router;
