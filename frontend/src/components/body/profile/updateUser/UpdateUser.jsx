import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { handleUpdateUser } from "./logicUpdateUser";
import "./UpdateUser.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";

function UpdateUser(/* { user, updateUserData } */) {
    const { user, setUser } = useContext(UserContext);
    const [updateEmail, setUpdatedEmail] = useState(user?.email || "");
    const [updateUserName, setUpdatedUserName] = useState(user?.user || "");
    const [updatePassword, setUpdatedPassword] = useState(user?.password || "");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updateRole, setUpdatedRole] = useState(user?.role || "");
    const navigate = useNavigate();
    const { successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const checkUser = async () => {
            if (!user) {
                //LOGGER:
                console.error("User not found!");
                await errorSweet("User not Found");
                navigate("/profile");
            };
        };
        checkUser();
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (updatePassword !== confirmPassword) {
            await errorSweet("Passwords do not match!");
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
                    <h2 id="updateDataDivH2Title">Update User Data:</h2>
                </div>
                <div id="divUpdateData">
                    <form onSubmit={handleSubmit} id="formUpdateData">
                        <div id="updateDataformBody">
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">Id: </label>
                                <input type="text" value={user._id} disabled={true} /* onChange={(e) => setUpdatedUserName(e.target.value)} */ />
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">User Name: </label>
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
                                <label className="updateDataDivh3">Confirm Password: </label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <div className="updateDataDivDivP">
                                {updatePassword && confirmPassword && updatePassword !== confirmPassword && (
                                    <p style={{ color: 'red' }}>Passwords do not match</p>
                                )}
                            </div>
                            <div className="updateDataDivDiv">
                                <label className="updateDataDivh3">Role: </label>
                                <input type="text" value={updateRole} onChange={(e) => setUpdatedRole(e.target.value)} />
                            </div>
                        </div>
                        <div id="updateDataformBottom">
                            <a className="btn btn-outline-success" type="submit" id="btnGoBack" href="/profile">Go Back</a>
                            <button type="submit" disabled={updatePassword !== confirmPassword} className="btn btn-outline-success" id="btnUpdateUserData">Update User Data</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;