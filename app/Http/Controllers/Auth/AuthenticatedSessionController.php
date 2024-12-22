<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Kreait\Laravel\Firebase\Facades\Firebase;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        // return Inertia::render('Auth/Login', [
        //     'canResetPassword' => Route::has('password.request'),
        //     'status' => session('status'),
        // ]);
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function firebaseLogin(Request $request): RedirectResponse
    {
        try {
            $auth = Firebase::auth();
            $verifiedIdToken = $auth->verifyIdToken($request->firebase_token);
            $uid = $verifiedIdToken->claims()->get('sub');
            $email = $verifiedIdToken->claims()->get('email');

            $user = User::firstOrCreate(
                ['firebase_uid' => $uid], 
                [
                    'name' => $verifiedIdToken->claims()->get('name'),
                    'email' => $email,
                ]
            );

            Auth::login($user);

            session([
                'firebase_user_id' => $verifiedIdToken->claims()->get('sub'),
                'firebase_user_email' => $verifiedIdToken->claims()->get('email'),
                'firebase_user_name' => $verifiedIdToken->claims()->get('name'),
            ]);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['auth' => 'Firebase authentication failed']);
        }
    }
    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->forget([
            'firebase_user_id',
            'firebase_user_email',
            'firebase_user_name'
        ]);

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
