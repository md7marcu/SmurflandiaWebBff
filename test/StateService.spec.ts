import "mocha";
import * as Debug from "debug";
import { expect } from "chai";
import { stateService } from "../lib/services/StateService";

describe("State Service", () => {

    before(() => {
        Debug.disable();
    });

    it("Should return Closed, Closed, Closed on getStates", async () => {
        stateService.getStates().then( (response) => {
            expect(response[0]).to.be.equal("Closed");
            expect(response[1]).to.be.equal("Closed");
            expect(response[2]).to.be.equal("Closed");
        });
    });
});
