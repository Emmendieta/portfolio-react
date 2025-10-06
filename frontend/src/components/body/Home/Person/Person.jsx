import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation } from "react-router-dom";
import { fetchUserPopulated } from "../../profile/logicProfile";

function Person() {
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const location = useLocation();

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user?._id) {
                setLoading(true); //Seteo Loading antes de hacer el fetch
                try {
                    const uid = user._id;
                    const userPopulated = await fetchUserPopulated(uid);
                    const person = await userPopulated.response.person;
                    setUserProfile(person);
                } catch (error) {
                    //LOOGER:
                    console.error("Error loading personal data :", error);
                    //SWEET ALERT:
                    alert("Error loading personal data: ", error);
                } finally {
                    setLoading(false); //Al finaliza, set Loading en false
                }
            };
        };
        loadUserProfile();
    }, [user]);

    //VER DE CAMBIAR:
    if (!userProfile) return <p>Loading personal information...</p>

    if (!userProfile) return <p>No personal information available.</p>;

    return (
        <div id="divPerson">
            <div id="divPersonTitle">
                <h3>Personal information:</h3>
            </div>
            <div className="card cardPerson" id="divCard">
                <div>
                    <img src={userProfile.thumbnails?.[0] || "/img/imagen-no-disponible.png"}
                        alt={userProfile._id}
                        className="personImage"
                        onError={(event) => event.currentTarget.src = "/img/imagen-no-disponible.png"}
                    />
                </div>
                <div className="card-body">
                    <ProfileField label="First Name: " value={userProfile ? userProfile.firstName : "-"} />
                    <ProfileField label="Last Name: " value={userProfile ? userProfile.lastName : "-" } />
                    <ProfileField label="Birthday: " value={userProfile ? userProfile.birthday : "-"} />
                    <ProfileField label="Job Titles: " value={userProfile ? userProfile.jobTitles: "-"} />
                    <ProfileField label="Province: " value={userProfile ? userProfile.province: "-"} />
                    <ProfileField label="Country: " value={userProfile ? userProfile.country: "-"} />
                    <ProfileField label="About Me: " value={userProfile ? userProfile.about: "-"} />
                </div>
            </div>
        </div>
    )
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

export default Person;