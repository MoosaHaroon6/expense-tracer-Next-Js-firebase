import { app } from "./firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { saveUser } from './firebaseFireStore';
import { sendSignInLinkToEmail } from "firebase/auth";

export const auth = getAuth(app);

const actionCodeSettings = {
    url: 'https://www.example.com/finishSignUp?cartId=1234',

    handleCodeInApp: true,

    iOS: {
        bundleId: 'com.example.ios'
    },

    android: {
        packageName: 'com.example.android',
        installApp: true,
        minimumVersion: '12'
    },

    dynamicLinkDomain: 'example.page.link'
};

export function emailVerification(email: string) {  
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}

export async function signupWithEmailPassword(email: string, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const { email: userEmail, uid } = user;

        if (!userEmail) {
            throw new Error('invalid email path!');
        }

        await sendEmailVerification(user);
        console.log('Verification has sent');


        await saveUser({ email: userEmail, uid });
        return user;

    } catch (error) {
        console.log("BEAT YOURSELF LOOSER!", error);
    }
}


export async function loginWithEmailPassword(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user, 'User logged in');
        return user;
    } catch (error) {
        console.error('Error when logging in:', error);
        throw new Error('error');
    }
}