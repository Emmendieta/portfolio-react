import { Link } from "react-router-dom";
import HomeIcon from "./left/HomeIcon";
import { useContext } from "react";
import { UserContext } from '../../../context/UserContext';
import '../navbar/Navbar.css';
import { signOutUser } from "../../../helpers/auth.js";
import { useConfirmSweet } from "../../../context/SweetAlert2Context.jsx";
import LanguageSelector from "./right/LanguageSelector.jsx";
import { LANG_CONST } from "../../constants/selectConstLang.js";
import { useLanguage } from "../../../context/LanguageContext.jsx";

function Navbar() {
    const { user, loadingUser } = useContext(UserContext);
    const { successSweet } = useConfirmSweet();
    const { language } = useLanguage();

    const TEXT = LANG_CONST[language];

    const handleSignOut = async () => {
        try {

            const result = await signOutUser();
            if (result?.error) {
                //LOGGER:
                console.error(TEXT.ERROR_SWEET_TEXT_SIGNOUT_ERROR, result);
                return;
            };
            await successSweet(TEXT.SUCCESS_SWEET_SIGNOUT_SUCCESS);
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
                    <LanguageSelector />
                </div>
                <div className="navbarCenter">
                    <h4 id='signatureH4'>{TEXT.EMILIANO_MENDIETA}</h4>
                </div>
                <div className="navbarRight">
                    <Link to="/pdf/export-view" className="btn btn-outline-success" id="btnUsers">{TEXT.CURRICULUM_VITAE}</Link>
                    {!loadingUser && (
                        user ? (
                            <>
                                <Link to="/profile" className="btn btn-outline-success" id="btnProfile">{TEXT.PROFILE}</Link>
                                <button className="btn btn-outline-danger" onClick={handleSignOut} id="btnSignout">{TEXT.SIGNOUT}</button>
                            </>
                        ) : (<Link to="/login" className="btn btn-outline-success">{TEXT.LOGIN}</Link>)
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;