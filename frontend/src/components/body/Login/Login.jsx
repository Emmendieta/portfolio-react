import { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { getCurrentUser, loginUser } from "../../../helpers/auth.js";
import { useConfirmSweet } from "../../../context/SweetAlert2Context.jsx";

function Login() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { successSweet, errorSweet } = useConfirmSweet();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            if (!email || !password) {
                await errorSweet("You must complete all fields!");
                return;
            };

            const { user, error, message } = await loginUser(email, password);

            if (error || !user) {
                await errorSweet(message || "Login Failed or invalid credentials!");
                return;
            };

            const { user: freshUser } = await getCurrentUser();
            setUser(freshUser);
            await successSweet("Login Success!");
            navigate("/");

        } catch (error) {
            console.error(error.message);
            await errorSweet("Ooooppsss! An error has occurred. Error: " + error.message);
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleLogin(event);
        };
    };


    return (
        <div id="logDivBody">
            <div id="loginDiv">
                <div id="logDivTop">
                    <h1 id="logDivH1">Login</h1>
                </div>
                <div id="logDivForm">
                    <form id="logForm" onSubmit={handleLogin}>
                        <div className="mb-3 lofFmDiv">
                            <label htmlFor="inputEmailLogin" className="form-label">Email:</label>
                            <input type="email" className="form-control" placeholder="example@example.com" id="inputEmailLogin" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress} />
                        </div>
                        <div className="mb-3 logFmDiv">
                            <label htmlFor="inputPasswordLogin" className="form-label">Password:</label>
                            <input type="password" className="form-control" placeholder="Type your password" id="inputPasswordLogin" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress} />
                        </div>
                        <div id="logFormDivBtns">
                            <button className="btn btn-outline-success" type="button" id="btnGoBack" value="Home" onClick={() => navigate("/")}>Home</button>
                            <button className="btn btn-outline-success" type="button" id="btnLoginForm" value="Login" onClick={handleLogin}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;