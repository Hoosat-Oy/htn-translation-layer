import mongoose from "mongoose";
import { addAddress, getAddresses, removeAddress, AddressResultDTO } from "./addresses";
import { getIdentifier } from "./identifiers"; // Assuming this function is exported from './identifiers'

// Mock the getIdentifier function
jest.mock("./identifiers", () => ({
  __esModule: true,
  getIdentifier: jest.fn(),
}));

// Mock addressesModel
const mockedAddressesModel = {
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
};

jest.mock("./schemas/addressesSchema", () => ({
  __esModule: true,
  default: mockedAddressesModel,
}));

describe("Address Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addAddress", () => {
    it("should add a new address", async () => {
      const identifierId = new mongoose.Types.ObjectId().toHexString();
      const address = "123 Main Street";
      const token = "abc123";

      mockedAddressesModel.save.mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        identifier: identifierId,
        address: address,
        token: token,
      });

      const result = await addAddress(identifierId, address, token);

      expect(result.result).toBe("success");
      expect(result.message).toBe("Address created");
      expect(result.address).toBeTruthy();
    });

    // Add more test cases to cover different scenarios
  });

  describe("getAddresses", () => {
    it("should retrieve addresses for a given identifier", async () => {
      const identifierId = new mongoose.Types.ObjectId().toHexString();
      const mockIdentifier = { _id: identifierId };

      mockedAddressesModel.find.mockResolvedValueOnce([
        { _id: new mongoose.Types.ObjectId(), identifier: identifierId, address: "123 Main Street", token: "abc123" },
        { _id: new mongoose.Types.ObjectId(), identifier: identifierId, address: "456 Elm Street", token: "def456" },
      ]);

      const result = await getAddresses(identifierId);

      expect(result.result).toBe("success");
      expect(result.message).toBe("Address retrieved");
      expect(result.addresses).toHaveLength(2);
    });

    // Add more test cases to cover different scenarios
  });

  describe("removeAddress", () => {
    it("should remove an existing address", async () => {
      const addressId = new mongoose.Types.ObjectId().toHexString();

      mockedAddressesModel.findByIdAndDelete.mockResolvedValueOnce({
        _id: addressId,
        identifier: new mongoose.Types.ObjectId(),
        address: "123 Main Street",
        token: "abc123",
      });

      const result = await removeAddress(addressId);

      expect(result.result).toBe("success");
      expect(result.message).toBe("Address removed");
      expect(result.address).toBeTruthy();
    });

    // Add more test cases to cover different scenarios
  });
});
