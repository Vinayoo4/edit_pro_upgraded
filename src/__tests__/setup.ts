import 'localforage';
import { vi } from 'vitest';
// Mock localforage for node environment
vi.mock('localforage', () => {
    return {
        default: {
            getItem: vi.fn().mockResolvedValue(null),
            setItem: vi.fn().mockResolvedValue(undefined),
            removeItem: vi.fn().mockResolvedValue(undefined)
        }
    }
});
