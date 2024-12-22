import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken(true);
            await sendTokenToBackend(idToken);
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    const sendTokenToBackend = async (idToken) => {
        const response = await fetch('/register/firebase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ firebase_token: idToken })
        });

        if (response.ok) {
            window.location.href = response.url;
        } else {
            throw new Error('Registration failed');
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                </div>
                {error && <div>{error}</div>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;