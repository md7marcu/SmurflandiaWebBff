import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import GateController from "../lib/controllers/GateController";

describe("Gate Controller", () => {
    // tslint:disable-next-line:max-line-length
    let controller: GateController = new GateController();

    before(() => {
        Debug.disable();
    });

    it("Should return Closed on getGateState", async () => {
        let response = await controller.getGateState();

        expect(response).to.be.equal("Closed");
    });
});
