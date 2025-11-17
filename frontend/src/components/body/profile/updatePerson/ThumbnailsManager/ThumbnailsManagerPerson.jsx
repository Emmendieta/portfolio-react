import { useState } from "react";
import "./ThumbnailsManagerPerson.css";
import { useConfirmSweet } from "../../../../../context/SweetAlert2Context";
import { LANG_CONST } from "../../../../constants/selectConstLang.js";
import { useLanguage } from "../../../../../context/LanguageContext";

function ThumbnailsManagerPerson({ thumbnails, setThumbnails, title = "Images" }) {
    const [inputUrl, setInputUrl] = useState("");
    const { errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

    const TEXT = LANG_CONST[language];

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleAddThumbnail = async () => {
        const trimmedUrl = inputUrl.trim();
        if (trimmedUrl && isValidUrl(trimmedUrl) && !thumbnails.includes(trimmedUrl)) {
            setThumbnails([...thumbnails, trimmedUrl]);
            setInputUrl("");
        } else {
            await errorSweet(TEXT.ERROR_SWEET_TEXT_THUMBNAILS_DUPLICATE_URL)
        }
    };

    const handleRemoveThumbnail = (urlToRemove) => {
        setThumbnails(thumbnails.filter((url) => url !== urlToRemove));
    };

    const handleSetAsMain = (urlToMakeMain) => {
        const newOrden = [urlToMakeMain, ...thumbnails.filter((url) => url !== urlToMakeMain)];
        setThumbnails(newOrden);
    };

    return (
        <div className="thumbnailsManager">
            <h3>{title}</h3>
            <div className="thumbnailsInputContainer">
                <input type="text" value={inputUrl} placeholder={TEXT.THUMBNAILS_INPUT_PLACEHOLDER_URL} onChange={(event) => setInputUrl(event.target.value)} />
                <button type="button" className="btn btn-outline-success" id="btnAddImageThumbnails" onClick={handleAddThumbnail}>{TEXT.ADD_IMAGE}</button>
            </div>

            {thumbnails.length > 0 && (
                <div className="thumbnailsPreviewContainer">
                    {thumbnails.map((url, index) => (
                        <div key={index} className="thumbnailsPreviewItem">
                            {url ? (
                                <img
                                    src={url}
                                    alt={`Thumbnail ${index + 1}`}
                                    onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")}
                                    id="imgThumbnail"
                                />
                            ) : (
                                <p>{TEXT.INVALID_IMAGE}</p>
                            )}
                            <button id="btnRemoveImgThumbnail" type="button" className="btn btn-outline-danger" onClick={() => handleRemoveThumbnail(url)}>{TEXT.REMOVE}</button>

                            {index !== 0 && (
                                <button type="button" className="btn btn-outline-primary" onClick={() => handleSetAsMain(url)} >{TEXT.SET_MAIN}</button>
                            )}

                            {index === 0 && (
                                <span className="badge bg-success mt-2">{TEXT.MAIN_IMAGE}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThumbnailsManagerPerson;