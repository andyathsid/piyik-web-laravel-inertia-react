import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartBar, faChartArea } from '@fortawesome/free-solid-svg-icons';
import { usePage } from '@inertiajs/react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/firebaseConfig';

export default function Dashboard() {
    const { session } = usePage().props;
    const userId = session.firebase_user_id;

    const [sensorData, setSensorData] = useState({
        humidity: 0,
        tempdht: 0,
        thermocouple: 0,
    });

    useEffect(() => {
        console.log("Initializing Firebase listener for user:", userId);

        const sensorRefPath = `users/${userId}/incubators/1A/datasensor`;
        const sensorRef = ref(database, sensorRefPath);

        console.log("Listening to Firebase path:", sensorRefPath);

        onValue(sensorRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Firebase data received:", data);
                setSensorData({
                    humidity: data.humidity ?? 0,
                    tempdht: data.tempdht ?? 0,
                    thermocouple: data.thermocouple ?? 0,
                });
            } else {
                console.warn("No data found at path:", sensorRefPath);
            }
        }, (error) => {
            console.error("Error listening to Firebase path:", sensorRefPath, error);
        });

        return () => {
            console.log("Removing Firebase listener for path:", sensorRefPath);
            off(sensorRef);
        };
    }, [userId]);

    const metrics = [
        { title: 'Kelembaban', value: sensorData.humidity.toFixed(1), icon: faChartLine },
        { title: 'Suhu Inkubator', value: sensorData.tempdht.toFixed(1), icon: faChartBar },
        { title: 'Suhu Telur', value: sensorData.thermocouple.toFixed(1), icon: faChartArea },
    ];

    const filterOptions = ['detik', 'menit', 'jam', 'hari'];

    const ChartSection = ({ title, activeFilter, onFilterChange }) => (
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h6 className="text-lg font-semibold text-gray-800">{title}</h6>
                <a href="#" className="text-blue-500 hover:text-blue-700">Show All</a>
            </div>
            <div className="flex gap-2 mb-6">
                {filterOptions.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`px-6 py-2 rounded-full transition-all duration-200 ${
                            activeFilter === filter
                                ? 'bg-yellow-400 text-gray-800 font-medium'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                ))}
            </div>
            <div className="h-[300px]">
                <canvas id={`${title.toLowerCase()}-chart`}></canvas>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Metrics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <FontAwesomeIcon
                                        icon={metric.icon}
                                        className="text-yellow-400 text-3xl"
                                    />
                                    <div className="ml-3">
                                        <p className="text-gray-500 text-sm mb-1">{metric.title}</p>
                                        <h6 className="text-2xl font-bold text-gray-800">{metric.value}</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="space-y-6">
                        <ChartSection
                            title="Kelembaban"
                            activeFilter="hari"
                            onFilterChange={() => {}}
                        />
                        <ChartSection
                            title="DHT"
                            activeFilter="detik"
                            onFilterChange={() => {}}
                        />
                        <ChartSection
                            title="Thermocouple"
                            activeFilter="detik"
                            onFilterChange={() => {}}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
