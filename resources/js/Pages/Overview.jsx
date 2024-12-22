import { Droplet, Thermometer, Egg } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from '@/Layouts/DashboardLayout';
import Header from "@/Components/Common/Header";
import StatCard from "@/Components/Common/StatCard";
import SalesOverviewChart from "@/Components/Overview/SalesOverviewChart";
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/firebaseConfig';

const OverviewPage = () => {
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

    return (
        <DashboardLayout>
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Overview' />

                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    {/* STATS */}
                    <motion.div
                        className='grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-3 mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <StatCard name='Kelembapan' icon={Droplet} value={`${sensorData.humidity.toFixed(1)}%`} color='#6366F1' />
                        <StatCard name='Suhu Inkubator' icon={Thermometer} value={`${sensorData.tempdht.toFixed(1)}°C`} color='#8B5CF6' />
                        <StatCard name='Suhu Telur' icon={Egg} value={`${sensorData.thermocouple.toFixed(1)}°C`} color='#EC4899' />
                    </motion.div>

                    {/* CHARTS */}

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        <SalesOverviewChart />
                        <SalesOverviewChart />
                        <SalesOverviewChart />
                        {/* <SalesChannelChart /> */}
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};
export default OverviewPage;
