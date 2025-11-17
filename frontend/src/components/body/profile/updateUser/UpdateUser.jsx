import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { handleUpdateUser } from "./logicUpdateUser";
import "./UpdateUser.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { LANG_CONST } from "../../../constants/selectConstLang.js";
import { useLanguage } from "../../../../context/LanguageContext.jsx";

function UpdateUser() {
    const { user, setUser } = useContext(UserContext);
    const [updateEmail, setUpdatedEmail] = useState(user?.email || "");
    const [updateUserName, setUpdatedUserName] = useState(user?.user || "");
    const [updatePassword, setUpdatedPassword] = useState(user?.password || "");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updateRole, setUpdatedRole] = useState(user?.role || "");
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

    useEffect(() => {
        const TEXT = LANG_CONST[language];
        const checkUser = async () => {
            if (!user) {
            navigate("/forbidden");
            return;
        };
            if (!user) {
                //LOGGER:
                console.error(TEXT.USER_NOT_FOUND);
                await errorSweet(TEXT.USER_NOT_FOUND);
                navigate("/profile");
            };
        };
        checkUser();
    }, [user, navigate]);

    const TEXT = LANG_CONST[language];

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (updatePassword !== confirmPassword) {
            await errorSweet(TEXT.PASSWORDS_NOT_MATCH);
            return;
        };

        const data = {
            //FALTA PARA FUTURO DE QUE SE PUEDA ACTUALIZAR EL EMAIL Y EL USER NAME:
            /* user: updateUserName, */
            /* email: updateEmail, */
            password: updatePassword,
            role: updateRole
        };

        handleUpdateUser({
            uid: user._id,
            data,
            setUser,
            navigate,
            successSweet,
            errorSweet
        });
    };

    return (
        <div id="updateSection">
            <div id="updateSectDiv">
                <div id="updateDataDivSectTop">
                    <h2 id="updateDataDivH2Title">{TEXT.UPDATE_USER_TITLE}</h2>
                </div>
                <div id="divUpdateData">
                    <form onSubmit={handleSubmit} id="formUpdateData">
                        <div id="updateDataformBody">
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">Id: </label>
                                <input type="text" value={user._id} disabled={true}/>
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.PROFILE_LABEL_USER_NAME} </label>
                                <input type="text" value={updateUserName} disabled={true} onChange={(e) => setUpdatedUserName(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">Email: </label>
                                <input type="email" value={updateEmail} disabled={true} onChange={(e) => setUpdatedEmail(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">Password: </label>
                                <input type="password" value={updatePassword} onChange={(e) => setUpdatedPassword(e.target.value)} />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.CONFIRM_PASSWORD} </label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className="updateDataDivDivP">
                                {updatePassword && confirmPassword && updatePassword !== confirmPassword && (
                                    <p style={{ color: 'red' }}>{TEXT.PASSWORDS_NOT_MATCH}</p>
                                )}
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">{TEXT.ROLE} </label>
                                <input type="text" value={updateRole} onChange={(e) => setUpdatedRole(e.target.value)} />
                            </div>
                        </div>
                        <div id="updateDataformBottom">
                            <a className="btn btn-outline-success" type="submit" id="btnGoBack" href="/profile">{TEXT.GO_BACK}</a>
                            <button type="submit" disabled={updatePassword !== confirmPassword} className="btn btn-outline-success" id="btnUpdateUserData">{TEXT.PROFILE_UPDATE_USER_DATA}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;