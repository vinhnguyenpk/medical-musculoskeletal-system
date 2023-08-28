import { AsyncLocalStorage } from 'async_hooks';

export class ContextManager {
  private static instance: ContextManager;
  private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, unknown>>;

  private constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  run<T>(callback: () => Promise<T>): Promise<T> {
    return this.asyncLocalStorage.run(new Map(), callback);
  }

  set(key: string, value: unknown): void {
    const store = this.asyncLocalStorage.getStore();
    store?.set(key, value);
  }

  get(key: string): unknown {
    const store = this.asyncLocalStorage.getStore();
    return store?.get(key);
  }
}
