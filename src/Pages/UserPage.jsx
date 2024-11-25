import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Redux/AuthSlice"; // Assuming you have a logout action

const UserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser()); // Trigger the logout action
        navigate("/"); // Redirect to homepage after logout
    };

    return (
        <div className="h-screen flex items-center justify-center flex-col">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-3xl text-blue-gray-800 mb-4 text-center">Welcome, {user?.name}</h3>
                <p className="text-gray-600 text-center mb-6">You are logged in!</p>
                <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserPage;
