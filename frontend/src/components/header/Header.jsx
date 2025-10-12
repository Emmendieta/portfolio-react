import Navbar from "./navbar/Navbar";
import "./Header.css";

function Header() {
    return (
        <>
            <div className="headerDiv">
                <div>
                    <Navbar />
                </div>
                <div id="hdDivLine"></div>
            </div>
        </>
    );
};

export default Header;