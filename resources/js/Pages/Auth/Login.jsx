import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/firebaseConfig';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            console.log('Attempting to sign in with email and password');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            console.log('Successfully signed in, ID token:', idToken);
            await sendTokenToBackend(idToken);
        } catch (error) {
            console.error('Error during email/password login:', error);
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed login attempts. Please try again later.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your connection.');
                    break;
                default:
                    setError('Login failed: ' + error.message);
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            console.log('Attempting to sign in with Google');
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            console.log('Successfully signed in with Google, ID token:', idToken);
            await sendTokenToBackend(idToken);
        } catch (error) {
            console.error('Error during Google login:', error);
            switch (error.code) {
                case 'auth/cancelled-popup-request':
                    setError('Login popup was closed. Please try again.');
                    break;
                case 'auth/popup-blocked':
                    setError('Login popup was blocked. Please allow popups for this site.');
                    break;
                case 'auth/popup-closed-by-user':
                    setError('Login popup was closed before completion. Please try again.');
                    break;
                case 'auth/unauthorized-domain':
                    setError('This domain is not authorized for Google sign-in.');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Google sign-in is not enabled for this project.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your connection.');
                    break;
                case 'auth/internal-error':
                    setError('An internal error occurred. Please try again.');
                    break;
                case 'auth/account-exists-with-different-credential':
                    setError('An account already exists with the same email but different sign-in credentials.');
                    break;
                case 'auth/credential-already-in-use':
                    setError('These credentials are already associated with another account.');
                    break;
                default:
                    setError('Login failed: ' + error.message);
            }
        }
    };

    const sendTokenToBackend = async (idToken) => {
        try {
            router.post('/login/firebase', {
                firebase_token: idToken
            }, {
                onSuccess: (response) => {
                },
                onError: (errors) => {
                    console.error('Authentication failed:', errors);
                    throw new Error('Authentication failed');
                }
            });
        } catch (error) {
            console.error('Server communication error:', error);
            throw error;
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Form Section - Right Side */}
            <div className="flex flex-col space-y-6">
                {/* Sign In Text */}
                <div className="flex justify-center">
                    <h1 className="text-4xl font-bold text-olive-700">Sign In</h1>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>
                        {/* Password Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span >                               <input
                                type="password"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex justify-between text-sm">
                        <Link href="/forgot-password" className="text-olive-700 hover:underline">
                            Forgot Password
                        </Link>
                        <Link href="/register" className="text-olive-700 hover:underline">
                            Create an Account
                        </Link>
                    </div>
                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-300 text-olive-700 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition duration-300"
                    >
                        Login
                    </button>


                </form>
                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-olive-700">Or</span>
                    </div>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-yellow-300 text-olive-700 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition duration-300 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Login with Google
                </button>
            </div>




        </GuestLayout>
    );
}
