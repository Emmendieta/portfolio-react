import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { fetchUserPopulated } from "./logicProfile";
import './Profile.css';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const { user } = useContext(UserContext);


    useEffect(() => {
        const loadUserProfile = async () => {
            if(!user?._id) {
                //SWEET ALERT
                alert("Error getting the Id from the user!");
                return;
            };
            const uid = user._id;
            const userPopulated = await fetchUserPopulated(uid);
            setUserProfile(userPopulated?.response);
        };
        loadUserProfile();
    }, [user]);

    //Ver de cambiar:
    if(!userProfile) return <p>Loading profile...</p>

    const {_id, user: username, email, person } = userProfile;

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
                    <ProfileField label="First Name: " value={person?.firstName} />
                    <ProfileField label="Last Name: " value={person?.lastName} />
                    <ProfileField label="DNI: " value={person?.dni} />
                    <ProfileField label="CUIL: " value={person?.cuil} />
                    <ProfileField label="Birthday: " value={person?.birthday?.slice(0,10)} />
                    <ProfileField label="Job Title: " value={person?.jobTitle} />
                    <ProfileField label="City: " value={person?.city} />
                    <ProfileField label="Province: " value={person?.province} />
                    <ProfileField label="Country: " value={person?.country} />
                    <ProfileField label="About: " value={person?.about} />
                    <ProfileField label="Images: " value={(person?.thumbnails || []).join(", ")} />                    
                </section>
                <section id="profileDivSectBottom">
                    <div className="profileDivDivBottom">
                        <a className="btn btn-outline-success" id="btnUpdatePersonData" href="/update-person">Update Person Data</a>
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