import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "", 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempted with:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-sky-600 to-sky-300">
      <div className="absolute w-32 h-32 rounded-full bg-white/10 -top-10 right-10"></div>
      <div className="absolute w-24 h-24 rounded-full bg-white/10 bottom-10 -left-10"></div>
      <div className="absolute w-24 h-24 rounded-full bg-white/10 top-10 left-10"></div>
      <div className="absolute w-16 h-16 rounded-full bg-white/10 top-1/2 right-10"></div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold my-5">Online Job Portal</h1>
        <div className="w-full max-w-md p-8 m-4 bg-white/80 rounded-2xl shadow-2xl transition-transform duration-300">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-center bg-clip-text text-black">
              Sign in
            </h2>
            <p className="text-center text-gray-600 mt-3">
              Please enter your details to sign up
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
              
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="relative  border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-14 w-full rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold"
              >
                <div className="absolute z-10 w-64 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
                <div className="absolute z-10 w-56 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
                <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
                <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
                <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
                <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-400 delay-150 group-hover:delay-200"></div>
                <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-sky-300 delay-150 group-hover:delay-300"></div>

                <p className="z-10">Signup</p>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-500 font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
