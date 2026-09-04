/**
 * Read-only access to the Contera Context System's structured data
 * (context/data/*.json). Never writes to /context. Types are inferred
 * directly from the JSON files (tsconfig `resolveJsonModule`) rather than
 * hand-maintained here — per context/manifest.md §7, the JSON is already a
 * structured representation of the canonical Markdown, and this module
 * does not add a second, independent one.
 */
import designTokens from "@/context/data/design-tokens.json";
import evaluationScenarios from "@/context/data/evaluation-scenarios.json";
import interactionPrimitives from "@/context/data/interaction-primitives.json";
import policyRegistry from "@/context/data/policy-registry.json";
import productOntology from "@/context/data/product-ontology.json";
import themes from "@/context/data/themes.json";

export function getDesignTokens() {
  return designTokens;
}

export function getEvaluationScenarios() {
  return evaluationScenarios;
}

export function getInteractionPrimitives() {
  return interactionPrimitives;
}

export function getPolicyRegistry() {
  return policyRegistry;
}

export function getProductOntology() {
  return productOntology;
}

export function getThemes() {
  return themes;
}
