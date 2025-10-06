import Navbar from "./navbar/Navbar";
import "./Header.css";

function Header() {
    return (
        <>
            <header className="bg-dark">
                <div>
                    <Navbar />
                </div>
                <div id="hdDivLine"></div>
            </header>
        </>
    );
};

export default Header;