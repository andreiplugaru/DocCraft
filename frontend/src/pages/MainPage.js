import './MainPage.css';
import Taskbar from '../components/Taskbar';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LOGIN_URL } from '../config';

export default function MainPage() {
    const responseMessage = (response) => {
        const credentials = jwtDecode(response.credential);

        if (!credentials.email_verified) {
            console.error('Email not verified!');
            return;
        }

        const email = credentials.email;
        const name = credentials.name;
        const pfpUrl = credentials.picture;
        
        const body = {email, name, pfpUrl};

        console.log(body);

        fetch(LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => console.error(error));
    }

    const errorMessage = (error) => {
        console.error(error);
    }
    

    return (
        <div className="main-page">
            <Taskbar />
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
    );
}
