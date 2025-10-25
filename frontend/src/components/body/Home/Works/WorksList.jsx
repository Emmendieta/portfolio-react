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


function WorksList() {
    const { user } = useContext(UserContext);
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
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
                console.error("Error loading Works:", error);
                await errorSweet("Error loading Works: " + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadWorks();
    }, []);

    const handleDelete = async (wid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Work:",
            text: "Are you sure you want to delete the Work?",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteWork(wid);
            if (result.error) {
                await errorSweet("Error deleting the Work: ", result.error.message);
            } else {
                await successSweet("Work Deleted!");
                setWorks((prev) => prev.filter((work) => work._id !== wid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Work: ", error.message);
            await errorSweet("Error deleting Work: ", error.message);
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
            if (res?.error) { await errorSweet("Error saving order: ", res.error.message); }
            else { await successSweet("Order updated!"); }
        } catch (error) {
            console.error("Error updating order:", error);
            await errorSweet("Error updating order: " + error.message);
        }
    };

    //VER SI LO DEJO:
    if (!works) return <p>No Works data available.</p>

    return (
        <div id="worksDiv">
            <div id="worksDivTitle">
                <h3 id="worksDivH3Title">Works:</h3>
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
