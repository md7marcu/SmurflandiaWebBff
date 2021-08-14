import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import { gateService } from "../lib/services/GateService";
import * as nock from "nock";
import { config } from "node-config-ts";

describe("Gate Service", () => {
    let gateStateResponse = "ccClosed";

    before(() => {
        Debug.disable();
    });

    beforeEach(() => {
        nock(config.settings.gateBase)
        .get("/" + config.settings.gateState)
        .once()
        .reply(200, gateStateResponse);
    });

    it("Should return Closed on getGateState", async () => {
        let response = await gateService.getGateState("");

        expect(response).to.be.equal(gateStateResponse);
    });
});
