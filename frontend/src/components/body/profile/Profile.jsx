import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { fetchUserPopulated } from "./logicProfile";
import './Profile.css';
import { Link, useLocation } from "react-router-dom";

function Profile() {
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    const location = useLocation();
    const updatedPerson = location.state?.updatedPerson;

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user?._id) {
                const uid = user._id;
                const userPopulated = await fetchUserPopulated(uid);
                setUserProfile({
                    ...userPopulated?.response, 
                    person: updatedPerson?.response || userPopulated?.response?.person
                });
            }
        };
    loadUserProfile();
}, [user, updatedPerson]);

    //Ver de cambiar:
    if (!userProfile) return <p>Loading profile...</p>

    const { _id, user: username, email, person } = userProfile;

    return (
        <div id="divProfile">
            {/* USER SECTION */}
            <div id="profileDiv">
                <section id="profileDivSectTop">
                    <h2 id="profileDivH2Title">Profile Data:</h2>
                </section>
                <section id="profileDivSectMiddle">
                    <ProfileField label="ID: " value={_id} />
                    <ProfileField label="User Name: " value={username} />
                    <ProfileField label="Email: " value={email} />
                </section>
                <section id="profileDivSectBottom">
                    <div className="profileDivDivBottom">
                        <a className="btn btn-outline-success" id="btnUpdateUserData" href="/update-user">Update User Data</a>
                    </div>
                </section>
            </div>

            {/* PERSON SECTION */}
            <div id="profileDivPerson">
                <section id="profileDivSectTop">
                    <h2 id="profileDivH2Title">Personal Data:</h2>
                </section>
                <section id="profileDivDivSectMiddle">
                    <ProfileField label="First Name: " value={person ? person.firstName : "-"} />
                    <ProfileField label="Last Name: " value={person ? person.lastName : "-"} />
                    <ProfileField label="DNI: " value={person ? person.dni : "-"} />
                    <ProfileField label="CUIL: " value={person ? person.cuil : "-"} />
                    <ProfileField label="Birthday: " value={person ? person.birthday?.slice(0, 10) : "-"} />
                    <ProfileField label="Job Title: " value={person ? person.jobTitles : "-"} />
                    <ProfileField label="City: " value={person ? person.city : "-"} />
                    <ProfileField label="Province: " value={person ? person.province : "-"} />
                    <ProfileField label="Country: " value={person ? person.country : "-"} />
                    <ProfileField label="About: " value={person ? person.about : "-"} />
                    <ProfileField label="Images: " value={person && person.thumbnails? person.thumbnails.join(", ") : "-"} />
                </section>
                <section id="profileDivSectBottom">
                    <div className="profileDivDivBottom">
                        <Link className="btn btn-outline-success" id="btnUpdatePersonData" to="/update-person" state={{ person }}>Update Person Data</Link>
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