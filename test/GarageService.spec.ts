import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import { garageService } from "../lib/services/GarageService";
import * as nock from "nock";
import { config } from "node-config-ts";

describe("Garage Service", () => {
    let garageStateResponse = ["mocked Resp", "mmocked Respp"];

    before(() => {
        Debug.disable();
    });

    beforeEach(()=> {
        nock(config.settings.garageBase)
        .get("/"+ config.settings.garageState)   
        .once()     
        .reply(200, garageStateResponse);
    });

    it("Should return Closed, Closed on getGarageState", async () => {
        let response = await garageService.getGarageState();

        expect(response[0]).to.be.equal(garageStateResponse[0]);
        expect(response[1]).to.be.equal(garageStateResponse[1]);
    });

});
