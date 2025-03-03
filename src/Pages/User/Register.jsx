import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Redux/AuthSlice.js";
import { toast } from "react-toastify";

export function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [passwordShown, setPasswordShown] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const togglePasswordVisibility = () => setPasswordShown((prev) => !prev);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            toast.error("Password must be at least 8 characters, include an uppercase letter and a number.");
            return;
        }

        try {
            await dispatch(registerUser(formData)).unwrap();
            toast.success("A verification code has been sent to your email!");
            navigate("/verify");
        } catch (err) {
            toast.error(err || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 sm:px-6"
             style={{ backgroundImage: `url('https://media.cntraveler.com/photos/5eb18e42fc043ed5d9779733/16:9/w_4288,h_2412,c_limit/BlackForest-Germany-GettyImages-147180370.jpg')` }}
        >
            {/* Logo */}
            <div className="w-full flex flex-col justify-center text-center items-center mb-6 sm:mb-8">
                <Link to="/">
                    <img src="https://micro-front-end-sport-ecommerce-homepage.vercel.app/logo.png" alt="Logo" className="h-20 sm:h-24 mb-2 sm:mb-4" />
                </Link>
                <span className="text-lg sm:text-xl font-bold text-black">Join Sport Ecommerce</span>
            </div>

            {/* Register Card */}
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <h3 className="text-2xl sm:text-3xl text-center font-bold text-blue-gray-800">Sign Up</h3>
                <p className="text-center text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">Create an account to explore amazing products!</p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-gray-900 font-medium mb-1">Your Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-900 font-medium mb-1">Your Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-900 font-medium mb-1">Password</label>
                        <input
                            id="password"
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-9 text-gray-600"
                        >
                            {passwordShown ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {/* Already have an account */}
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-gray-800 hover:text-gray-500 font-medium">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
