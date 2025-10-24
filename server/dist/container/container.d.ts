declare class Container {
    private services;
    register<T>(name: string, factory: () => T): void;
    get<T>(name: string): T;
}
export declare const container: Container;
export default container;
//# sourceMappingURL=container.d.ts.map