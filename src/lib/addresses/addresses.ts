import { getIdentifier } from "./identifiers";
import addressesModel, { AddressesDTO } from "./schemas/addressesSchema";

export interface AddressResultDTO {
  result: string;
  message: string;
  address?: AddressesDTO;
  addresses?: AddressesDTO[];
  error?: any;
}

/**
 * Adds a new address to the database.
 * @param p_identifier - The identifier  associated with the address.
 * @param address - The address value to be added.
 * @param token - The token value to be added.
 * @returns A promise that resolves to an AddressResultDTO.
 */
export const addAddress = async (p_identifier: string, address: string, token: string): Promise<AddressResultDTO> => {
  try {
    const { identifier } = await getIdentifier(p_identifier);
    const newAddress = new addressesModel({
      identifier: identifier?._id,
      address: address,
      token: token,
    });
    const savedAddress = await newAddress.save();
    return {
      result: "success",
      message: "Address created",
      address: savedAddress,
    };
  } catch (error) {
    return {
      result: "error",
      message: "An error occurred while adding the address",
      error: error,
    };
  }
};

/**
 * Retrieves an address from the database.
 * @param identifier - The unique address ID of the address to be retrieved.
 * @returns A promise that resolves to an AddressResultDTO.
 */
export const getAddresses = async (p_identifier: string): Promise<AddressResultDTO> => {
  try {
    const { identifier } = await getIdentifier(p_identifier);
    const address = await addressesModel.find({ identifier: identifier?._id }).exec();
    if (!address) {
      return {
        result: "error",
        message: "Address not found",
      };
    }
    return {
      result: "success",
      message: "Address retrieved",
      addresses: address,
    };
  } catch (error) {
    return {
      result: "error",
      message: "An error occurred while retrieving the address",
      error: error,
    };
  }
};

/**
 * Removes an address from the database.
 * @param addressId - The unique address ID of the address to be removed.
 * @returns A promise that resolves to an AddressResultDTO.
 */
export const removeAddress = async (addressId: string): Promise<AddressResultDTO> => {
  try {
    const removedAddress = await addressesModel.findByIdAndDelete(addressId).exec();
    if (!removedAddress) {
      return {
        result: "error",
        message: "Address not found",
      };
    }
    return {
      result: "success",
      message: "Address removed",
      address: removedAddress,
    };
  } catch (error) {
    return {
      result: "error",
      message: "An error occurred while removing the address",
      error: error,
    };
  }
};
