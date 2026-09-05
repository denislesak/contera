/**
 * FixtureValue<T> — transcribed from context/components.md §2, "Prototype
 * fixture labeling". Convention only, not enforced by the type system.
 * Wraps an input that corresponds to UNRESOLVED product policy so it is
 * never mistaken for a production value or a resolved policy decision.
 */
export interface FixtureValue<T> {
  value: T;
  source: "fixture";
  policyStatus: "UNRESOLVED";
  /** e.g., "Required Turnaround Time production calculation is
   *  UNRESOLVED (product.md Section 2.2); this is a labeled prototype
   *  fixture, not a resolved value." */
  note: string;
}
