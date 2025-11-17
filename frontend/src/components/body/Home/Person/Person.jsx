import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchPerson } from "./Person";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import "./Person.css";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function Person() {
    const { user } = useContext(UserContext);
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

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
                const TEXT = LANG_CONST[language];
                if (!peopleArray || !Array.isArray(peopleArray) || peopleArray.length === 0) {
                    //LOGGER
                    console.error(TEXT.ERROR_SWEET_TEXT_PERSON_NO_DATA);
                    await errorSweet(TEXT.ERROR_SWEET_TEXT_PERSON_NO_DATA);
                    setLoading(false);
                    return;
                }

                setPerson(peopleArray[0]);

            } catch (error) {
                console.error(TEXT.ERROR_SWEET_TEXT_PERSON_LOADING, error);
                await errorSweet(TEXT.ERROR_SWEET_TEXT_PERSON_LOADING + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };

        loadPerson();
    }, []);

    const TEXT = LANG_CONST[language];

    //VER DE CAMBIAR:
    if (!person) return <p>{TEXT.NO_PERSON}</p>;

    const jobTitles = person.jobTitles?.[language] || person.jobTitles?.[Object.keys(person.jobTitles)[0]] || "-";
    const about = person.about?.[language] || person.about?.[Object.keys(person.about)[0]] || "-";

    return (
        <div id="divPerson">
            <div id="divPersonTitle">
                <h3>{TEXT.PERSONAL_INFORMATION}</h3>
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
                        onError={(e) => {
                            e.currentTarget.src = "/img/imagen-no-disponible.png";
                        }}
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
                            <ProfileField label={TEXT.FIRST_NAME} value={person.firstName} />
                            <ProfileField label={TEXT.LAST_NAME} value={person.lastName} />
                            <ProfileField label={TEXT.BIRTHDAY} value={person.birthday.slice(0, 10)} />
                            <ProfileField label={TEXT.JOB_TITLE} value={jobTitles} />
                            <ProfileField label={TEXT.PROVINCE} value={person.province} />
                            <ProfileField label={TEXT.COUNTRY} value={person.country} />
                        </div>
                        <div id="cardBodyAbout">
                            <h3 className="profileDivH3">{TEXT.ABOUT_ME} </h3>
                            <h3 className="profileDivH3">{about}</h3>
                            <Link to="/more-about-me" className="divMoreAboutMe" state={{ person }}>
                                <button className="btn btn-outline-primary" id="btnMoreAboutMe">{TEXT.MORE_ABOUT_ME}</button>
                            </Link>
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
