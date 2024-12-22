export default function PiyikLogo({ className = '' }) {
    return (
        <div className={className}>
            <div className="relative">
                {/* Logo image atau SVG bisa ditambahkan di sini */}
                <img 
                    src="/images/piyik-logo.png" 
                    alt="Piyik Logo" 
                    className="w-full h-full object-contain"
                />
                <h1 className="text-4xl font-bold text-yellow-400 absolute bottom-0 left-0 right-0 text-center">
                    Piyik
                </h1>
            </div>
        </div>
    );
} 