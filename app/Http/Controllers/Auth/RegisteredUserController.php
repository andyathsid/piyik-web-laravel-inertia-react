<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Kreait\Laravel\Firebase\Facades\Firebase;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function firebaseRegister(Request $request): RedirectResponse
    {
        try {
            $auth = Firebase::auth();
            $verifiedIdToken = $auth->verifyIdToken($request->firebase_token);
            $uid = $verifiedIdToken->claims()->get('sub');
            $email = $verifiedIdToken->claims()->get('email');

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => explode('@', $email)[0],
                ]
            );

            Auth::login($user);

            session([
                'firebase_user_id' => $uid,
                'firebase_user_email' => $email,
            ]);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            return redirect()->route('register')->withErrors(['auth' => 'Registration failed']);
        }
    }
}
