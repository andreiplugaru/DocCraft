import './MainPage.css';
import '../components/Taskbar.css';
import { GoogleLogin } from '@react-oauth/google';
import { parseCredentialsJWT } from '../utils';

export default function MainPage() {
    const responseMessage = (response) => {
        const {email_verified} = parseCredentialsJWT(response.credential);
        
        if (!email_verified) {
            console.error('Email not verified!');
            return;
        }

        document.cookie = 'authToken=' + response.credential;

        document.location.href = '/home';
    }

    const errorMessage = (error) => {
        console.error(error);
    }
    
    return (
        <div className="main-page">
            <div className="taskbar" style={{justifyContent: 'space-between'}}>
                <img src='/logo.png' style={{height: '100%'}} alt='Logo' />
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </div>
        </div>
    );
}
