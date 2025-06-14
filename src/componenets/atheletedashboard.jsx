import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  AlertTriangle,
  Bell,
  Settings,
  LogOut,
  Zap,
  TrendingUp,
  Clock,
  Monitor,
  Waves,
  Target,
  Play,
  Pause,
  RotateCcw,
  Volume2
} from 'lucide-react';

const AthleteDashboard = ({ onLogout, name }) => {
  const [showCPRModal, setShowCPRModal] = useState(false);
  const [cprStep, setCprStep] = useState(0);
  const [cprTimer, setCprTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock data
  const mockAthleteData = {
    heartRate: 72,
    ecg: 'Normal Rhythm',
    spo2: 98,
    stressLevel: 'Low',
    temperature: 98.6,
    bloodPressure: '120/80'
  };

  const cprSteps = [
    {
      title: "Check Responsiveness",
      description: "Tap shoulders firmly and shout 'Are you OK?'",
      duration: 5
    },
    {
      title: "Call for Help",
      description: "Call 911 immediately and request an AED if available",
      duration: 10
    },
    {
      title: "Position Hands",
      description: "Place heel of one hand on center of chest, other hand on top",
      duration: 10
    },
    {
      title: "Start Compressions",
      description: "Push hard and fast at least 2 inches deep, 100-120 per minute",
      duration: 120
    },
    {
      title: "Give Rescue Breaths",
      description: "Tilt head back, lift chin, give 2 breaths (1 second each)",
      duration: 10
    },
    {
      title: "Continue CPR",
      description: "30 compressions followed by 2 breaths. Don't stop until help arrives",
      duration: null
    }
  ];

  useEffect(() => {
    let interval;
    if (isTimerRunning && showCPRModal) {
      interval = setInterval(() => {
        setCprTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, showCPRModal]);

  // Alert show/hide
  const handleBellClick = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Settings show/hide
  const handleSettingsClick = () => {
    setShowSettings(true);
  };
  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const startCPR = () => {
    setShowCPRModal(true);
    setCprStep(0);
    setCprTimer(0);
    setIsTimerRunning(true);
  };

  const nextStep = () => {
    if (cprStep < cprSteps.length - 1) {
      setCprStep(prev => prev + 1);
    }
  };

  const resetCPR = () => {
    setCprStep(0);
    setCprTimer(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const CPRModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-3 mr-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">CPR Assistant</h2>
              <p className="text-gray-400">Emergency Response Guide</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCPRModal(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Timer */}
        <div className="bg-red-600/20 rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">{formatTime(cprTimer)}</div>
          <div className="flex items-center justify-center space-x-4">
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={resetCPR}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Step {cprStep + 1}: {cprSteps[cprStep].title}
            </h3>
            <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">
              {cprStep + 1}/{cprSteps.length}
            </span>
          </div>
          <p className="text-gray-300 text-lg mb-4">{cprSteps[cprStep].description}</p>
          {cprSteps[cprStep].duration && (
            <p className="text-gray-400 text-sm">
              Recommended duration: {cprSteps[cprStep].duration} seconds
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((cprStep + 1) / cprSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {cprStep < cprSteps.length - 1 && (
            <button 
              onClick={nextStep}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex-1 font-medium"
            >
              Next Step
            </button>
          )}
          <button 
            onClick={() => window.open('tel:911')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg flex items-center justify-center"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Call 911
          </button>
        </div>
      </div>
    </div>
  );

  // Settings Modal
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Settings className="h-6 w-6 mr-2" />
            Settings
          </h2>
          <button
            onClick={handleCloseSettings}
            className="text-gray-400 hover:text-white text-xl"
          >✕</button>
        </div>
        {/* Settings content */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Notification Preferences</label>
            <select className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700">
              <option>Email & Push</option>
              <option>Only Email</option>
              <option>Only Push</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 mb-2 font-medium">Theme</label>
            <select className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700">
              <option>Dark</option>
              <option>Light</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCloseSettings}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Alert Message */}
      {showAlert && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3">
          <Bell className="h-5 w-5" />
          <span>New alert received! Please check your health data.</span>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && <SettingsModal />}

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-2 mr-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">STOMP</h1>
              <p className="text-gray-400 text-sm">Athlete Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={startCPR}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium"
            >
              <Heart className="h-4 w-4 mr-2" />
              Emergency CPR
            </button>
            <button className="text-gray-400 hover:text-white p-2" onClick={handleBellClick}>
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white p-2" onClick={handleSettingsClick}>
              <Settings className="h-5 w-5" />
            </button>
            <button 
              className="text-gray-400 hover:text-red-400 p-2"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {name || "Athlete"}
          </h2>
          <p className="text-gray-400">Monitor your cardiac health in real-time</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 rounded-full p-3">
                <Heart className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-green-400 text-sm font-medium">NORMAL</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{mockAthleteData.heartRate}</h3>
            <p className="text-gray-400 text-sm">Heart Rate (BPM)</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 rounded-full p-3">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-blue-400 text-sm font-medium">STABLE</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{mockAthleteData.spo2}%</h3>
            <p className="text-gray-400 text-sm">SpO2 Levels</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 rounded-full p-3">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-purple-400 text-sm font-medium">LOW</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{mockAthleteData.stressLevel}</h3>
            <p className="text-gray-400 text-sm">Stress Level</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/20 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-orange-400 text-sm font-medium">GOOD</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">85</h3>
            <p className="text-gray-400 text-sm">Health Score</p>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ECG Chart */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">ECG Monitoring</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            </div>
            <div className="h-48 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <Waves className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500">ECG Waveform Visualization</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rhythm: Normal Sinus</span>
              <span className="text-green-400">No Abnormalities</span>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-6">Vital Signs</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center">
                  <Monitor className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">Blood Pressure</span>
                </div>
                <span className="text-white font-medium">{mockAthleteData.bloodPressure}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-red-400 mr-3" />
                  <span className="text-gray-300">Temperature</span>
                </div>
                <span className="text-white font-medium">{mockAthleteData.temperature}°F</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Respiratory Rate</span>
                </div>
                <span className="text-white font-medium">16 /min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-800 rounded-xl">
              <div className="bg-green-500/20 rounded-full p-2 mr-4">
                <Heart className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Training session completed</p>
                <p className="text-gray-400 text-sm">All vitals remained in normal range</p>
              </div>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center p-4 bg-gray-800 rounded-xl">
              <div className="bg-blue-500/20 rounded-full p-2 mr-4">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Daily health report generated</p>
                <p className="text-gray-400 text-sm">Health score: 85/100 - Good condition</p>
              </div>
              <span className="text-gray-500 text-sm">1 day ago</span>
            </div>
          </div>
        </div>
      </main>

      {/* CPR Modal */}
      {showCPRModal && <CPRModal />}
    </div>
  );
};

export default AthleteDashboard;