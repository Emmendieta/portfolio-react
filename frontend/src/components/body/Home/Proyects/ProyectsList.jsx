import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { fetchDeleteProyect, fetchProyectsPopulated, fetchUpdateProyectsOrder } from "./logicProyects.js";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import ProyectCard from "./ProyectCard/ProyectCard";
import "./ProyectsList.css";
import CategoriesList from "../Categories/CategoriesList.jsx";
import { useLoading } from "../../../../context/LoadingContext.jsx";
import "../../../GlobalLoader.css";
import { useConfirmSweet } from "../../../../context/SweetAlert2Context.jsx";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

function ProyectsList() {
    const { user } = useContext(UserContext);
    const [proyects, setProyects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();

    useEffect(() => {
        const loadProyects = async () => {
            try {
                startLoading();
                const proyectsData = await fetchProyectsPopulated();
                if (proyectsData?.error) {
                    await errorSweet(proyectsData.error.message);
                    setLoading(false);
                    return;
                };
                const proyects = proyectsData.response;
                //Reorder:
                const sorted = proyects.sort((a, b) => a.order - b.order);
                setProyects(sorted);
                setProyects(proyectsData.response);
            } catch (error) {
                console.error("Error loading Proyects:", error);
                await errorSweet("Error loading Proyects: " + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProyects();
    }, []);

    const filteredProyects = selectedCategory ? proyects.filter(proyect => proyect.categories.some(category => category._id === selectedCategory)) : proyects;

    const handleDelete = async (pyid) => {
        const confirmDelete = await confirmSweet({
            title: "Delete Proyect:",
            text: "Are you sure you want to delete the Proyect?",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteProyect(pyid);
            if (result.error) {
                await errorSweet("Error deleting the Proyect", result.error.message);
            } else {
                await successSweet("Proyect Deleted!");
                setProyects(prev => prev.filter(proyect => proyect._id !== pyid));
            }
        } catch (error) {
            //LOGGER:
            console.error("Error deleting Proyect: ", error.message);
            await errorSweet("Error deleting Proyect: " + error.message);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        const visibleItems = Array.from(filteredProyects);
        const [moved] = visibleItems.splice(sourceIndex, 1);
        visibleItems.splice(destinationIndex, 0, moved);

        const updatedGlobal = [...proyects];
        visibleItems.forEach((item, index) => {
            const globalIndex = updatedGlobal.findIndex(pro => pro._id === index._id);
            if (globalIndex !== -1) { updatedGlobal[globalIndex].order = index; }
        });
        const reordered = updatedGlobal.sort((a, b) => a.order - b.order);
        setProyects(reordered);
        try {
            const res = await fetchUpdateProyectsOrder(reordered);
            if (res?.error) { await errorSweet("Error saving order: ", res.error.message); }
            else { await successSweet("Order updated!"); }
        } catch (error) {
            console.error("Error updating order:", error);
            await errorSweet("Error updating order: " + error.message);
        }
    };
    //VER SI LO CAMBIO:
    if (!proyects) return <p>No Proyects data available.</p>

    return (
        <div id="proyectsDiv">
            <div id="proyectsDivTitle">
                <h3 id="proyectsDivH3Title">Proyects:</h3>
                {user?.role === "admin" && (
                    <div className="addControlGeneral">
                        <Link to="/proyects/form/new" className="btn btn-outline-success" id="addBtnproyect">
                            <IoIosAddCircleOutline id="addIcon" />
                        </Link>
                    </div>
                )}
            </div>
            <div id="proyectsCategoriesDiv">
                <CategoriesList
                    onCategorySelect={setSelectedCategory}
                    selectedCategory={selectedCategory}
                />
            </div>
            {user?.role === "admin" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="proyectList" direction="vertical">
                        {(provided) => (
                            <ul id="proyectList" {...provided.droppableProps} ref={provided.innerRef}>
                                {filteredProyects.map((proyect, index) => (
                                    <Draggable key={proyect._id} draggableId={proyect._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <ProyectCard
                                                    key={proyect._id}
                                                    proyect={proyect}
                                                    onDelete={handleDelete}
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
                <ul id="proyectList">
                    {filteredProyects.map(proyect => (
                        <ProyectCard
                            key={proyect._id}
                            proyect={proyect}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProyectsList;

/*

            <ul id="proyectList">
                {filteredProyects.map(proyect => (
                    <ProyectCard
                        key={proyect._id}
                        proyect={proyect}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>

            */