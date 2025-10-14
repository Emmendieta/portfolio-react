import { useState } from "react";
import "./ThumbnailsManagerPerson.css";

function ThumbnailsManagerPerson({ thumbnails, setThumbnails, title = "Images" }) {
    const [inputUrl, setInputUrl] = useState("");

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleAddThumbnail = () => {
        const trimmedUrl = inputUrl.trim();
        if (trimmedUrl && isValidUrl(trimmedUrl) && !thumbnails.includes(trimmedUrl)) {
            setThumbnails([...thumbnails, trimmedUrl]);
            setInputUrl("");
        } else {
            //SWEET ALERT:
            alert("Invalid or duplicate URL!")
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
                <input type="text" value={inputUrl} placeholder="Type here the URL of the Image" onChange={(event) => setInputUrl(event.target.value)} />
                <button type="button" className="btn btn-outline-success" id="btnAddImageThumbnails" onClick={handleAddThumbnail}>Add Image</button>
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
                                <p>Invalid image</p>
                            )}
                            <button id="btnRemoveImgThumbnail" type="button" className="btn btn-outline-danger" onClick={() => handleRemoveThumbnail(url)}>Remove</button>

                            {index !== 0 && (
                                <button type="button" className="btn btn-outline-primary" onClick={() => handleSetAsMain(url)} > Set as Main</button>
                            )}

                            { index === 0 && (
                                <span className="badge bg-success mt-2">Main Image</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThumbnailsManagerPerson;