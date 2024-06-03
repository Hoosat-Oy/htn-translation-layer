import mongoose from "mongoose";
import { addIdentifier, removeIdentifier, getIdentifier, IdentifierResultDTO } from "./identifiers";

// Mock identifiersSchema
const mockedIdentifiersSchema = {
  findOne: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

jest.mock("./schemas/identifierSchema", () => ({
  __esModule: true,
  default: mockedIdentifiersSchema,
}));

describe("Identifier Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addIdentifier", () => {
    it("should add a new identifier", async () => {
      const mockAccount = { _id: new mongoose.Types.ObjectId() };
      const mockIdentifier = { _id: new mongoose.Types.ObjectId(), account: mockAccount._id, identifier: "test_identifier" };

      mockedIdentifiersSchema.findOne.mockResolvedValue(null);
      mockedIdentifiersSchema.save.mockResolvedValue(mockIdentifier);

      const result = await addIdentifier(mockAccount, "test_identifier");

      expect(mockedIdentifiersSchema.findOne).toHaveBeenCalledWith({ identifier: "test_identifier" });
      expect(mockedIdentifiersSchema.save).toHaveBeenCalledWith({ account: mockAccount._id, identifier: "test_identifier" });
      expect(result).toEqual<IdentifierResultDTO>({
        result: "success",
        message: "Identifier created",
        identifier: mockIdentifier,
      });
    });
  });

  describe("getIdentifier", () => {
    it("should retrieve an existing identifier", async () => {
      const mockIdentifierId = new mongoose.Types.ObjectId();
      const mockAccount = { _id: new mongoose.Types.ObjectId() };
      const mockIdentifier = { _id: mockIdentifierId, account: mockAccount._id, identifier: "" };

      mockedIdentifiersSchema.findById.mockResolvedValue(mockIdentifier);

      const result = await getIdentifier(mockIdentifierId.toString());

      expect(mockedIdentifiersSchema.findById).toHaveBeenCalledWith(mockIdentifierId);
      expect(result).toEqual<IdentifierResultDTO>({
        result: "success",
        message: "Identifier retrieved",
        identifier: mockIdentifier,
      });
    });
  });

  describe("removeIdentifier", () => {
    it("should remove an existing identifier", async () => {
      const mockAccount = { _id: new mongoose.Types.ObjectId() };
      const mockIdentifierId = new mongoose.Types.ObjectId();
      const mockRemovedIdentifier = { _id: mockIdentifierId, account: mockAccount._id, identifier: "" };

      mockedIdentifiersSchema.findByIdAndDelete.mockResolvedValue(mockRemovedIdentifier);

      const result = await removeIdentifier(mockIdentifierId);

      expect(mockedIdentifiersSchema.findByIdAndDelete).toHaveBeenCalledWith(mockIdentifierId);
      expect(result).toEqual<IdentifierResultDTO>({
        result: "success",
        message: "Identifier removed",
        identifier: mockRemovedIdentifier,
      });
    });
  });
});
