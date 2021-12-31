import { Condition } from "./condition";

export class ReconcilableStatus {
  observedGeneration: number;
  conditions?: Condition[];
  lastHandledReconcileAt?: string;
}
