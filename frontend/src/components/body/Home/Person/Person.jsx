import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchPerson } from "./Person";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import "./Person.css";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";

function Person() {
    const { user } = useContext(UserContext);
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadPerson = async () => {

            try {
                startLoading();
                const response = await fetchPerson();
                if (response?.error) {
                    await errorSweet(response.error.message);
                    setLoading(false);
                    return;
                };
                const peopleArray = response.response;

                if (!peopleArray || !Array.isArray(peopleArray) || peopleArray.length === 0) {
                    //LOGGER
                    console.error("No person data found!");
                    await errorSweet("No person data found!");
                    setLoading(false);
                    return;
                }

                setPerson(peopleArray[0]);

            } catch (error) {
                console.error("Error loading Person:", error);
                await errorSweet("Error loading Person: " + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };

        loadPerson();
    }, []);

    //VER DE CAMBIAR:
    if (!person) return <p>No person data available.</p>;

    return (
        <div id="divPerson">
            <div id="divPersonTitle">
                <h3>Personal information:</h3>
                {user?.role === "admin" && (
                    <div className="editionControlsPerson">
                        <Link
                            to="/update-person"
                            state={{ person }}
                            className="btn btn-outline-primary btn-sm"
                            id="btnPersonEdit"
                        >
                            <FaPen id="faPenPersonEdit" />
                        </Link>
                    </div>
                )}
            </div>

            <div className="personWrapper">
                <div id="bannerContainer">
                    <img
                        src={person.banners?.[0] || "/img/imagen-no-disponible.png"}
                        alt="Banner"
                        className="bannerImage"
                    />
                </div>

                <img
                    src={person.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                    alt={person._id}
                    className="profileImage"
                    onError={(e) => {
                        e.currentTarget.src = "/img/imagen-no-disponible.png";
                    }}
                />

                <div className="card cardPerson" id="divCard">
                    <div className="card-body" id="cardBodyPerson">
                        <div id="cardBodyPersonal">
                            <ProfileField label="First Name: " value={person.firstName} />
                            <ProfileField label="Last Name: " value={person.lastName} />
                            <ProfileField label="Birthday: " value={person.birthday.slice(0, 10)} />
                            <ProfileField label="Job Titles: " value={person.jobTitles} />
                            <ProfileField label="Province: " value={person.province} />
                            <ProfileField label="Country: " value={person.country} />
                        </div>
                        <div id="cardBodyAbout">
                            <h3 className="profileDivH3">About Me: </h3>
                            <h3 className="profileDivH3">{person.about || "-"}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

//VER SI ESTO LO DEJO COMO GENERAL:
function ProfileField({ label, value }) {
    return (
        <div className="profileDivDiv">
            <h3 className="profileDivH3">{label}</h3>
            <h3 className="profileDivH3">{value || "-"}</h3>
        </div>
    );
};

export default Person;
