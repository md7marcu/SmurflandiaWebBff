import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import { garageService } from "../lib/services/GarageService";

describe("Garage Service", () => {
    // tslint:disable-next-line:max-line-length

    before(() => {
        Debug.disable();
    });

    it("Should return Closed, Closed on getGarageState", async () => {
        let response = await garageService.getGarageState();

        expect(response[0]).to.be.equal("Closed");
        expect(response[1]).to.be.equal("Closed");
    });

});
