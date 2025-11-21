import pdfController from "../../controllers/pdf.controller.js";
import RouterHelper from "../../helpers/router.helper.js";

class PDFRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };

    init = () => {
        this.read("/export/data", ["public"], pdfController.getAllEndpoint);
        this.read("/export/pdf", ["public"], pdfController.generatePDF);
    };
};

const pdfRouter = (new PDFRouter()).getRouter();

export default pdfRouter;