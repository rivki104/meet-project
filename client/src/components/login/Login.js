import SignInWithGoogle from './SignInWithGoogle';
import ByEmailAndPassword from './ByEmailAndPassword';

import './login.css'

export default function Login() {

    return (
        <div>
            <div className="loginForm">
                <SignInWithGoogle />
                <hr className="hr"></hr>
                <ByEmailAndPassword />
            </div>
        </div>
    );

}