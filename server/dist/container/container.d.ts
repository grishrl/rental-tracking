import '../config/env';
declare class Container {
    private registrations;
    private instances;
    register<T>(name: string, factory: () => T, singleton?: boolean): void;
    get<T>(name: string): T;
    clear(): void;
}
export declare const container: Container;
export declare const initializeContainer: () => Promise<void>;
export declare const closeContainer: () => Promise<void>;
export default container;
//# sourceMappingURL=container.d.ts.map