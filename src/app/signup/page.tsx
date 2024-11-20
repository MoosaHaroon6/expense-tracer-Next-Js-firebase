'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupWithEmailPassword } from "@/firebase/firebaseAuth";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', error: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };


    const signupHandler = async () => {
        setNotification({ message: '', error: false });
        setLoading(true);

        if (!validateEmail(email) || !email || !password) {
            setNotification({ message: 'Please Fill Required Fields And Valid Data', error: true });
            setLoading(false);
            setTimeout(() => {
                setNotification({ message: '', error: false });
            }, 3000)
            return;
        }

        try {
            await signupWithEmailPassword(email, password);
            setNotification({ message: 'A verification email has been sent to your email address. Please verify before logging in.', error: false });
            setEmail('');
            setPassword('');
            router.push('/emailVerification');
        } catch {
            setError('SignUp Failed at the moment try later!');
            setTimeout(() => { setError('') }, 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        //   main-div 
        <div className="card bg-base-100 w-96 shadow-xl m-auto">
            {/* body-card  */}
            <div
                className="card-body items-center text-center
             shadow-md hover:shadow-lg transition-shadow duration-300 p-10 bg-gray-100 gap-5 mt-[200px]"
            >

                {/* heading  */}
                <h2 className="card-title text-4xl">Sign Up</h2>

                {/* email  */}
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="email"
                        className="grow"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                {/* password */}
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input
                        type="password"
                        className="grow"
                        placeholder="Passwrod"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {/* button-container  */}

                <div className="card-actions">
                    <button className="btn btn-primary w-[250px]" onClick={signupHandler} disabled={loading}>
                        SignUp
                    </button>
                </div>


                
                {/* notification-functional  */} {/* error-handling  */}
                <p
                    className={`
                    p-2 rounded border${notification.error ?
                            "text-red-500 bg-red-100 border-red-400 text-red-800" :
                            "text-green-500 bg-white-100 border-green-400"
                        }
                    `}
                >{notification.message}</p>

                
                <span className="text-[16px]">Already have an account? {"   "}
                    <Link href={'/login'} className="text-blue-500 hover:underline">Login</Link></span>
            </div>
        </div>


    );
}