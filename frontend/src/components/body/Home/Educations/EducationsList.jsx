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

function EducationsList() {
    const { user } = useContext(UserContext);
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadEducations = async () => {
            try {
                startLoading();
                const educationsData = await fetchEducations();
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
                await errorSweet("Error loading Educations: " + error.message);
                console.error("Error loading Educations:", error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadEducations();
    }, []);

    const handleDelete = async (eid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Education:",
            text: "Are you sure you want to delete the education?",
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteEducation(eid);
            if (result.error) {
                await errorSweet("Error deleting Education: ", result.error.message);
            } else {
                await successSweet("Education Deleted!");
                setEducations(prev => prev.filter(education => education._id !== eid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Education: ", error.message);
            await errorSweet("Internal Error deleting Education: " + error.message);
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
            if (res?.error) { await errorSweet("Error saving order: ", res.error.message); }
            else { await successSweet("Order updated!"); }
        } catch (error) {
            console.error("Error updating order:", error);
            await errorSweet("Error updating order: " + error.message);
        }
    };

    //VER DE CAMBIAR:
    if (educations.length === 0) return <p>No Educations data available.</p>;

    return (
        <div id="educationsDiv">
            <div id="educationsDivTitle">
                <h3 id="educationsDivH3Title">Educations:</h3>
                {user?.role === "admin" && (
                    <div className="addingControlGeneral">
                        <Link to="/educations/form/new" className="btn btn-outline-success" id="addBtnEducation">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            {user?.role === "admin" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="educationsList">
                        {(provided) => (
                            <ul id="educationsList" {...provided.droppableProps} ref={provided.innerRef}>
                                {educations.map((education, index) => (
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
                    {educations.map((education) => (
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
