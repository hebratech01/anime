export const departmentId = "anime";
export const departmentName = "Anime";
export const customerType = "subscriber";
export const selfSignupTypes: readonly string[] = ["subscriber"];
export const invitationTypes: readonly string[] = ["licensor","prime_producer"];
const supplierWorkPanels = new Map([
  ["licensor", "Licensing"],
  ["prime_producer", "Production"],
]);
export const supplierTypes: readonly string[] = [...supplierWorkPanels.keys()];
export const accountLabels: Record<string, string> = {
  "subscriber": "Subscriber",
  "licensor": "Anime rights supplier",
  "prime_producer": "Lead production company"
};
export function isSupplier(type: string) { return supplierWorkPanels.has(type); }
export function supplierWorkPanelName(type: string) { return supplierWorkPanels.get(type); }
