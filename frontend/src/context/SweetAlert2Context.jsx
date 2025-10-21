import { createContext, useContext } from "react";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content";

const confirmContext = createContext();
const MySwal = withReactContent(Swal);

export const ConfirmProvider = ({ children }) => {

    //Confirm:
    const confirmSweet = async ({
        title = "Are you sure?",
        text = "",
        icon = "warning",
        confirmButtonText = "Yes",
        cancelButtonText = "Cancel",
        ...rest
    }) => {
        const result = await MySwal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
            ...rest
        });
        return result.isConfirmed;
    };

    //Success:
    const successSweet = async (text = "Action Completed!") =>
        await MySwal.fire({
            icon: "success",
            title: "Success:",
            text,
            confirmButtonText: "OK",
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
        });

    //Error:
    const errorSweet = async (text = "Something went wrong!") =>
        await MySwal.fire({
            icon: "error",
            title: "Error:",
            text,
            confirmButtonText: "OK",
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
        });

    //Info:
    const infoSweet = async (text = "Information") =>
        await MySwal.fire({
            icon: "info",
            title: "Info:",
            text,
            confirmButtonText: "OK",
            theme: 'dark',
            customClass: {
                popup: 'custom-swal-popup'
            },
        });

        return (
        <confirmContext.Provider value={{ confirmSweet, successSweet, errorSweet, infoSweet }}>
            {children}
        </confirmContext.Provider>
    );
};

export const useConfirmSweet = () => useContext(confirmContext);