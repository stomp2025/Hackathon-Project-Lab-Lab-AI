import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  AlertTriangle,
  Bell,
  LogOut,
  TrendingUp,
  Clock,
  Monitor,
  Waves,
  Target,
  Search,
  Filter,
  Mail,
  Phone,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Users,
  Settings,
  Menu
} from "lucide-react";

const mockTeamAthletes = [
  { id: 1, name: "Alex Johnson", status: "normal", heartRate: 68, risk: "low", sport: "Basketball" },
  { id: 2, name: "Sarah Williams", status: "warning", heartRate: 95, risk: "medium", sport: "Soccer" },
  { id: 3, name: "Mike Chen", status: "critical", heartRate: 110, risk: "high", sport: "Track" },
  { id: 4, name: "Emma Davis", status: "normal", heartRate: 72, risk: "low", sport: "Swimming" },
  { id: 5, name: "James Wilson", status: "normal", heartRate: 65, risk: "low", sport: "Tennis" },
];

const cprSteps = [
  {
    title: "Check Responsiveness",
    description: "Tap shoulders firmly and shout 'Are you OK?'",
    duration: 5,
  },
  {
    title: "Call for Help",
    description: "Call 911 immediately and request an AED if available",
    duration: 10,
  },
  {
    title: "Position Hands",
    description: "Place heel of one hand on center of chest, other hand on top",
    duration: 10,
  },
  {
    title: "Start Compressions",
    description: "Push hard and fast at least 2 inches deep, 100-120 per minute",
    duration: 120,
  },
  {
    title: "Give Rescue Breaths",
    description: "Tilt head back, lift chin, give 2 breaths (1 second each)",
    duration: 10,
  },
  {
    title: "Continue CPR",
    description: "30 compressions followed by 2 breaths. Don't stop until help arrives",
    duration: null,
  },
];

const CoachDashboard = ({ onLogout, name }) => {
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showCPRModal, setShowCPRModal] = useState(false);
  const [cprStep, setCprStep] = useState(0);
  const [cprTimer, setCprTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // CPR Modal timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && showCPRModal) {
      interval = setInterval(() => {
        setCprTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, showCPRModal]);

  // Emergency CPR handlers
  const startCPR = () => {
    setShowCPRModal(true);
    setCprStep(0);
    setCprTimer(0);
    setIsTimerRunning(true);
  };

  const nextStep = () => {
    if (cprStep < cprSteps.length - 1) {
      setCprStep((prev) => prev + 1);
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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Alert on bell
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

  // Sidebar for mobile
  const AthleteList = ({ onSelect, selectedAthlete }) => (
    <div className="space-y-3">
      {mockTeamAthletes.map((athlete) => (
        <div
          key={athlete.id}
          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
            selectedAthlete?.id === athlete.id
              ? "bg-red-600/20 border-2 border-red-500"
              : "bg-gray-800 border border-gray-700 hover:border-gray-600"
          }`}
          onClick={() => {
            onSelect(athlete);
            setMobileSidebarOpen(false);
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium text-sm">{athlete.name}</h3>
            <div
              className={`w-3 h-3 rounded-full ${
                athlete.status === "normal"
                  ? "bg-green-400"
                  : athlete.status === "warning"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{athlete.sport}</span>
            <span className="text-gray-300">{athlete.heartRate} BPM</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                athlete.risk === "low"
                  ? "bg-green-500/20 text-green-400"
                  : athlete.risk === "medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {athlete.risk.toUpperCase()} RISK
            </span>
          </div>
        </div>
      ))}
    </div>
  );

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
          <button onClick={() => setShowCPRModal(false)} className="text-gray-400 hover:text-white">
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
              {isTimerRunning ? "Pause" : "Start"}
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
            onClick={() => window.open("tel:911")}
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
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          mobileSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      ></div>
      <aside
        className={`
          fixed z-50 inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto transform transition-transform duration-300
          md:static md:translate-x-0 md:w-80 md:block
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          top: 0,
          alignSelf: "flex-start",
          height: "100vh"
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Team Overview</h2>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {mockTeamAthletes.length} Athletes
            </span>
          </div>
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search athletes..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button className="flex items-center text-gray-400 hover:text-white text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter by status
            </button>
          </div>
          {/* Athletes List */}
          <AthleteList onSelect={setSelectedAthlete} selectedAthlete={selectedAthlete} />
        </div>
      </aside>
      <div className="flex-1 p-2 sm:p-4 md:p-6">
        {/* Mobile hamburger button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 border border-gray-800 p-2 rounded-lg text-white"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Alert Message */}
        {showAlert && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3">
            <Bell className="h-5 w-5" />
            <span>New alert received! Check athlete vitals immediately.</span>
          </div>
        )}

        {showSettings && <SettingsModal />}

        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-2 mr-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">STOMP</h1>
              <p className="text-gray-400 text-sm">Coach Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium" onClick={startCPR}>
              <Heart className="h-4 w-4 mr-2" />
              Emergency CPR
            </button>
            <button className="text-gray-400 hover:text-white p-2 relative" onClick={handleBellClick}>
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
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
        </header>
        {/* Main Panel */}
        {!selectedAthlete ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select an Athlete</h3>
              <p className="text-gray-400">
                Choose an athlete from the list to view their detailed health profile
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Athlete Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {selectedAthlete.name}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">{selectedAthlete.sport}</span>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        selectedAthlete.status === "normal"
                          ? "bg-green-400"
                          : selectedAthlete.status === "warning"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-white capitalize">
                      {selectedAthlete.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Message
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={startCPR}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency
                </button>
              </div>
            </div>
            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-500/20 rounded-full p-3">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">
                    NORMAL
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {selectedAthlete.heartRate}
                </h3>
                <p className="text-gray-400 text-sm">Heart Rate (BPM)</p>
                <div className="mt-4 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500/20 rounded-full p-3">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-blue-400 text-sm font-medium">
                    STABLE
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">97</h3>
                <p className="text-gray-400 text-sm">SpO2 (%)</p>
                <div className="mt-4 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "97%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`rounded-full p-3 ${
                      selectedAthlete.risk === "low"
                        ? "bg-green-500/20"
                        : selectedAthlete.risk === "medium"
                        ? "bg-yellow-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-6 w-6 ${
                        selectedAthlete.risk === "low"
                          ? "text-green-400"
                          : selectedAthlete.risk === "medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      selectedAthlete.risk === "low"
                        ? "text-green-400"
                        : selectedAthlete.risk === "medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedAthlete.risk.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {selectedAthlete.risk === "low"
                    ? "15"
                    : selectedAthlete.risk === "medium"
                    ? "45"
                    : "78"}
                </h3>
                <p className="text-gray-400 text-sm">Risk Score</p>
                <div className="mt-4 bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      selectedAthlete.risk === "low"
                        ? "bg-green-500"
                        : selectedAthlete.risk === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width:
                        selectedAthlete.risk === "low"
                          ? "15%"
                          : selectedAthlete.risk === "medium"
                          ? "45%"
                          : "78%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Live ECG Monitoring
                </h3>
                <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Real-time ECG Data</p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-green-400 text-sm">Live Signal</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Health Trends
                </h3>
                <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">7-Day Health Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* CPR Modal */}
        {showCPRModal && <CPRModal />}
      </div>
    </div>
  );
};

export default CoachDashboard;