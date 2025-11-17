import { useContext, useEffect, useState } from "react";
import "./EducationsList.css";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteEducation, fetchEducations, fetchUpdateEducationsOrder } from "./Educations";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import EducationCard from "./EducationCard/EducationCard";
import { useLoading } from "../../../../context/LoadingContext";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useLanguage } from "../../../../context/LanguageContext";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function EducationsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const educationTypes = ["Primary School", "High School", "University", "Course", "Conference", "Other"];
    const typeEducationLabels = {
        "Primary School": { en: "Primary School", es: "Escuela primaria" },
        "High School": { en: "High School", es: "Secundario" },
        "University": { en: "University", es: "Universidad" },
        "Course": { en: "Course", es: "Curso" },
        "Conference": { en: "Conference", es: "Conferencia" },
        "Other": { en: "Other", es: "Otro" }
    };

    useEffect(() => {
        const loadEducations = async () => {
            try {
                startLoading();
                const educationsData = await fetchEducations(language);
                if (educationsData?.error) {
                    await errorSweet(educationsData.error.message);
                    setLoading(false);
                    return;
                };
                const educations = educationsData.response;
                //Reorder:
                const sorted = educations.sort((a, b) => a.order - b.order);
                setEducations(sorted);
            } catch (error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_EDUCATIONS_LOADING + error.message);
                console.error(TEXT.ERROR_SWEET_TEXT_EDUCATIONS_LOADING, error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducations();
    }, [language]);

    const TEXT = LANG_CONST[language];

    const filteredEducations = selectedType ? educations.filter((edu) => edu.typeEducation === selectedType) : educations;

    const handleDelete = async (eid) => {
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE_EDUCATION,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE_EDUCATION,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteEducation(eid);
            if (result.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_EDUCATION_DELETING, result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_EDUCATION_DELETED);
                setEducations(prev => prev.filter(education => education._id !== eid));
            }
        } catch (error) {
            //LOGGER:
            console.error(TEXT.ERROR_SWEET_TEXT_EDUCATION_DELETING, error.message);
            await errorSweet(TEXT.INTERNAL_SERVER_ERROR_DELETING_EDUCATION + error.message);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const reordered = Array.from(educations);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);
        const reorderedWithOrder = reordered.map((item, index) => ({
            ...item,
            order: index,
        }));
        setEducations(reorderedWithOrder);
        try {
            const res = await fetchUpdateEducationsOrder(reorderedWithOrder);
            if (res?.error) { await errorSweet(TEXT.ERROR_SWEET_ORDER_SAVE, res.error.message); }
            else { await successSweet(TEXT.SUCCESS_SWEET_ORDER); }
        } catch (error) {
            console.error(TEXT.ERROR_SWEET_ORDER_UPDATE, error);
            await errorSweet(TEXT.ERROR_SWEET_ORDER_UPDATE + error.message);
        }
    };

    //VER DE CAMBIAR:
    if (educations.length === 0) return <p>{TEXT.NO_EDUCATIONS}</p>;

    return (
        <div id="educationsDiv">
            <div id="educationsDivTitle">
                <h3 id="educationsDivH3Title">{TEXT.EDUCATIONS + ":"}</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/educations/form/new" className="btn btn-outline-success" id="addBtnEducation">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>

            <div id="educationTypeFilter">
                <button className={`typeFilterBtn ${selectedType === null ? "active" : ""}`} onClick={() => setSelectedType(null)}>{language === "es" ? "Todos": "All"}</button>
                {educationTypes.map((type) => (
                    <button key={type} className={`typeFilterBtn ${selectedType === type ? "active" : ""}`} onClick={() => setSelectedType(type)}>{typeEducationLabels[type][language]}</button>
                ))}
            </div>

            {user?.role === "admin" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="educationsList">
                        {(provided) => (
                            <ul id="educationsList" {...provided.droppableProps} ref={provided.innerRef}>
                                {filteredEducations.map((education, index) => (
                                    <Draggable key={education._id} draggableId={education._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <EducationCard
                                                    education={education}
                                                    onDelete={handleDelete}
                                                    isDraggable={true}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <ul id="educationsList">
                    {filteredEducations.map((education) => (
                        <EducationCard
                            key={education._id}
                            education={education}
                            onDelete={handleDelete}
                            isDraggable={false}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EducationsList;
