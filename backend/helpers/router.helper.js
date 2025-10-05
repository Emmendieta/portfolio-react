import { Router } from "express";
import setupPolicies from "../middlewares/setupPolicies.mid.js";
import setupResponse from "../middlewares/setupResponse.mid.js";

class RouterHelper {
    constructor() {
        this.router = Router();
        this.use(setupResponse);
    };

    getRouter = () => this.router;

    applyMiddlewares = (middlewares) => middlewares.map((mid) => async(req, res, next) => {
        try {
            await mid(req, res, next);
        } catch (error) {
            next(error);
        }
    });

    applyMiddlewaresRender = (middlewaresRender) => middlewaresRender.map(midRender => async(req, res, next) => {
        try {
            await midRender(req, res, next);
        } catch (error) {
            next(error);
        }
    });

    create = (path, policies, ...middlewares) => this.router.post(path, setupPolicies(policies), this.applyMiddlewares(middlewares));
    read = (path, policies, ...middlewares) => this.router.get(path, setupPolicies(policies), this.applyMiddlewares(middlewares));
    update = (path, policies, ...middlewares) => this.router.put(path, setupPolicies(policies), this.applyMiddlewares(middlewares));
    destroy = (path, policies, ...middlewares) => this.router.delete(path, setupPolicies(policies), this.applyMiddlewares(middlewares));

    use = (path, ...middlewares) => this.router.use(path, this.applyMiddlewares(middlewares));
    render = (path, policies, ...middlewaresRender) => this.router.get(path, setupPolicies(policies), this.applyMiddlewaresRender(middlewaresRender));
};

export default RouterHelper;