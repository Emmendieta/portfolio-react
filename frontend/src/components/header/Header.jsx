import Navbar from "./navbar/Navbar";

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