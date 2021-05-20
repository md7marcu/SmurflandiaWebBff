import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import StateController from "../lib/controllers/StateController";

describe("State Controller", () => {
    // tslint:disable-next-line:max-line-length
    let controller: StateController = new StateController();

    before(() => {
        Debug.disable();
    });

    it("Should return Closed, Closed, Closed on getStates", async () => {
        controller.getStates().then( (response) => {
            expect(response[0]).to.be.equal("Closed");
            expect(response[1]).to.be.equal("Closed");
            expect(response[2]).to.be.equal("Closed");
        });
    });
});
