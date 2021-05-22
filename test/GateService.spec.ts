import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import { gateService } from "../lib/services/GateService";

describe("Gate Service", () => {

    before(() => {
        Debug.disable();
    });

    it("Should return Closed on getGateState", async () => {
        let response = await gateService.getGateState();

        expect(response).to.be.equal("Closed");
    });
});
