import { Droplet, Thermometer, Egg } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from '@/Layouts/DashboardLayout';
import Header from "@/Components/Common/Header";
import StatCard from "@/Components/Common/StatCard";
import TimeSeriesGraph from "@/Components/Overview/TimeSeriesGraph";
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { ref, onValue, off, get } from 'firebase/database';
import { database } from '@/firebaseConfig';
import { router } from '@inertiajs/react';
import axios from 'axios';

const OverviewPage = () => {
    const { session, auth } = usePage().props;

    const userId = auth.user.id;
    const firebaseUid = session.firebase_user_id;

    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [sensorData, setSensorData] = useState({
        humidity: 0,
        tempdht: 0,
        thermocouple: 0,
    });

    const checkAndUpdateTables = async (selectedDevice) => {
    try {

        const response = await axios.get(`/api/sensor-data/history/${userId}/${selectedDevice}`);
        const data = response.data;
        // if() {
        //     console.log('Data exists');
        // }
        // else {
        //     console.log('Data does not exist');
        // };

        const now = new Date();
        const hourly = data.hourly.length > 0 ? data.hourly[data.hourly.length - 1] : null;
        // console.log(hourly);
        // console.log(hourly.is_initial);
        // const isOutdatedHourly = (new Date(hourly.recorded_at).getTime() + 3600000) < now.getTime();
        // console.log(isOutdatedHourly);
        if (!hourly || hourly.is_initial || (new Date(hourly.recorded_at).getTime() + 3600000) < now.getTime()) {
            console.log('Sending data:', {
                user_id: userId,
                incubator_id: selectedDevice,
                humidity: parseFloat(data.hourly[data.hourly.length - 1].humidity).toFixed(2),
                tempdht: parseFloat(data.hourly[data.hourly.length - 1].tempdht).toFixed(2),
                thermocouple: parseFloat(data.hourly[data.hourly.length - 1].thermocouple).toFixed(2),
                recorded_at: now.toISOString(),
                is_initial: !hourly
            });

            const response =  await axios.post(`/api/sensor-data/store-hourly/${userId}/${selectedDevice}`, {
                user_id: userId,
                incubator_id: selectedDevice,
                humidity: data.hourly[data.hourly.length - 1].humidity,
                tempdht: data.hourly[data.hourly.length - 1].tempdht,
                thermocouple: data.hourly[data.hourly.length - 1].thermocouple,
                recorded_at: now.toISOString(),
                is_initial: !hourly
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            console.log('Hourly data updated successfully:', response.data);

        }

        // if (!daily || daily.is_initial ||
        //     (new Date(daily.recorded_at).getTime() + 86400000) < now.getTime()) {
        //     await router.post('sensor-data/daily', {
        //         firebase_uid: firebaseUid,
        //         incubator_id: '1A',
        //         humidity: currentData.humidity,
        //         tempdht: currentData.tempdht,
        //         thermocouple: currentData.thermocouple,
        //         recorded_at: now.toISOString(),
        //         is_initial: !daily
        //     });
        //     console.log('Daily data updated');
        // }

        // if (!weekly || weekly.is_initial ||
        //     (new Date(weekly.recorded_at).getTime() + 604800000) < now.getTime()) {
        //     await router.post('sensor-data/weekly', {
        //         firebase_uid: firebaseUid,
        //         incubator_id: '1A',
        //         humidity: currentData.humidity,
        //         tempdht: currentData.tempdht,
        //         thermocouple: currentData.thermocouple,
        //         recorded_at: now.toISOString(),
        //         is_initial: !weekly
        //     });
        //     console.log('Weekly data updated');
        // }

        // if (hourly && !hourly.is_initial) {
        //     const historicalData = await router.get(`sensor-data/history/${firebaseUid}/1A`);
        //     console.log('Historical sensor data:', historicalData.data);
        // }

    } catch (error) {
        console.error('Error updating sensor data tables:', error);
    }
};

    // Fetch available devices for the user
    useEffect(() => {
        const fetchDevices = async () => {
            const devicesRef = ref(database, `users/${firebaseUid}/incubators`);
            const snapshot = await get(devicesRef);

            if (snapshot.exists()) {
                const devicesData = snapshot.val();
                const devicesList = Object.entries(devicesData).map(([id, data]) => ({
                    id,
                    deviceId: data.deviceId,
                    name: data.name,
                    registeredBy: data.registeredBy
                }));
                setDevices(devicesList);

                // Set first device as default if none selected
                if (!selectedDevice && devicesList.length > 0) {
                    setSelectedDevice(devicesList[0].id);
                }
            }
        };

        fetchDevices();
    }, [firebaseUid]);

    useEffect(() => {
        if (!selectedDevice) return;

        const sensorRefPath = `users/${firebaseUid}/incubators/${selectedDevice}/datasensor`;
        const sensorRef = ref(database, sensorRefPath);

        onValue(sensorRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSensorData({
                    humidity: data.humidity ?? 0,
                    tempdht: data.tempdht ?? 0,
                    thermocouple: data.thermocouple ?? 0,
                });

                // await checkAndUpdateTables(selectedDevice);
            }
        });

        return () => off(sensorRef);
    }, [selectedDevice, firebaseUid]);

    return (
        <DashboardLayout>
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Overview' />

                <main className='max-w-8xl mx-auto py-6 px-4 lg:px-8'>
                    {/* Device Selector */}
                    <motion.div className="flex items-center justify-center gap-4 mb-6">
                        <span className="text-gray-700 font-medium text-sm uppercase tracking-wider">
                            Monitored Device:
                        </span>
                        <select
                            className="w-full max-w-xs px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                            value={selectedDevice || ''}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                        >
                            <option value="">Select Device</option>

                            {devices.map((device) => (
                                <option key={device.id} value={device.id}>
                                    ID: {device.deviceId} - Added by {device.registeredBy}
                                </option>
                            ))}
                        </select>
                    </motion.div>

                    {/* STATS */}
                    <motion.div
                        className='grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-3 mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <StatCard name='Humidity' icon={Droplet} value={`${sensorData.humidity.toFixed(1)}%`} color='#FFD93D' />
                        <StatCard name='Incubator Temperature' icon={Thermometer} value={`${sensorData.tempdht.toFixed(1)}°C`} color='#FFD93D' />
                        <StatCard name='Eggs Temperature' icon={Egg} value={`${sensorData.thermocouple.toFixed(1)}°C`} color='#FFD93D' />
                    </motion.div>

                    {/* CHARTS */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        <TimeSeriesGraph title="Humidity Graph" />
                        <TimeSeriesGraph title="Incubator Temperature Graph" />
                        <TimeSeriesGraph title="Eggs Temperature Graph" />
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default OverviewPage;
