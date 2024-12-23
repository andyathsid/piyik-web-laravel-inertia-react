<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HourlySensorData;
use App\Models\DailySensorData;
use App\Models\WeeklySensorData;
use Illuminate\Http\Request;
use App\Models\Incubator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SensorDataController extends Controller
{

    // public function storeHourly(Request $request)
    // {
    //     try {


    //         $validatedData = $request->validate([
    //             'incubator_id' => 'required|exists:incubators,id',
    //             'humidity' => 'required|numeric',
    //             'tempdht' => 'required|numeric',
    //             'thermocouple' => 'required|numeric',
    //             'recorded_at' => 'required|date',
    //             'is_initial' => 'required|boolean'
    //         ]);

    //         $incubator = Incubator::find($validatedData['incubator_id']);
    //         if ($incubator->user_id !== auth()->id()) {
    //             return response()->json([
    //                 'error' => 'Unauthorized'
    //             ], 403);
    //         }

    //         $validatedData['is_initial'] = filter_var($validatedData['is_initial'], FILTER_VALIDATE_BOOLEAN);

    //         $data = HourlySensorData::create($validatedData);

    //         return response()->json([
    //             'success' => true,
    //             'data' => $data
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error("Error storing hourly data: " . $e->getMessage());
    //         return response()->json([
    //             'error' => 'Unable to store hourly data'
    //         ], 500);
    //     }
    // }

    public function storeHourly(Request $request, $userId, $incubatorId)
    {
        try {
            Log::info($request);
            $validated = $request->validate([
                'incubator_id' => 'required|exists:incubators,id',
                'user_id' => 'required|exists:users,id',
                'humidity' => 'required|numeric',
                'tempdht' => 'required|numeric',
                'thermocouple' => 'required|numeric',
                'recorded_at' => 'required|date',
                'is_initial' => 'required|boolean'
            ]);

            $incubator = Incubator::where('id', $incubatorId)
                                 ->where('user_id', $userId)
                                 ->firstOrFail();

            $hourlyData = HourlySensorData::create([
                'incubator_id' => $incubator->id,
                'humidity' => $validated['humidity'],
                'tempdht' => $validated['tempdht'],
                'thermocouple' => $validated['thermocouple'],
                'recorded_at' => now(),
                'is_initial' => $validated['is_initial'] ? true : false
            ]);

            return response()->json([
                'success' => true,
                'data' => $hourlyData
            ]);

        } catch (\Exception $e) {
            Log::error("Error storing hourly data: " . $e->getMessage());
            return response()->json([
                'error' => 'Unable to store hourly data'
            ], 500);
        }
    }

    public function storDaily(Request $request, $userId, $incubatorId)
    {
        try {
            Log::info($request);
            $validated = $request->validate([
                'incubator_id' => 'required|exists:incubators,id',
                'user_id' => 'required|exists:users,id',
                'humidity' => 'required|numeric',
                'tempdht' => 'required|numeric',
                'thermocouple' => 'required|numeric',
                'recorded_at' => 'required|date',
                'is_initial' => 'required|boolean'
            ]);

            $incubator = Incubator::where('id', $incubatorId)
                                 ->where('user_id', $userId)
                                 ->firstOrFail();

            $dailyData = DailySensorData::create([
                'incubator_id' => $incubator->id,
                'humidity' => $validated['humidity'],
                'tempdht' => $validated['tempdht'],
                'thermocouple' => $validated['thermocouple'],
                'recorded_at' => now(),
                'is_initial' => $validated['is_initial'] ? true : false
            ]);

            return response()->json([
                'success' => true,
                'data' => $dailyData
            ]);

        } catch (\Exception $e) {
            Log::error("Error storing daily data: " . $e->getMessage());
            return response()->json([
                'error' => 'Unable to store daily data'
            ], 500);
        }
    }

    public function storeWeekly(Request $request, $userId, $incubatorId)
    {
        try {
            Log::info($request);
            $validated = $request->validate([
                'incubator_id' => 'required|exists:incubators,id',
                'user_id' => 'required|exists:users,id',
                'humidity' => 'required|numeric',
                'tempdht' => 'required|numeric',
                'thermocouple' => 'required|numeric',
                'recorded_at' => 'required|date',
                'is_initial' => 'required|boolean'
            ]);

            $incubator = Incubator::where('id', $incubatorId)
                                 ->where('user_id', $userId)
                                 ->firstOrFail();

            $weeklyData = WeeklySensorData::create([
                'incubator_id' => $incubator->id,
                'humidity' => $validated['humidity'],
                'tempdht' => $validated['tempdht'],
                'thermocouple' => $validated['thermocouple'],
                'recorded_at' => now(),
                'is_initial' => $validated['is_initial'] ? true : false
            ]);

            return response()->json([
                'success' => true,
                'data' => $weeklyData
            ]);

        } catch (\Exception $e) {
            Log::error("Error storing daily data: " . $e->getMessage());
            return response()->json([
                'error' => 'Unable to store daily data'
            ], 500);
        }
    }

    public function history($userId, $incubatorId)
    {
        try {
            $hourlyData = HourlySensorData::whereHas('incubator', function ($query) use ($userId, $incubatorId) {
                $query->where('user_id', $userId)
                    ->where('id', $incubatorId);
            })->get();

            $dailyData = DailySensorData::whereHas('incubator', function ($query) use ($userId, $incubatorId) {
                $query->where('user_id', $userId)
                    ->where('id', $incubatorId);
            })->get();

            $weeklyData = WeeklySensorData::whereHas('incubator', function ($query) use ($userId, $incubatorId) {
                $query->where('user_id', $userId)
                    ->where('id', $incubatorId);
            })->get();

            return response()->json([

                    'hourly' => $hourlyData,
                    'daily' => $dailyData,
                    'weekly' => $weeklyData


            ]);

        } catch (\Exception $e) {
            Log::error("Error checking historical data: " . $e->getMessage());
            return Inertia::render('SensorHistory', [
                'error' => 'Unable to check historical data',
                'userId' => $userId,
                'incubatorId' => $incubatorId
            ]);
        }
    }
}
