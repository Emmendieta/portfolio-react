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
import { useLanguage } from "../../../../context/LanguageContext.jsx";
import { LANG_CONST } from "../../../constants/selectConstLang.js";

function ProyectsList() {
    const { user } = useContext(UserContext);
    const [proyects, setProyects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { startLoading, stopLoading } = useLoading();
    const { confirmSweet, successSweet, errorSweet } = useConfirmSweet();
    const { language } = useLanguage();

    useEffect(() => {
        const loadProyects = async () => {
            try {
                startLoading();
                const TEXT = LANG_CONST[language];
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
                setProyects(proyects);
            } catch (error) {
                console.error(TEXT.ERROR_SWEET_TEXT_PROYECT_LOADING, error);
                await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_LOADING + error.message);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        loadProyects();
    }, [language]);

    const TEXT = LANG_CONST[language];
    const filteredProyects = selectedCategory ? proyects.filter(proyect => proyect.categories.some(category => category._id === selectedCategory)) : proyects;

    const handleDelete = async (pyid) => {
        const confirmDelete = await confirmSweet({
            title: TEXT.CONFIRM_SWEET_TITLE_DELETE_PROYECT,
            text: TEXT.CONFIRM_SWEET_TEXT_DELETE_PROYECT,
            confirmButtonText: TEXT.YES,
            cancelButtonText: TEXT.NO,
        });
        if (!confirmDelete) return;
        try {
            const result = await fetchDeleteProyect(pyid);
            if (result.error) {
                await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_DELETING, result.error.message);
            } else {
                await successSweet(TEXT.SUCCESS_SWEET_PROYECT_DELETED);
                setProyects(prev => prev.filter(proyect => proyect._id !== pyid));
            }
        } catch (error) {
            //LOGGER:
            console.error(TEXT.ERROR_SWEET_TEXT_PROYECT_DELETING, error.message);
            await errorSweet(TEXT.ERROR_SWEET_TEXT_PROYECT_DELETING + error.message);
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
            if (res?.error) { await errorSweet(TEXT.ERROR_SWEET_ORDER_SAVE, res.error.message); }
            else { await successSweet(TEXT.SUCCESS_SWEET_ORDER); }
        } catch (error) {
            console.error(TEXT.ERROR_SWEET_ORDER_UPDATE, error);
            await errorSweet(TEXT.ERROR_SWEET_ORDER_UPDATE + error.message);
        }
    };
    //VER SI LO CAMBIO:
    if (!proyects) return <p>{TEXT.NO_PROYECTS}</p>

    return (
        <div id="proyectsDiv">
            <div id="proyectsDivTitle">
                <h3 id="proyectsDivH3Title">{TEXT.PROYECTS + ":"}</h3>
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