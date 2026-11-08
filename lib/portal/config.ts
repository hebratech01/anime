export const departmentId = "anime";
export const departmentName = "Anime";
export const customerType = "subscriber";
export const selfSignupTypes: readonly string[] = ["subscriber"];
export const invitationTypes: readonly string[] = ["licensor","prime_producer"];
export const supplierTypes: readonly string[] = ["licensor","prime_producer"];
export const accountLabels: Record<string, string> = {
  "reader": "Reader",
  "creator": "Author / Creator",
  "publisher": "Publisher",
  "subscriber": "Subscriber",
  "licensor": "Anime licensing partner",
  "prime_producer": "Lead production company",
  "buyer": "Buyer",
  "wholesaler": "Wholesaler",
  "manufacturer": "Manufacturer"
};
export function isSupplier(type: string) { return supplierTypes.includes(type); }
