import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const exampleContract = {
 *   name: "YourContract",
 *   chainId: "31337",
 *   contracts: {
 *     YourContract: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const satisfies GenericContractsDeclaration
 */
const deployedContracts = {} as const satisfies GenericContractsDeclaration;

export default deployedContracts;
