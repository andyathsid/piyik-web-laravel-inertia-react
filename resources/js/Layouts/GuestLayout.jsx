import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl flex">
                {/* Logo Section - Left Side */}
                <div className="w-1/3 pr-8 flex flex-col justify-center">
                    <div className="w-full aspect-square bg-yellow-50 rounded-2xl p-4 flex items-center justify-center">
                        <ApplicationLogo className="w-full h-full" />
                    </div>
                </div>

                <div className="w-2/3">
                    {children}
                </div>
            </div>
        </div>
    );
}
