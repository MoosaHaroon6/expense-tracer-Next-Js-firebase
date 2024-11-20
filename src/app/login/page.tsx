"use client";

import { loginWithEmailPassword } from "@/firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    
    // states

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

     // router

    const router = useRouter();

    // login (firebase)

    const loginHandler = async () => {
        try {
            const user = await loginWithEmailPassword(email, password);

            if (user.emailVerified) {
                router.push('/home');
                setLoading(true);
            } else {
                setError('Please verify your email before logging in.');
                setTimeout(() => { setError('') }, 2000);
            }
        } catch {
            setError('Login Failed');
            setTimeout(() => { setError('') }, 2000);
        }
    }

    return (
        //   main-div 
        <div className="card bg-base-100 w-96 shadow-xl m-auto  ">
            {/* body-card  */}
            <div
                className="card-body items-center text-center
                shadow-md hover:shadow-lg transition-shadow duration-300 p-10 bg-gray-100 gap-5
                mt-[200px]
                "
            >
                <h2 className="card-title text-4xl">Login</h2>

                {/* heading  */}

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
                    <button className="btn btn-primary w-[250px]" onClick={loginHandler} disabled={loading}>
                        {loading ? "Logging In" : "Login"}
                    </button>
                </div>

                {/* error-handling  */}
                {error &&
                    <p className="text-red-500 bg-red-100 border-red-400 text-red-800 w-[160px]">{error}</p>
                }
                <span className="text-[16px]">Don&apos;t have an account? {"   "}
                    <Link href={'/signup'} className="text-blue-500 hover:underline">Create one</Link></span>
            </div>
        </div>
    );
}