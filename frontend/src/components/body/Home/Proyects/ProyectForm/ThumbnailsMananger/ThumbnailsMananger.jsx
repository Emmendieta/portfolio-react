import { useState } from "react";
import "./ThumbnailsMananger.css";
import { useConfirmSweet } from "../../../../../../context/SweetAlert2Context";

function ThumbnailsMananger({ thumbnails, setThumbnails, title }) {
    const [inputUrl, setInputUrl] = useState("");
    const { errorSweet } = useConfirmSweet();

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
            await errorSweet("Invalid or duplicate URL!");
        }
    };

    const handleRemoveThumbnail = (urlToRemove) => {
        setThumbnails(thumbnails.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="thumbnailsManager">
            <h3>{title}</h3>
            <div className="thumbnailsInputContainer">
                <input
                    type="text"
                    value={inputUrl}
                    placeholder="Type here the URL of the Image"
                    onChange={(event) => setInputUrl(event.target.value)}
                />
                <button
                    type="button"
                    className="btn btn-outline-success"
                    id="btnAddImagePryect"
                    onClick={handleAddThumbnail}
                >
                    Add Image
                </button>
            </div>

            {thumbnails.length > 0 && (
                <div className="thumbnailsPreviewContainer">
                    {thumbnails.map((url, index) => (
                        <div key={index} className="thumbnailPreviewItem">
                            {url && (
                                <img
                                    src={url || null}
                                    alt={`Thumbnail ${index + 1}`}
                                    onError={(event) => (event.currentTarget.src = "/img/imagen-no-disponible.png")}
                                    id="imgProyect"
                                />
                            )}
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handleRemoveThumbnail(url)}
                                id="btnRemoveImgProyect"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ThumbnailsMananger;