import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import './Layout.css';
import Footer from "./components/footer/Footer";

function Layout() {
    return (
            <div className="layout">
                <header id="layoutHeader">
                    <Header />
                </header>
                <main id="layoutMain">
                    <Outlet /> {/* Aquí se va a renderizar el contenido del Body según la ruta */}
                </main>
                <footer className="bg-dark" data-bs-theme="dark" id="layoutFooter">
                    <Footer />
                </footer>
            </div>
    );
};

export default Layout;