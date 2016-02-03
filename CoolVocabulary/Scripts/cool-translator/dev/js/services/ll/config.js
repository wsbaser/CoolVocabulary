'use strict';

import ContentTypes from '../common/content-types';

const cdnHost = 'https://d144fqpiyasmrr.cloudfront.net';
const apiHost = 'https://api.lingualeo.com';
const siteHost = 'https://lingualeo.com';
const rootDir = 'cooltranslator/js/lingualeo/';

export default {
    id: "ll",
    name: "LinguaLeo",
    languages: {
        en: {
            targets: ['ru']
        }
    },
    priority: 10,
    api: apiHost,
    serverPort: 1002,
    ajax: {
        isAuthenticated: '/isauthorized',
        getTranslations: '/gettranslates',
        addWordToDict: '/addword',
        login: siteHost + '/api/login'
    },
    domain: 'http://lingualeo.com',
    path: {
        wordArticle: '/userdict#/{originalText}',
        audio_player: cdnHost + '/plugins/all/flash/1.html#sound=',
        vocabulary: siteHost + '/ru/userdict',
        templatesDir: rootDir
    },
    maxTextLengthToTranslate: 50,
    contentTypes: [ContentTypes.TRANSLATIONS],
    iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwRJREFUeNpkU02IHEUU/upV9fT0zOx2NisahNVI1BwkrhhR0JOsaBAxKBFz8eBF8CeHkItHJSiCoAc9iIKCB2EPMQcFwXgQRC/+HIw/oAd1zSabmUlPz+72THdV1ytfTwiGTcHX1VX1vlffq/eeeebMCAGAidszeOfwev0wOhgjjvUjgieGmX2ntOHXxACLbYKvGFwLSwkPO4ZqnLlNsMH9cUynEEI3iXWidXguNaGa3XbVoKv+u4L7GKp3xj6uIsIRMW72UFvebzhEsm7L8ojgQUG008ExwVeBzEeflUcXFfzyTA4D+Vb9p+Zwgxifgg+r4HCaGXcGOSMykcgztytFz4q6Hmk82aHJgWzT94MLGA4dbMmrkcFrQnxUQqLJxKeXRlUvyy2Mt2UrIOyONC0RteRxQL6axqOifj/LJ/cwh/d6LXVRMx6CxOBLxiCzX+Rb/mdNCqYc9achhPPcS39TOjo4GefbHYp+mUvoHDPdNpl6FIW/e5A5TSyKRvZssPxKajASHkxtKyue16bZxpu2GL/EZu7dPTfelO/VrWUE0xoP7e//bPifzvXtiXkd0jmjPlmcN0USQkdCnhiT9CDxQ+ZVMvF3SNJD4MFpBL4VNc+lPfPB9T3/qi39h7valMwn9Dysfxou/HFhWB8z1GqDtEGc7j4AMm9ZhxXv5f1J/PsZXk50+La0/vNONzqJyp9o9uuK781y94aRTF2nlN4r5E+9w5I8Itg3CRZyLXmSiosJT1m5kTwflyyALWN94M56xtDYolgh4+4yycJSUKY5h+T48qemmZMYeEBS2V3rVxe6Wu3JN+u1YupflCRcNHVVfYOy+teVfz2m2+kdnrqqqyZAckWB1KbnWxY6amOQ+cN5HQ4S85dC/rupvqYXzjeoJ8WhanNrxdbRvojGy/mCO7yrIwGKpKpkWkxIXVL4EZeBKz3xfzMpWleaPm5kO+fa6333wrgVTrYUOsW2/6H2oZBK3Nl713Zj452UKsX47dG2/1o5vllq/ns5GZO6xhr/CTAAU+KSscJ7kCAAAAAASUVORK5CYII="
}