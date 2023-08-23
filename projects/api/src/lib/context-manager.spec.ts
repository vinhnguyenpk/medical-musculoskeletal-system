import { ContextManager } from './context-manager';

describe('ContextManager', () => {
  let contextManager: ContextManager;

  beforeEach(() => {
    contextManager = ContextManager.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have a getInstance method', () => {
    expect(typeof ContextManager.getInstance).toBe('function');
  });

  it('should be a singleton', () => {
    const anotherInstance = ContextManager.getInstance();
    expect(contextManager).toBe(anotherInstance);
  });

  it('should run a callback with an empty context', async () => {
    const callback = jest.fn().mockResolvedValue('test');

    const result = await contextManager.run(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
  });

  it('should set and get values in the context', async () => {
    await contextManager.run(async () => {
      contextManager.set('key', 'value');
      const value = contextManager.get('key');
      expect(value).toBe('value');
    });
  });

  it('should keep contexts isolated between runs', async () => {
    const firstRun = contextManager.run(async () => {
      contextManager.set('key', 'value1');
      const value = contextManager.get('key');
      expect(value).toBe('value1');
    });

    const secondRun = contextManager.run(async () => {
      contextManager.set('key', 'value2');
      const value = contextManager.get('key');
      expect(value).toBe('value2');
    });

    await Promise.all([firstRun, secondRun]);
  });
});
