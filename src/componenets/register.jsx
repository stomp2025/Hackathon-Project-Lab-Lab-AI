import React, { useState } from "react";

const Register = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('athlete');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd typically make an API call to register the user
    // For demo, just return to login
    onRegisterSuccess();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Create Your Account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            >
              <option value="athlete">Athlete</option>
              <option value="coach">Coach</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200"
          >
            Register
          </button>
          <div className="text-center">
            <button
              className="text-gray-400 hover:text-gray-300 text-xs transition-colors"
              type="button"
              onClick={onRegisterSuccess}
            >
              Already have an account? Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;