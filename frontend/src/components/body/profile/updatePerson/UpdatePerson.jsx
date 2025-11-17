import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { handleUpdatePerson } from "./logicUpdatePerson";
import "./UpdatePerson.css";
import ThumbnailsManagerPerson from "./ThumbnailsManager/ThumbnailsManagerPerson";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function UpdatePerson() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const { person } = location.state || {};
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const [personId] = useState(person?._id || "");
    const [updateFirstName, setFirstName] = useState(person?.firstName || "");
    const [updateLastName, setLastName] = useState(person?.lastName || "");
    const [updateDNI, setDNI] = useState(person?.dni || "");
    const [updateCUIL, setCUIL] = useState(person?.cuil || "");
    const [updateBirthday, setBirthday] = useState(person?.birthday?.slice(0, 10) || "");
    const [updateJobTitles, setJobTitles] = useState(person?.jobTitles?.[language] || "");
    const [updateCity, setCity] = useState(person?.city || "");
    const [updateProvince, setProvince] = useState(person?.province || "");
    const [updateCountry, setCountry] = useState(person?.country || "");
    const [updateAbout, setAbout] = useState(person?.about?.[language] || "");
    const [profileImages, setProfileImages] = useState(person?.thumbnails || []);
    const [bannerImages, setBannerImages] = useState(person?.banners || []);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/forbidden");
            return;
        };
        const checkUserPerson = async () => {
            if (!user || !person) {
                await errorSweet("User or person data not found!");
                navigate("/profile");
            };
        };
        checkUserPerson();
    }, [person, user, navigate, errorSweet]);

    const TEXT = LANG_CONST[language];

    useEffect(() => {
        if (!person) return;

        setJobTitles(person?.jobTitles?.[language] || "");
        setAbout(person?.about?.[language] || "");

    }, [language, person]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            firstName: updateFirstName,
            lastName: updateLastName,
            dni: updateDNI,
            cuil: updateCUIL,
            birthday: updateBirthday,
            jobTitles: { ...person.jobTitles, [language]: updateJobTitles },
            about: { ...person.about, [language]: updateAbout },
            city: updateCity,
            province: updateProvince,
            country: updateCountry,
            thumbnails: profileImages,
            banners: bannerImages
        };

        const updatedPerson = await handleUpdatePerson({
            pid: personId,
            data,
            successSweet,
            errorSweet,
        });

        if (updatedPerson) {
            navigate("/profile", { state: { updatedPerson } });
        }
    };

    return (
        <div id="updateSectionPerson">
            <div id="updateSectDivPerson">
                <div id="updateDataDivSectTop">
                    <h2 id="updateDataDivH2TitlePerson">{TEXT.UPDATE_PERSON_TITLE}</h2>
                </div>
                <div id="divUpdateData">
                    <form onSubmit={handleSubmit} id="formUpdateData">
                        <div id="updateDataFormBody">
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">Id: </label>
                                <input type="text" value={personId} disabled={true} onChange={(e) => personId(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.FIRST_NAME} </label>
                                <input type="text" value={updateFirstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.LAST_NAME} </label>
                                <input type="text" value={updateLastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.DNI} </label>
                                <input type="number" value={updateDNI} onChange={(e) => setDNI(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.CUIL} </label>
                                <input type="number" value={updateCUIL} onChange={(e) => setCUIL(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.BIRTHDAY} </label>
                                <input type="date" value={updateBirthday} onChange={(e) => setBirthday(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.JOB_TITLE} ({language.toUpperCase()}): </label>
                                <input type="text" value={updateJobTitles} onChange={(e) => setJobTitles(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.ABOUT} ({language.toUpperCase()}): </label>
                                <input type="text" value={updateAbout} onChange={(e) => setAbout(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.CITY} </label>
                                <input type="text" value={updateCity} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.PROVINCE} </label>
                                <input type="text" value={updateProvince} onChange={(e) => setProvince(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.COUNTRY} </label>
                                <input type="text" value={updateCountry} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                            <div id="thumbnailsManageProfile">
                                {/* Imagenes */}
                                <ThumbnailsManagerPerson
                                    thumbnails={profileImages}
                                    setThumbnails={setProfileImages}
                                    title={TEXT.PROFILE_IMAGES}
                                />
                            </div>

                            <div id="thumbnailsManageBanner">
                                <ThumbnailsManagerPerson
                                    thumbnails={bannerImages}
                                    setThumbnails={setBannerImages}
                                    title={TEXT.PROFILE_BANNER_IMAGES}
                                />
                            </div>

                        </div>

                        <div id="updateDataformBottom">
                            <a className="btn btn-outline-success" href="/profile">{TEXT.GO_BACK}</a>
                            <button type="submit" className="btn btn-outline-success" id="btnUpdatePersonalData">{TEXT.PROFILE_UPDATE_PERSONAL_DATA}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdatePerson;
