import { ASourceLoader } from "./ASourceLoader";
export declare class SourcePreLoader {
    protected loaderList: ASourceLoader[];
    protected _numSources: number;
    protected loadPosition: number;
    readonly numSources: number;
    isLoading: boolean;
    isComplete: boolean;
    hasError: boolean;
    numRetrys: number;
    constructor();
    addSource(...sourceLoader: ASourceLoader[]): void;
    preload(index?: number): void;
    protected onItemLoaded(sourceLoader: ASourceLoader): void;
    reload(): void;
    forEach(callback: (index: number, loader: ASourceLoader) => void): void;
}
