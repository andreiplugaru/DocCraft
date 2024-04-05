const PRODUCTION = document.location.href.endsWith('appspot.com/');

const FILE_UPLOAD_URL = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com/upload' : 'http://localhost:8083/upload';
const GET_FILES_URL = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com/files' : 'http://localhost:8083/files'
const GET_FILE_CONTENT = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com/contents' : 'http://localhost:8083/contents'
const UPDATE_FILE_CONTENT = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com/save' : 'http://localhost:8083/save'
export {
    PRODUCTION,
    FILE_UPLOAD_URL,
    GET_FILES_URL,
    GET_FILE_CONTENT,
    UPDATE_FILE_CONTENT
};
