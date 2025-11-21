import { generatePDFData, getData } from "../../../helpers/crud.js";

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

export const exportPDF = async (lang) => {
    try {
        const baseUrl = `/pdf/export/pdf?lang=${lang}`
        const response = await generatePDFData(baseUrl);
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