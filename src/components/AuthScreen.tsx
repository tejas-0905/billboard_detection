import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "login") {
      const success = await login(email, password);
      if (!success) setError("Invalid credentials");
    } else {
      if (!name) {
        setError("Name is required");
        return;
      }
      const success = await register(name, email, password);
      if (!success) setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 px-2">
      <div className="bg-white/90 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-500 rounded-full p-3 shadow-lg mb-2">
            {/* Shield SVG logo */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="12" fill="#3B82F6"/>
              <path
                d="M12 4.5l6 2.25v4.75c0 4.14-2.67 7.86-6 8.75-3.33-.89-6-4.61-6-8.75V6.75L12 4.5z"
                stroke="#fff"
                strokeWidth="1.5"
                fill="#2563eb"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1 tracking-tight">
            BillboardGuard
          </h1>
          <p className="text-sm text-gray-500 text-center">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-lg font-semibold shadow transition"
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        {error && <div className="text-red-600 text-center mt-3">{error}</div>}
        <div className="mt-6 text-center">
          {mode === "login" ? (
            <span>
              Don't have an account?{" "}
              <button
                className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
                type="button"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
                type="button"
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
      <div className="mt-8 text-white text-xs opacity-70 text-center">
        &copy; {new Date().getFullYear()} BillboardGuard. All rights reserved.
      </div>
    </div>
  );
};

export default AuthScreen;