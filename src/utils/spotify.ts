/* REQUEST */
import https from 'https';
import config from '../config';
import log from "@/utils/log";

function request(options: any, body = '') {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({ error: null, body: JSON.parse(data) });
                } catch (err) {
                    reject({ error: err, body: data });
                }
            })
        });

        req.write(body);
        req.end();
    });
}

/* TOKEN */
import { Settings } from './db';

let obj = {
    token: null,
    last: 0
};

function getToken(id: string, secret: string) {
    return new Promise((resolve, reject) => {
        if (!id || !secret) {
            return;
            // throw new Error('You need to specify an id and a secret, in order to access to a secret token.')
        }

        if (new Date().getTime() - obj.last <= 3600000) {
            resolve(obj.token);
        } else {
            const infos = {
                host: 'accounts.spotify.com',
                path: '/api/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64')
                }
            };

            request(infos, 'grant_type=client_credentials')
                .then((dts: any) => {

                    if (!dts.err) {
                        obj = {
                            token: dts.body.access_token,
                            last: new Date().getTime()
                        }
                        Settings.set(config.settings.keys.spotifyToken, obj)
                            .then(() => {
                                log('info', 'New Spotify Token');
                            });
                        resolve(dts.body.access_token as string);
                    } else {
                        log('error', 'Unable to get spotify token.', dts.error);
                    }
                })
                .catch((err) => {
                    log('error', 'Unable to get spotify token.', err);
                });
        }
    });
}

Settings.get(config.settings.keys.spotifyToken)
    .then((o) => {
        if (o) {
            obj = o;
        } else {
            getToken(process.env.SPOTIFY_ID!, process.env.SPOTIFY_SECRET!).then((t: unknown) => {
                obj.token = t;
            });
        }
    });


setInterval(() => {
    getToken(process.env.SPOTIFY_ID!, process.env.SPOTIFY_SECRET!)
        .then((t) => {
            obj.token = t;
    });
}, 4560000);

getToken(process.env.SPOTIFY_ID!, process.env.SPOTIFY_SECRET!)
    .then((t) => {
        obj.token = t;
    });

export const search = function (query: any, type: any) {
    return new Promise((resolve, reject) => {
        request({
            host: 'api.spotify.com',
            path: `/v1/search?q=${encodeURI(query)}&type=${type || 'track'}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${obj.token}`
            }
        })
            .then((dts) => {
                resolve((dts as any).body);
            })
            .catch((dts) => {
                reject(`Contenu invalide ("${(dts as any).body}")`);
            });
    })
}