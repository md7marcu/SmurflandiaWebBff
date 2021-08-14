import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import { stateService } from "../lib/services/StateService";
import * as nock from "nock";
import { config } from "node-config-ts";

describe("State Service", () => {
    let gateStateResponse = "losed";
    let garageStateResponse = ["mocked Resp", "mmocked Respp"];

    before(() => {
        Debug.disable();
    });

    beforeEach(() => {
        nock(config.settings.gateBase)
        .get("/" + config.settings.gateState)
        .once()
        .reply(200, gateStateResponse);

        nock(config.settings.garageBase)
        .get("/" + config.settings.garageState)
        .once()
        .reply(200, garageStateResponse);
    });

    it("Should return Closed, Closed, Closed on getStates", async () => {
        let response = await stateService.getStates("");
        expect(response[0]).to.be.equal(gateStateResponse);
        expect(response[1]).to.be.equal(garageStateResponse[0]);
        expect(response[2]).to.be.equal(garageStateResponse[1]);
    });
});
