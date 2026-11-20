import type { SupplyProfile } from "./supply-model";

export const profiles: Record<string, SupplyProfile> = {
  "licensor": {
    "primary": "Title Offers",
    "nextTab": "Media Deliveries",
    "singular": "title offer",
    "receipt": "Title offer received for evaluation",
    "pending": "Episode media delivery requires an executed license and authorized delivery scope for the exact episodes.",
    "fields": [
      {
        "key": "namespace",
        "label": "Source catalog namespace",
        "type": "text",
        "required": true,
        "maxLength": 120
      },
      {
        "key": "external_id",
        "label": "External title ID",
        "type": "text",
        "required": true,
        "maxLength": 160
      },
      {
        "key": "season",
        "label": "External season ID",
        "type": "text",
        "required": true,
        "maxLength": 100
      },
      {
        "key": "episodes",
        "label": "Exact external episode IDs",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "language",
        "label": "Edition or delivery language",
        "type": "text",
        "required": true,
        "maxLength": 48
      },
      {
        "key": "territories",
        "label": "Proposed territories",
        "type": "text",
        "required": true,
        "maxLength": 120
      },
      {
        "key": "platform",
        "label": "Proposed streaming platform",
        "type": "text",
        "required": true,
        "maxLength": 120
      },
      {
        "key": "valid_from",
        "label": "Proposed first day (Manila)",
        "type": "date",
        "required": true
      },
      {
        "key": "valid_until",
        "label": "Proposed end day, exclusive (Manila)",
        "type": "date",
        "required": true
      },
      {
        "key": "price_centavos",
        "label": "Full proposed licensing fee (PHP)",
        "type": "money",
        "required": true
      },
      {
        "key": "manifest",
        "label": "Proposed media and subtitle deliverables",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "authority_claim",
        "label": "Rights and offer evidence references",
        "type": "long",
        "required": true,
        "maxLength": 2000
      }
    ],
    "invited": false
  },
  "prime_producer": {
    "primary": "Proposals",
    "nextTab": "Projects",
    "singular": "production proposal",
    "receipt": "Production proposal received for evaluation",
    "pending": "Project milestones and deliverables require a signed prime contract and an effective notice to proceed.",
    "fields": [
      {
        "key": "price_centavos",
        "label": "Full related production bid (PHP)",
        "type": "money",
        "required": true
      },
      {
        "key": "schedule",
        "label": "Production schedule",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "milestones",
        "label": "Milestones, payments and payment triggers",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "deliverables",
        "label": "Deliverables and acceptance criteria",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "subcontract",
        "label": "Subcontracting scope and contribution clearance plan",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "rights",
        "label": "Proposed rights and contribution evidence references",
        "type": "long",
        "required": true,
        "maxLength": 2000
      },
      {
        "key": "exclusions",
        "label": "Assumptions, exclusions and extra-work terms",
        "type": "long",
        "required": true,
        "maxLength": 2000
      }
    ],
    "invited": true
  }
};
