const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: Toxic_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('baileys-pro');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function Toxic_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Toxic_Tech = Toxic_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });

            if (!Pair_Code_By_Toxic_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                // Validate phone number
                if (!num || num.length < 10 || num.length > 15) {
                    console.log(`Invalid phone number: ${num}`);
                    if (!res.headersSent) {
                        await res.send({ code: 'Invalid phone number. Please provide a valid number in international format (e.g., +1234567890).' });
                    }
                    return;
                }

                // Retry mechanism for pairing code
                let code;
                let attempts = 0;
                const maxAttempts = 3;
                while (attempts < maxAttempts) {
                    try {
                        console.log(`Attempt ${attempts + 1} to request pairing code for ${num}`);
                        code = await Pair_Code_By_Toxic_Tech.requestPairingCode(num);
                        console.log(`Pairing code generated: ${code}`);
                        break;
                    } catch (err) {
                        attempts++;
                        console.error(`Pairing code request failed (attempt ${attempts}):`, err);
                        if (attempts >= maxAttempts) {
                            if (!res.headersSent) {
                                await res.send({ code: 'Failed to generate pairing code after multiple attempts. Please try again later.' });
                            }
                            return;
                        }
                        await delay(2000);
                    }
                }

                if (code && !res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Toxic_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Toxic_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(50000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(8000);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: '' + b64data });

                    let Toxic_MD_TEXT = `
◈━━━━━━━━━━━◈
│❒ 𝙎𝙀𝙎𝙎𝙄𝙊𝙉 𝘾𝙊𝙉𝙉𝙀𝘾𝙏𝙀𝘿
│❒ The long code above is your **Session ID**. Please copy and store it safely, as you'll need it to deploy your Toxic-MD bot! 🔐
│❒ 𝙏𝙤𝙭𝙞𝙘-𝙈𝘿 𝙇𝙤𝙜𝙜𝙚𝙙 ✅
│❒
│❒ Need help? Reach out to us:
『••• �_V𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
> 𝐎𝐰𝐧𝐞𝐫: _https://wa.me/254735342808_
> 𝐑𝐞𝐩𝐨: _https://github.com/xhclintohn/Toxic-v2_
> 𝐖𝐚𝐆𝐫𝐨𝐮𝐩: _https://chat.whatsapp.com/GoXKLVJgTAAC3556FXkfFI_
> 𝐖𝐚𝐂𝐡𝐚𝐧𝐧𝐞𝐥: _https://whatsapp.com/channel/0029VagJlnG6xCSU2tS1Vz19_
> 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦: _https://www.instagram.com/xh_clinton_
│❒
│❒ Don't forget to give a ⭐ to our repo and fork it to stay updated! :)
◈━━━━━━━━━━━◈`;

                    await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: Toxic_MD_TEXT }, { quoted: session });

                    await delay(100);
                    await Pair_Code_By_Toxic_Tech.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    console.log(`Connection closed with error: ${lastDisconnect.error?.message}`);
                    await delay(10000);
                    Toxic_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log('Service error:', err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }
    
    return await Toxic_MD_PAIR_CODE();
});

module.exports = router;
