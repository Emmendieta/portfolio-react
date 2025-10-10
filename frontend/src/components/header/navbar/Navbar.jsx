import { Link } from "react-router-dom";
import HomeIcon from "./left/HomeIcon";
import { useContext } from "react";
import { UserContext } from '../../../context/UserContext';
import '../navbar/Navbar.css';
import { signOutUser } from "../../../helpers/auth.js";

function Navbar() {
    const { user, loadingUser } = useContext(UserContext);

    const handleSignOut = async () => {
        try {

            const result = await signOutUser();
            if (result?.error) {
                //LOGGER:
                console.error("Signout fail: ", result);
                return;
            };
            window.location.reload();
        } catch (error) {
            //LOGGER:
            console.error("Error while implementing signout!")
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id="navbar">
            <div className="container-fluid" id="containerFuild">
                <div className="navbarLeft">
                    <HomeIcon />
                </div>
                <div className="navbarCenter">
                    <h4 id='signatureH4'>Emiliano Manuel Mendieta</h4>
                </div>
                <div className="navbarRight">
                    {!loadingUser && (
                        user ? (
                            <>
                                <Link to="/profile" className="btn btn-outline-success" id="btnProfile"> Profile </Link>
                                {user.role === "admin" && (
                                    <Link to="/users" className="btn btn-outline-success" id="btnUsers">Users</Link>
                                )} 
                                <button className="btn btn-outline-danger" onClick={handleSignOut} id="btnSignout"> Signout </button>
                            </>
                        ) : ( <Link to="/login" className="btn btn-outline-success"> Login </Link> )
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;