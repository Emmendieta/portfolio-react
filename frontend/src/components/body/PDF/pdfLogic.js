import { getData } from "../../../helpers/crud.js";

export const fetchData = async () => {
    try {
        const url = "pdf/export/data";
        const data = await getData(url);
        if (!data) {
            //LOGGER:
            console.error("Error in fetch Data for PDF or no data recibed!");
            //SWEET ALERT:
            alert("Error in fetch Data for PDF or no data recibed!");
            return;
        };
        return data;
    } catch (error) {
        //LOGGER:
        console.error("Error fetching Data for PDF:", error.message);
        return { error: { message: error.message } };
    };
};

/* export const exportPDF = async (contentId) => {
    try {
        const url = "pdf/export/pdf"; // Tu endpoint en el backend
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${url}?id=${contentId}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Error generating PDF");

        const pdfBlob = await response.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(pdfBlob);
        link.setAttribute("download", "Curriculum.pdf");
/*         document.body.appendChild(link);
        link.click();
        link.remove(); */
                /*link.download = "Curriculum.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Error exporting PDF");
    }
}; */

export const exportPDF = async (lang) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/pdf/export/pdf?lang=${lang}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) throw new Error("Error generating PDF");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "Curriculum.pdf";
        a.click();

        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Error exporting PDF");
    }
};