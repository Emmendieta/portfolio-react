import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { handleUpdatePerson } from "./logicUpdatePerson";
import "../updateUser//UpdateUser.css";

function UpdatePerson() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const { person } = location.state || {};

    const [personId] = useState(person?._id || "");
    const [updateFirstName, setFirstName] = useState(person?.firstName || "");
    const [updateLastName, setLastName] = useState(person?.lastName || "");
    const [updateDNI, setDNI] = useState(person?.dni || "");
    const [updateCUIL, setCUIL] = useState(person?.cuil || "");
    const [updateBirthday, setBirthday] = useState(person?.birthday?.slice(0, 10) || "");
    const [updateJobTitles, setJobTitles] = useState(person?.jobTitles || "");
    const [updateCity, setCity] = useState(person?.city || "");
    const [updateProvince, setProvince] = useState(person?.province || "");
    const [updateCountry, setCountry] = useState(person?.country || "");
    const [updateAbout, setAbout] = useState(person?.about || "");
    //FALTA LA OPCION PARA ACTUALIZAR LAS IMAGENES!
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            //LOGGER:
            console.error("User not Found!");
            //SWEET ALERT:
            alert("User not Found!");
            navigate("/profile");
        };
        if (!person) {
            //LOGGER:
            console.error("Person not Found!");
            //SWEET ALERT:
            alert("Person not Found!");
            navigate("/profile");
        };
    }, [person, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            firstName: updateFirstName,
            lastName: updateLastName,
            //VER PARA DESPUES DE ACTUALIZAR EL DNI Y CUIL
/*             dni: updateDNI,
            cuil: updateCUIL, */
            birthday: updateBirthday,
            jobTitles: updateJobTitles,
            about: updateAbout,
            city: updateCity,
            province: updateProvince,
            country: updateCountry,
            thumbnails: []
        };

        const updatedPerson = await handleUpdatePerson({
            pid: person._id,
            data
        });

        if(UpdatePerson) {
            navigate("/profile", { state: { updatedPerson }});
        };
    };

    return (
        <div id="updateSection">
            <div id="updateDataDivSectTop">
                <h2 id="updateDataDivH2Title">Update Personal Data:</h2>
            </div>
            <div id="divUpdateData">
                <form onSubmit={handleSubmit} id="formUpdateData">
                    <div id="updateDataFormBody">
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Id: </label>
                            <input type="text" value={personId} disabled={true} onChange={(e) => personId(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">First Name: </label>
                            <input type="text" value={updateFirstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Last Name: </label>
                            <input type="text" value={updateLastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">DNI: </label>
                            <input type="number" value={updateDNI} disabled={true} onChange={(e) => setDNI(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">CUIL: </label>
                            <input type="number" value={updateCUIL} disabled={true} onChange={(e) => setCUIL(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Birthday: </label>
                            <input type="date" value={updateBirthday} onChange={(e) => setBirthday(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Job Titles: </label>
                            <input type="text" value={updateJobTitles} onChange={(e) => setJobTitles(e.target.value)} />
                        </div>                        
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">About: </label>
                            <input type="text" value={updateAbout} onChange={(e) => setAbout(e.target.value)} />
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">City: </label>
                            <input type="text" value={updateCity} onChange={(e) => setCity(e.target.value)}/>
                        </div>                        
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Province: </label>
                            <input type="text" value={updateProvince} onChange={(e) => setProvince(e.target.value)}/>
                        </div>
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Country: </label>
                            <input type="text" value={updateCountry} onChange={(e) => setCountry(e.target.value)}/>
                        </div>                        
                        <div className="updateDataDivDiv">
                            <label className="updateDataDivh3">Images: </label>
                            <input type="" />
                        </div>                       
                    </div>
                    <div id="updateDataformBottom">
                        <a className="btn btn-outline-success"  type="submit" id="btnGoBack" href="/profile">Go Back</a>
                        <button type="submit" className="btn btn-outline-success" id="btnUpdatePersonalData">Update Personal Data</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePerson;