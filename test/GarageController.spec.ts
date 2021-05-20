import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import GarageController from "../lib/controllers/GarageController";

describe("Garage Controller", () => {
    // tslint:disable-next-line:max-line-length
    let controller: GarageController = new GarageController();

    before(() => {
        Debug.disable();
    });

    it("Should return Closed, Closed on getGarageState", async () => {
        let response = await controller.getGarageState();

        expect(response[0]).to.be.equal("Closed");
        expect(response[1]).to.be.equal("Closed");
    });

});
