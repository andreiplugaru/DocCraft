const PRODUCTION = document.location.href.endsWith('appspot.com/');

const FILE_UPLOAD_URL = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com/upload' : 'http://localhost:8083/upload';


export {
    PRODUCTION,
    FILE_UPLOAD_URL
};
