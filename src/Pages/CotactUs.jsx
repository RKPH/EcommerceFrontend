import React, { useState } from "react";
import { Breadcrumbs, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const ContactUs = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        if (!form.phone) newErrors.phone = "Phone number is required";
        if (!form.message) newErrors.message = "Message cannot be empty";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess("");
        if (validateForm()) {
            setLoading(true);
            setTimeout(() => {
                console.log("Form submitted:", form);
                setLoading(false);
                setSuccess("Your message has been sent successfully!");
                setForm({ name: "", email: "", phone: "", message: "" });
                setErrors({});
            }, 2000);
        }
    };

    return (
        <div className="w-full md:px-6 lg:px-[100px] 2xl:px-[200px] p-6 text-gray-900 dark:text-white">
            {/* Breadcrumbs */}
            <div className="mb-6 py-4">

                <nav className="text-base text-gray-600">
                    <Link to="/" className="text-blue-600 hover:underline">Home</Link> &gt;{" "}

                    <span className="text-gray-800">Contact</span>
                </nav>
            </div>

            <div className="text-center mb-5">
                <h1 className="text-4xl font-bold">Get in Touch</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    We’re here to help! Reach out to us anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">📍 Our Office</h2>
                        <p className="text-gray-700 dark:text-gray-400 mt-2">123 Main Street, New York, NY 10001</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">📞 Call Us</h2>
                        <p className="text-gray-700 dark:text-gray-400 mt-2">Available 24/7</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">+1 (123) 456-7890</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">+1 (987) 654-3210</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">📩 Write To Us</h2>
                        <p className="text-gray-700 dark:text-gray-400 mt-2">We'll respond within 24 hours</p>
                        <p className="text-gray-800 dark:text-gray-200">support@company.com</p>
                        <p className="text-gray-800 dark:text-gray-200">help@company.com</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">⏰ Business Hours</h2>
                        <p className="text-gray-700 dark:text-gray-400 mt-2">
                            Monday - Friday: 9 AM - 6 PM
                        </p>
                        <p className="text-gray-700 dark:text-gray-400">
                            Saturday: 10 AM - 4 PM
                        </p>
                        <p className="text-gray-700 dark:text-gray-400">
                            Sunday: Closed
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">🔗 Follow Us</h2>
                        <div className="flex space-x-4 mt-2">
                            <a href="#" className="text-blue-500 hover:text-blue-700"><Facebook /></a>
                            <a href="#" className="text-blue-400 hover:text-blue-600"><Twitter /></a>
                            <a href="#" className="text-pink-500 hover:text-pink-700"><Instagram /></a>
                            <a href="#" className="text-blue-700 hover:text-blue-900"><LinkedIn /></a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white h-fit dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="name" placeholder="Your Name *" value={form.name} onChange={handleChange}
                                   className="p-3 border rounded-lg w-full dark:bg-gray-800 dark:border-gray-600" />
                            <input type="email" name="email" placeholder="Your Email *" value={form.email} onChange={handleChange}
                                   className="p-3 border rounded-lg w-full dark:bg-gray-800 dark:border-gray-600" />
                            <input type="text" name="phone" placeholder="Your Phone *" value={form.phone} onChange={handleChange}
                                   className="p-3 border rounded-lg w-full dark:bg-gray-800 dark:border-gray-600" />
                        </div>
                        <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange}
                                  className="p-3 border rounded-lg w-full dark:bg-gray-800 dark:border-gray-600" rows="4"></textarea>

                        {success && (
                            <p className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded-lg text-center">
                                {success}
                            </p>
                        )}

                        <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all flex justify-center items-center" disabled={loading}>
                            {loading ? <CircularProgress size={24} className="text-white" /> : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Google Map Embed */}
            <div className="mt-10">
                <iframe className="w-full h-96 rounded-lg shadow-lg"
                        src="https://maps.google.com/maps?q=new york&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        allowFullScreen loading="lazy">
                </iframe>
            </div>
        </div>
    );
};

export default ContactUs;
