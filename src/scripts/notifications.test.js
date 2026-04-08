import { describe, it, expect, beforeEach } from 'vitest';
import { pushLocalNotification } from './notifications';

describe('pushLocalNotification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a notification and stores it in localStorage', () => {
    const result = pushLocalNotification('success', 'Operation complete');

    expect(result).toEqual({
      id: 0,
      type: 'success',
      message: 'Operation complete',
      time: expect.any(Number),
    });

    const stored = JSON.parse(localStorage.getItem('notifications'));
    expect(stored).toHaveLength(1);
    expect(stored[0].type).toBe('success');
    expect(stored[0].message).toBe('Operation complete');
  });

  it('appends to existing notifications', () => {
    pushLocalNotification('info', 'First');
    pushLocalNotification('error', 'Second');

    const stored = JSON.parse(localStorage.getItem('notifications'));
    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe(0);
    expect(stored[1].id).toBe(1);
  });

  it('assigns sequential IDs based on array length', () => {
    pushLocalNotification('info', 'A');
    pushLocalNotification('info', 'B');
    const result = pushLocalNotification('info', 'C');

    expect(result.id).toBe(2);
  });

  it('stores timestamp with each notification', () => {
    const before = Date.now();
    const result = pushLocalNotification('warn', 'Test');
    const after = Date.now();

    expect(result.time).toBeGreaterThanOrEqual(before);
    expect(result.time).toBeLessThanOrEqual(after);
  });

  it('handles different notification types', () => {
    pushLocalNotification('error', 'Failed');
    pushLocalNotification('success', 'Passed');
    pushLocalNotification('info', 'FYI');
    pushLocalNotification('warn', 'Careful');

    const stored = JSON.parse(localStorage.getItem('notifications'));
    expect(stored.map((n) => n.type)).toEqual(['error', 'success', 'info', 'warn']);
  });

  it('works when localStorage has no existing notifications key', () => {
    expect(localStorage.getItem('notifications')).toBeNull();
    const result = pushLocalNotification('info', 'First ever');
    expect(result.id).toBe(0);
  });
});
