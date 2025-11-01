import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { useLoading } from "../../../../../context/LoadingContext";
import GeneralFieldsDark from "../../GeneralFieldsDark/GeneralFieldsDark";
import "./MoreAboutMe.css";

function MoreAboutMe() {

    const { user } = useContext(UserContext);
    const location = useLocation();
    const { person } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadPerson = async () => {
            try {
                startLoading();
                await new Promise(res => setTimeout(res, 500)); //Simulo para que aparezca el sweet
                if (!person) {
                    await errorSweet("Error loading person!");
                    setLoading(false);
                    navigate("*");
                }
            } catch (error) {
                console.error("Error loading Person:", error);
                await errorSweet("Error loading Person: " + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };

        loadPerson();

        if (person && person.thumbnails.length > 0) {
            const carouselElement = document.getElementById('carouselExampleSlidesOnly');
            const carousel = new window.bootstrap.Carousel(carouselElement);;
            carousel.cycle();
        };

    }, [person]);

    return (
        <div id="moreAbout">
            <div id="moreAboutTopThumbs">
                <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {(person.thumbnails.length > 0 ? person.thumbnails : ["/img/imagen-no-disponible.png"]).map((img, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}  >
                                <img src={img} id="imgThumbnails" alt={`Thumbnail ${index + 1}`} onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div id="moreAboutMiddleInfo">
                <GeneralFieldsDark label="First Name: " value={person.firstName} />
                <GeneralFieldsDark label="Last Name: " value={person.lastName} />
                <GeneralFieldsDark label="Birthday: " value={person.birthday.slice(0, 10)} />
                <GeneralFieldsDark label="Jobs Titles: " value={person.jobTitles} />
                <GeneralFieldsDark label="Location: " value={person.city + " - " + person.province + " - " + person.country} />
                <GeneralFieldsDark label="About Me:" value={person.about} isTextArea />
            </div>
            <div id="moreAboutMapContainer">
                <h3 id="mapTitle">My Location</h3>
                <div id="mapWrapper">
                    <iframe
                        title="Google Map"
                        width="100%"
                        height="350"
                        style={{ border: 0, borderRadius: "10px" }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                            `${person.city}, ${person.province}, ${person.country}`
                        )}&t=&z=6&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                </div>
            </div>
            <div id="moreAboutBottom">
                <Link className="moreAboutBottomLink" to="/">
                    <button className="btn btn-outline-success">Home</button>
                </Link>
                <Link className="moreAboutBottomLink" to="/contact-me">
                    <button className="btn btn-outline-success">Contact Me!</button>
                </Link>
            </div>
        </div>
    );
};

export default MoreAboutMe;