import assert from "assert";
import { MetaglobeDefaults, MetaglobeOptionsConfig } from "../src";
import sinon from "sinon";

describe("MetaglobeOptionsConfig", () => {
  describe("options", () => {
    let spy: any;
    beforeEach(() => {
      spy = sinon.spy(console, "log");
    });
    afterEach(() => {
      spy.restore();
    });
    it("logs via console.log by default", () => {
      const message = "message";
      const options = MetaglobeOptionsConfig.normalize({});
      options.logging.logger.log(message);
      assert.strictEqual(spy.withArgs(message).callCount, 1);
    });

    it("disables the logger when the quiet flag is used", () => {
      const message = "message";
      const options = MetaglobeOptionsConfig.normalize({
        logging: { quiet: true }
      });
      options.logging.logger.log(message);
      assert.strictEqual(spy.withArgs(message).callCount, 0);
    });
  });
  describe(".normalize", () => {
    it("returns an options object with all default namespaces", () => {
      const options = MetaglobeOptionsConfig.normalize({});
      for (const namespace in MetaglobeDefaults) {
        assert(options[namespace]);
      }
    });
    it("uses input values when supplied instead of defaults", () => {
      const options = MetaglobeOptionsConfig.normalize({
        wallet: { totalAccounts: 7 }
      });
      assert.equal(options.wallet.totalAccounts, 7);
    });
    it("throws an error when an option conflict is found", () => {
      assert.throws(() => {
        MetaglobeOptionsConfig.normalize({
          wallet: {
            deterministic: true,
            seed: "there I oft spent narrow nightwatch nigh the ship's head"
          }
        } as Object);
      });
    });

    describe("legacy input formats", () => {
      it("accepts some legacy input formats", () => {
        const seed = "from their voids, cry to the dolphined sea";
        const options = MetaglobeOptionsConfig.normalize({ seed } as Object);
        assert.equal(options.wallet.seed, seed);
      });
      it("errors if there is a conflict with legacy inputs", () => {
        const seed = "I ate three cookies";
        const mnemonic = "fee fi fo fum";
        assert.throws(() => {
          const options = MetaglobeOptionsConfig.normalize({
            seed,
            mnemonic
          } as Object);
        });
      });
      it("errors if there is a conflict with legacy and modern inputs", () => {
        const seed = "I ate three cookies";
        const mnemonic = "fee fi fo fum";
        assert.throws(() => {
          const options = MetaglobeOptionsConfig.normalize({
            seed,
            wallet: { mnemonic }
          } as Object);
        });
      });
    });
  });
});
