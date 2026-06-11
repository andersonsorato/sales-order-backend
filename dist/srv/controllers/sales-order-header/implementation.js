"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderControllerImpl = void 0;
class SalesOrderHeaderControllerImpl {
    constructor(Service) {
        this.Service = Service;
    }
    async beforeCreate(params) {
        try {
            return this.Service.beforeCreate(params);
        }
        catch (error) {
            return {
                hasError: true,
                error: error,
            };
        }
    }
    async afterCreate(params, loggedUser) {
        return this.Service.afterCreate(params, loggedUser);
    }
}
exports.SalesOrderHeaderControllerImpl = SalesOrderHeaderControllerImpl;
