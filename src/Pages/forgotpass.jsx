import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://103.155.161.94:3000/api/v1/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            alert("Email sent! Check your email.");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <p className="text-gray-600 mb-6 text-center">
                    Enter your email to receive a reset code.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Code"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
