import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteWork, fetchWorks } from "./Works.js";
import { IoIosAddCircleOutline } from "react-icons/io";
import WorkCard from "./WorkCard/WorkCard";
import { Link } from "react-router-dom";
import "./WorksList.css";
import { useLoading } from "../../../../context/LoadingContext.jsx";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context.jsx";
import { fetchUpdateEducationsOrder } from "../Educations/Educations.js";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMediaQuery } from "../../../hooks/UseMediaQuery.jsx";
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import { LANG_CONST } from "../../../constants/selectConstLang.js";


function WorksList() {
    const { user } = useContext(UserContext);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();
    const isMobile = useMediaQuery("(max-width: 992px)");

    useEffect(() => {
        const loadWorks = async () => {
            try {
                startLoading();
                const worksData = await fetchWorks();
                if (worksData?.error) {
                    await errorSweet(worksData.error.message);
                    setLoading(false);
                    return;
                };
                const works = worksData.response;
                //Reorder:
                const sorted = works.sort((a, b) => a.order - b.order);
                setWorks(sorted);
            } catch (error) {
                console.error(TEXT.ERROR_SWEET_TEXT_WORK_LOADING, error);
                await errorSweet(TEXT.ERROR_SWEET_TEXT_WORK_LOADING + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadWorks();
    }, [language]);

    const TEXT = LANG_CONST[language];

    const handleDelete = async (wid) => {
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE_WORK,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE_WORK,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO,
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteWork(wid);
            if (result.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_WORK_DELETING, result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_WORK_DELETED);
                setWorks((prev) => prev.filter((work) => work._id !== wid));
            }
        } catch (error) {
            //LOGGER:
            console.error(TEXT.ERROR_SWEET_TEXT_WORK_DELETING, error.message);
            await errorSweet(TEXT.ERROR_SWEET_TEXT_WORK_DELETING, error.message);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const reordered = Array.from(works);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);
        const reorderedWithOrder = reordered.map((item, index) => ({
            ...item,
            order: index,
        }));
        setWorks(reorderedWithOrder);
        try {
            const res = await fetchUpdateEducationsOrder(reorderedWithOrder);
            if (res?.error) { await errorSweet(TEXT.ERROR_SWEET_ORDER_SAVE, res.error.message); }
            else { await successSweet(TEXT.SUCCESS_SWEET_ORDER); }
        } catch (error) {
            console.error(TEXT.ERROR_SWEET_ORDER_UPDATE, error);
            await errorSweet(TEXT.ERROR_SWEET_ORDER_UPDATE + error.message);
        }
    };

    //VER SI LO DEJO:
    if (!works) return <p>{TEXT.NO_WORKS}</p>

    return (
        <div id="worksDiv">
            <div id="worksDivTitle">
                <h3 id="worksDivH3Title">{TEXT.WORKS}</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/works/form/new" className="btn btn-outline-success" id="addBtnWork">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            {user?.role === "admin" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="workList" direction={isMobile ? "vertical": "horizontal"}>
                        {(provided) => (
                            <ul id="worksList" {...provided.droppableProps} ref={provided.innerRef}>
                                {works.map((work, index) => (
                                    <Draggable key={work._id} draggableId={work._id} index={index}>
                                        {(provided) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            >
                                                <WorkCard
                                                    key={work._id}
                                                    work={work}
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
                <ul id="worksList">
                    {works.map((work) => (
                        <WorkCard
                            key={work._id}
                            work={work}
                            onDelete={handleDelete}
                            isDraggable={false}
                        />
                    ))}
                </ul>
            )}

        </div>
    );
};

export default WorksList;
