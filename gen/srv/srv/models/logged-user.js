"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUserModel = void 0;
class LoggedUserModel {
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        return new LoggedUserModel(props);
    }
    get id() {
        return this.props.id;
    }
    get roles() {
        return this.props.roles;
    }
    get attr() {
        return this.props.attr;
    }
    toStringifiedObject() {
        return JSON.stringify(this.props);
    }
}
exports.LoggedUserModel = LoggedUserModel;
//# sourceMappingURL=logged-user.js.map