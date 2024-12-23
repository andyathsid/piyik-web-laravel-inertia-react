// resources/js/Pages/ManageIncubator.jsx
import { useState, useEffect } from 'react';
import { ref, set, remove, get } from 'firebase/database';
import { database } from '@/firebaseConfig';
import { usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Header from "@/Components/Common/Header";
import { motion } from "framer-motion";

const ManageIncubator = () => {
    const { session } = usePage().props;
    const userId = session.firebase_user_id;

    const [incubators, setIncubators] = useState([]);
    const [newIncubator, setNewIncubator] = useState({
        deviceId: '',
        name: '',
        registeredBy: '',
        eggType: 'Chicken'
    });

    useEffect(() => {
        fetchIncubators();
    }, [userId]);

    const fetchIncubators = async () => {
        const incubatorsRef = ref(database, `users/${userId}/incubators`);
        const snapshot = await get(incubatorsRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const incubatorList = Object.entries(data).map(([id, value]) => ({
                id,
                ...value
            }));
            setIncubators(incubatorList);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const incubatorRef = ref(database, `users/${userId}/incubators/${newIncubator.deviceId}`);

        const incubatorData = {
            deviceId: newIncubator.deviceId,
            name: newIncubator.name,
            registeredBy: newIncubator.registeredBy,
            registeredAt: new Date().toISOString(),
            datasensor: {
                humidity: 0,
                tempdht: 0,
                thermocouple: 0
            },
            settings: {
                isIncubating: false,
                jenistelur: newIncubator.eggType.toLowerCase() === 'chicken' ? 'ayam' : 'bebek',
                remainingDays: 0,
                totalDays: 0
            }
        };

        try {
            await set(incubatorRef, incubatorData);
            setNewIncubator({ deviceId: '', name: '', registeredBy: '', eggType: 'Chicken' });
            fetchIncubators();
        } catch (error) {
            console.error("Error adding incubator:", error);
        }
    };

    const handleDelete = async (deviceId) => {
        if (confirm('Are you sure you want to delete this incubator?')) {
            const incubatorRef = ref(database, `users/${userId}/incubators/${deviceId}`);
            try {
                await remove(incubatorRef);
                fetchIncubators();
            } catch (error) {
                console.error("Error deleting incubator:", error);
            }
        }
    };

    const handleEggTypeUpdate = async (deviceId, newEggType) => {
        const incubatorRef = ref(database, `users/${userId}/incubators/${deviceId}/settings`);
        try {
            await set(incubatorRef, {
                isIncubating: false,
                jenistelur: newEggType.toLowerCase() === 'chicken' ? 'ayam' : 'bebek',
                remainingDays: 0,
                totalDays: 0
            });
            fetchIncubators();
        } catch (error) {
            console.error("Error updating egg type:", error);
        }
    };

    console.log(incubators);

    return (
        <DashboardLayout>
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Manage Incubator' />

                <main className='max-w-8xl mx-auto py-6 px-4 lg:px-8'>
                    {/* Incubator Form */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-sm mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-lg text-black font-semibold mb-4">Add New Incubator</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black">Device ID</label>
                                <input
                                    type="text"
                                    value={newIncubator.deviceId}
                                    onChange={(e) => setNewIncubator({...newIncubator, deviceId: e.target.value})}
                                    className="text-gray-700 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Name</label>
                                <input
                                    type="text"
                                    value={newIncubator.name}
                                    onChange={(e) => setNewIncubator({...newIncubator, name: e.target.value})}
                                    className="text-gray-700 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Registered By</label>
                                <input
                                    type="text"
                                    value={newIncubator.registeredBy}
                                    onChange={(e) => setNewIncubator({...newIncubator, registeredBy: e.target.value})}
                                    className="text-gray-700 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black">Egg Type</label>
                                <select
                                    value={newIncubator.eggType}
                                    onChange={(e) => setNewIncubator({...newIncubator, eggType: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-gray-700"
                                    required
                                >
                                    <option className="text-black" value="Chicken">Chicken</option>
                                    <option className="text-black" value="Duck">Duck</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                                Add Incubator
                            </button>
                        </form>
                    </motion.div>

                    {/* Incubators List */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-lg text-black font-semibold mb-4">Your Incubators</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egg Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {incubators.map((incubator) => (
                                        <tr key={incubator.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-yellow-500 hidden">{incubator.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-yellow-500">{incubator.deviceId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-yellow-500">{incubator.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-yellow-500">{incubator.registeredBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-yellow-500">
                                                {new Date(incubator.registeredAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={incubator.settings?.jenistelur === 'ayam' ? 'Chicken' : 'Duck'}
                                                    onChange={(e) => handleEggTypeUpdate(incubator.deviceId, e.target.value)}
                                                    className="text-yellow-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                                                >
                                                    <option value="Chicken">Chicken</option>
                                                    <option value="Duck">Duck</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDelete(incubator.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default ManageIncubator;
