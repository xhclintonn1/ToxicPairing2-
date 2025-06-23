const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs').promises; // Built-in Node.js module
const path = require('path'); // Built-in Node.js module
const pino = require('pino');
const {
    default: makeWASocket,
    useSingleFileAuthState,
    delay,
    fetchLatestBaileysVersion
} = require('baileys');
const NodeCache = require('node-cache');

const msgRetryCounterCache = new NodeCache();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
    return true;
}

const router = express.Router();

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function Toxic_MD_PAIR_CODE() {
        const sessionPath = path.join(__dirname, 'temp', id, 'creds.json');
        const { state, saveState } = useSingleFileAuthState(sessionPath);
        try {
            const { version } = await fetchLatestBaileysVersion();

            const connectionOptions = {
                logger: pino({ level: "silent" }),
                version,
                browser: ["Ubuntu", "Chrome", "20.0.04"],
                printQRInTerminal: false,
                auth: state,
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 0,
                isLatest: true,
                keepAliveIntervalMs: 10000,
                markOnlineOnConnect: true,
                msgRetryCounterCache,
                msgRetryCounterMap: {},
                generateHighQualityLinkPreview: true,
                getMessage: async key => {
                    return proto.Message.fromObject({});
                },
                patchMessageBeforeSending: message => {
                    const requiresPatch = !!(
                        message.buttonsMessage ||
                        message.templateMessage ||
                        message.listMessage
                    );
                    if (requiresPatch) {
                        message = {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadataVersion: 2,
                                        deviceListMetadata: {}
                                    },
                                    ...message
                                }
                            }
                        };
                    }
                    return message;
                },
                shouldSyncHistoryMessage: msg => {
                    console.log(`\x1b[32mMemuat chat [${msg.progress}%]\x1b[39m`);
                    return !!msg.syncType;
                },
                syncFullHistory: false
            };

            let Pair_Code_By_Toxic_Tech = makeWASocket(connectionOptions);

            if (!Pair_Code_By_Toxic_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Toxic_Tech.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Toxic_Tech.ev.on('creds.update', saveState);
            Pair_Code_By_Toxic_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(5000);
                    let data = await fs.readFile(sessionPath);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: '' + b64data });

                    let Toxic_MD_TEXT = `
        𝙎𝙀𝙎𝙎𝙄𝙊𝙉 𝘾𝙊𝙉𝙉𝙀𝘾𝙏𝙀𝘿
        
         𝙏𝙤𝙭𝙞𝙘-𝙈𝘿 𝙇𝙤𝙜𝙜𝙚𝙙  

『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 �_H𝗲𝗹𝗽 •••』
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

                    await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: Toxic_MD_TEXT }, { quoted: session });

                    await delay(100);
                    await Pair_Code_By_Toxic_Tech.ws.close();
                    await removeFile(path.dirname(sessionPath));
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    Toxic_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log('Service restarted');
            await removeFile(path.dirname(sessionPath));
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }

    return await Toxic_MD_PAIR_CODE();
});

module.exports = router;
