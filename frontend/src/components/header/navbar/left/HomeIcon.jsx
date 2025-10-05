import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import './HomeIcon.css';

function HomeIcon() {
    return (
        <div>
            <Link to="/">
                <IoHome  id="iconHome"/>
            </Link>
        </div>
    );
};

export default HomeIcon;