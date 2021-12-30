import {Condition} from "./condition";
import {GitRepository} from "../source/git-repository";

export class ReconcilableStatus {
    observedGeneration: number;
    conditions?: Condition[];
    lastHandledReconcileAt?: string;
}