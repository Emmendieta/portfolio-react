import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { fetchUserPopulated } from "./logicProfile";
import './Profile.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { LANG_CONST } from "../../constants/selectConstLang.js";

function Profile() {
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const updatedPerson = location.state?.updatedPerson;

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        const loadUserProfile = async () => {
            if (user?._id) {
                const uid = user._id;
                const userPopulated = await fetchUserPopulated(uid);
                setUserProfile({
                    ...userPopulated?.response,
                    person: updatedPerson?.response || userPopulated?.response?.person
                });
            };
        };
        loadUserProfile();
    }, [user, updatedPerson]);

    const TEXT = LANG_CONST[language];

    //Ver de cambiar:
    if (!userProfile) return <p>Loading profile...</p>

    const { _id, user: username, email, person } = userProfile;
    const jobTitles = person?.jobTitles?.[language] || person?.jobTitles?.[Object.keys(person.jobTitles)[0]] || "-";
    const about = person?.about?.[language] || person?.about?.[Object.keys(person.about)[0]] || "-";
    return (
        <div id="divProfile">
            {/* USER SECTION */}
            <div id="profileDiv">
                <section id="profileDivSectTop">
                    <h2 id="profileDivH2Title">{TEXT.PROFILE_TITLE}</h2>
                </section>
                <section id="profileDivSectMiddle">
                    <ProfileField label="ID: " value={_id} />
                    <ProfileField label={TEXT.PROFILE_LABEL_USER_NAME} value={username} />
                    <ProfileField label="Email: " value={email} />
                </section>
                <section id="profileDivSectBottom">
                    <div className="profileDivDivBottom">
                        <a className="btn btn-outline-success" id="btnUpdateUserData" href="/update-user">{TEXT.PROFILE_UPDATE_USER_DATA}</a>
                    </div>
                </section>
            </div>

            {/* PERSON SECTION */}
            <div id="profileDivPerson">
                <section id="profileDivSectTop">
                    <h2 id="profileDivH2Title">{TEXT.PROFILE_PERSONAL_TITLE}</h2>
                </section>
                <section id="profileDivDivSectMiddle">
                    <ProfileField label={TEXT.FIRST_NAME} value={person ? person.firstName : "-"} />
                    <ProfileField label={TEXT.LAST_NAME} value={person ? person.lastName : "-"} />
                    <ProfileField label={TEXT.DNI} value={person ? person.dni : "-"} />
                    <ProfileField label={TEXT.CUIL} value={person ? person.cuil : "-"} />
                    <ProfileField label={TEXT.BIRTHDAY} value={person ? person.birthday?.slice(0, 10) : "-"} />
                    <ProfileField label={TEXT.JOB_TITLE} value={jobTitles} />
                    <ProfileField label={TEXT.CITY} value={person ? person.city : "-"} />
                    <ProfileField label={TEXT.PROVINCE} value={person ? person.province : "-"} />
                    <ProfileField label={TEXT.COUNTRY} value={person ? person.country : "-"} />
                    <ProfileField label={TEXT.ABOUT} value={about} />

                    <div className="profileImagesContainer">
                        {person && person.thumbnails && person.thumbnails.length > 0 && (
                            <div className="profileImagesSection">
                                <h4>{TEXT.PROFILE_IMAGES}</h4>
                                <div className="imageGrid">
                                    {person.thumbnails.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="profileThumbnailImg"
                                            onError={(e) => (e.currentTarget.src = "/img/imagen-no-disponible.png")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {person && person.banners && person.banners.length > 0 && (
                            <div className="profileImagesSection">
                                <h4>{TEXT.PROFILE_BANNER_IMAGES}</h4>
                                <div className="imageGrid">
                                    {person.banners.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`Banner ${idx + 1}`}
                                            className="profileThumbnailImg"
                                            onError={(e) => (e.currentTarget.src = "/img/imagen-no-disponible.png")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </section>
                <section id="profileDivSectBottom">
                    <div className="profileDivDivBottom">
                        <Link className="btn btn-outline-success" id="btnUpdatePersonData" to="/update-person" state={{ person }}>{TEXT.PROFILE_UPDATE_PERSONAL_DATA}</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};


//VER SI LO DEJO EN LA LOGICA:
function ProfileField({ label, value }) {
    return (
        <div className="profileDivDiv">
            <h3 className="profileDivH3">{label}</h3>
            <h3 className="profileDivH3">{value || "-"}</h3>
        </div>
    );
};

export default Profile;