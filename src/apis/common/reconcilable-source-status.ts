import { Artifact } from "./artifact";
import { ReconcilableStatus } from "./reconcilable-status";

export class ReconcilableSourceStatus extends ReconcilableStatus {
  url?: string;
  artifact?: Artifact;
}
