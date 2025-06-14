import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  Eye,
  EyeOff,
  ArrowRight,
  Shield
} from 'lucide-react';

const Login = ({ onLogin, onGoToRegister }) => {
  const [userRole, setUserRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (!userRole) {
      setErrorMsg('Please select a role.');
      return;
    }
    if (!email || email.length < 8) {
      setErrorMsg('Email must be at least 8 characters.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setErrorMsg('');
    // Extract username before '@'
    const name = email.split('@')[0];
    onLogin(userRole, name);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-gray-900/30"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3 mr-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">STOMP</h1>
          </div>
          <p className="text-gray-400 text-lg">Cardiac Monitoring System</p>
          <p className="text-gray-500 text-sm mt-2">Early Detection • Real-time Monitoring • Emergency Alerts</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sign In</h2>
          
          <div className="space-y-6">
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-700/20 text-red-400 text-sm rounded-lg px-4 py-2 mb-2 text-center">
                {errorMsg}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Login as</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${userRole === 'athlete' 
                    ? 'border-red-500 bg-red-500/10 text-red-400' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'}`}
                  onClick={() => setUserRole('athlete')}
                  type="button"
                >
                  <User className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Athlete</span>
                </button>
                <button 
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${userRole === 'coach' 
                    ? 'border-red-500 bg-red-500/10 text-red-400' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'}`}
                  onClick={() => setUserRole('coach')}
                  type="button"
                >
                  <Shield className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Coach</span>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userRole || !email || !password}
              onClick={handleLogin}
              type="button"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button className="text-red-400 hover:text-red-300 text-sm transition-colors" type="button">
                Forgot your password?
              </button>
            </div>

            {/* Create Account Button */}
            <div className="text-center">
              <button
                className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors"
                type="button"
                onClick={onGoToRegister}
              >
                Create your account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Protected by advanced encryption • HIPAA Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;