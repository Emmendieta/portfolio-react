import { useContext, useEffect, useState } from "react";
import { fetchDeleteLanguage, fetchLanguages, fetchUpdateLanguagesOrder } from "./Language";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import LanguageCard from "./LanguageCard/LanguageCard";
import { UserContext } from "../../../../context/UserContext";
import "./LanguagesList.css";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function LanguagesList() {
    const { user } = useContext(UserContext);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const { language: currentLanguage } = useLanguage();

    useEffect(() => {
        const loadLanguages = async () => {
            try {
                startLoading();
                const languagesData = await fetchLanguages();
                if (languagesData?.error) {
                    await errorSweet(languagesData.error.message);
                    setLoading(false);
                    return;
                };
                const sorted = languagesData.response.sort((a, b) => a.order - b.order);//Ordered:
                setLanguages(sorted || []);
            } catch (error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_LANGUAGES_LOADING + error.message);
                console.error(TEXT.ERROR_SWEET_TEXT_LANGUAGES_LOADING, error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadLanguages();
    }, [currentLanguage]);

    const TEXT = LANG_CONST[currentLanguage];

    const handleDelete = async (lid) => {
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE_LANGUAGE,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE_LANGUAGE,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteLanguage(lid);
            if (result.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_LANGUAGE_DELETING + result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_LANGUAGE_DELETED);
                setLanguages(prev => prev.filter(language => language._id !== lid));
            }
        } catch (error) {
            //LOGGER:
            console.error(TEXT.ERROR_SWEET_TEXT_LANGUAGE_DELETING, error.message);
            await errorSweet(TEXT.ERROR_SWEET_TEXT_LANGUAGE_DELETING + error.message);
        }
    };

    const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || source.droppableId !== destination.droppableId) return;
    const listType = source.droppableId; // "Hard" o "Soft"
        const filtered = languages.filter(lang => lang.type === listType);// Sublista filtrada según tipo (Hard o Soft)
        const reordered = Array.from(filtered);// Reordenamos dentro de esa sublista
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    const updated = languages.map(lang => {// Actualizamos la lista global
        if (lang.type === listType) {
            const newIndex = reordered.findIndex(l => l._id === lang._id);
            if (newIndex !== -1) { return { ...lang, order: newIndex }; } // solo cambia el order relativo dentro de su tipo
        }
        return lang;
    });
    const globallySorted = [...updated]// Reasignamos el orden global correctamente
        .sort((a, b) => a.order - b.order)
        .map((lang, index) => ({ ...lang, order: index }));
    setLanguages(globallySorted);
    try {
        const payload = globallySorted.map(l => ({ _id: l._id, order: l.order }));// Enviamos al backend solo los campos necesarios
        const res = await fetchUpdateLanguagesOrder(payload);
        if (res?.error) { await errorSweet(TEXT.ERROR_SWEET_ORDER_SAVE + res.error.message); } 
        else { await successSweet(TEXT.SUCCESS_SWEET_ORDER); }
    } catch (error) {
        console.error(TEXT.ERROR_SWEET_ORDER_UPDATE, error);
        await errorSweet(TEXT.ERROR_SWEET_ORDER_UPDATE + error.message);
    }
};
    if (!languages || languages.length === 0) return <p>No Languages data available.</p>;
    const hardSkills = languages.filter(lang => lang.type === "Hard");
    const softSkills = languages.filter(lang => lang.type === "Soft");

    return (
        <div id="langaugesDiv">
            <div id="languagesDivTitle">
                <h3 id="languagesDivH3Title">{TEXT.SKILLS}</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/languages/form/new" className="btn btn-outline-success" id="addBtnLanguage">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            {user?.role === "admin" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div id="languageDivContainer">
                        {/* 🧠 Hard Skills */}
                        {hardSkills.length > 0 && (
                            <div className="languageCategory">
                                <h4 className="languageCategoryTitle">{TEXT.HARD_SKILLS + ":"}</h4>
                                <Droppable droppableId="Hard" direction="horizontal">
                                    {(provided) => (
                                        <ul className="languageList" {...provided.droppableProps} ref={provided.innerRef}
                                        >
                                            {hardSkills.map((language, index) => (
                                                <Draggable key={language._id} draggableId={language._id} index={index} >
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <LanguageCard language={language} onDelete={handleDelete} isDraggable={true} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>
                        )}
                        {softSkills.length > 0 && (
                            <div className="languageCategory">
                                <h4 className="languageCategoryTitle">{TEXT.SOFT_SKILLS + ":"}</h4>
                                <Droppable droppableId="Soft" direction="horizontal">
                                    {(provided) => (
                                        <ul className="languageList" {...provided.droppableProps} ref={provided.innerRef} >
                                            {softSkills.map((language, index) => (
                                                <Draggable key={language._id} draggableId={language._id} index={index} >
                                                    {(provided) => (
                                                        <div ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <LanguageCard language={language} onDelete={handleDelete} isDraggable={true} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>
                        )}
                    </div>
                </DragDropContext>
            ) : (
                <div id="languageDivContainer">
                    {hardSkills.length > 0 && (
                        <div className="languageCategory">
                            <h4 className="languageCategoryTitle">{TEXT.HARD_SKILLS + ":"}</h4>
                            <ul className="languageList">
                                {hardSkills.map(language => (
                                    <LanguageCard key={language._id} language={language} onDelete={handleDelete} isDraggable={false} />
                                ))}
                            </ul>
                        </div>
                    )}
                    {softSkills.length > 0 && (
                        <div className="languageCategory">
                            <h4 className="languageCategoryTitle">{TEXT.SOFT_SKILLS + ":"}</h4>
                            <ul className="languageList">
                                {softSkills.map(language => (
                                    <LanguageCard key={language._id} language={language} onDelete={handleDelete} isDraggable={false} />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguagesList;
