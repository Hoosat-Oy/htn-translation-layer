import identifiersSchema, { IdentifiersDTO } from "./schemas/identifierSchema";
import { AccountsDTO } from "../access/schemas/accountsSchema";
import mongoose from "mongoose";

export interface IdentifierResultDTO {
  result: string;
  message: string;
  identifier?: IdentifiersDTO;
  error?: any;
}

/**
 * Adds a new identifier to the database.
 * @param account - The account associated with the identifier.
 * @param identifier - The value of the identifier to be added.
 * @returns A promise that resolves to an IdentifierResultDTO.
 */
export const addIdentifier = async (account: AccountsDTO, identifier: string): Promise<IdentifierResultDTO> => {
  try {
    const existingIdentifier = await identifiersSchema.findOne({ identifier });
    if (existingIdentifier) {
      return {
        result: "error",
        message: "Identifier already exists",
        identifier: existingIdentifier,
      };
    }
    const newIdentifier = new identifiersSchema({
      account: account._id,
      identifier: identifier,
    });
    const savedIdentifier = await newIdentifier.save();
    return {
      result: "success",
      message: "Identifier created",
      identifier: savedIdentifier,
    };
  } catch (error) {
    return {
      result: "error",
      message: "An error occurred while adding the identifier",
      error: error,
    };
  }
};

/**
 * Removes an identifier from the database.
 * @param identifierId - The unique identifier ID of the identifier to be removed.
 * @returns A promise that resolves to an IdentifierResultDTO.
 */
export const removeIdentifier = async (identifierId: mongoose.Types.ObjectId): Promise<IdentifierResultDTO> => {
  try {
    const removedIdentifier = await identifiersSchema.findByIdAndDelete(identifierId);
    if (!removedIdentifier) {
      return {
        result: "error",
        message: "Identifier not found",
      };
    }
    return {
      result: "success",
      message: "Identifier removed",
      identifier: removedIdentifier,
    };
  } catch (error) {
    return {
      result: "error",
      message: "An error occurred while removing the identifier",
      error: error,
    };
  }
};

/**
 * Retrieves an identifier from the database.
 * @param identifier - The unique identifier of the identifier to be retrieved.
 * @returns A promise that resolves to an IdentifierResultDTO.
 */
export const getIdentifier = async (identifier: string): Promise<IdentifierResultDTO> => {
  try {
    const foundIdentifier = await identifiersSchema.findOne({ identifier: identifier });
    if (!foundIdentifier) {
      return {
        result: "error",
        message: "Identifier not found",
      };
    }
    return {
      result: "success",
      message: "Identifier retrieved",
      identifier: foundIdentifier,
    };
  } catch (error) {
    return {
      result: "error",
      message: "An error occurred while retrieving the identifier",
      error: error,
    };
  }
};
