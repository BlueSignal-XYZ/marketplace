import { describe, it, expect, vi, beforeEach } from 'vitest';
import HubSpotAPI, {
  HUBSPOT_DEAL_STAGES,
  ORDER_STATUS_TO_DEAL_STAGE,
  HubSpotContactsAPI,
  HubSpotDealsAPI,
  HubSpotDevicesAPI,
  HubSpotSyncAPI,
  HubSpotWebhooksAPI,
} from './hubspot';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

// Mock configs
vi.mock('../../configs', () => ({
  default: {
    server_url: 'https://test-server.example.com',
  },
}));

import axios from 'axios';

const SERVER = 'https://test-server.example.com';

beforeEach(() => {
  vi.clearAllMocks();
});

// =============================================================================
// CONSTANTS
// =============================================================================

describe('HUBSPOT_DEAL_STAGES', () => {
  it('maps all expected stage keys', () => {
    expect(HUBSPOT_DEAL_STAGES).toEqual({
      lead: 'Lead',
      qualified: 'Qualified',
      quoted: 'Quoted',
      closed_won: 'Closed Won',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
    });
  });
});

describe('ORDER_STATUS_TO_DEAL_STAGE', () => {
  it('maps every order status to a HubSpot deal stage', () => {
    expect(ORDER_STATUS_TO_DEAL_STAGE).toEqual({
      draft: 'Lead',
      quoted: 'Quoted',
      approved: 'Qualified',
      paid: 'Closed Won',
      processing: 'Closed Won',
      shipped: 'Closed Won',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
    });
  });

  it('values are all valid HUBSPOT_DEAL_STAGES values', () => {
    const validStages = Object.values(HUBSPOT_DEAL_STAGES);
    Object.values(ORDER_STATUS_TO_DEAL_STAGE).forEach((stage) => {
      expect(validStages).toContain(stage);
    });
  });
});

// =============================================================================
// HubSpotContactsAPI
// =============================================================================

describe('HubSpotContactsAPI', () => {
  describe('create', () => {
    it('posts contact data and returns response', async () => {
      const contactData = { email: 'a@b.com', firstname: 'Alice' };
      axios.post.mockResolvedValue({ data: { id: 'c1' } });

      const result = await HubSpotContactsAPI.create(contactData);

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/contacts/create`, { contactData });
      expect(result).toEqual({ id: 'c1' });
    });

    it('throws on network error', async () => {
      axios.post.mockRejectedValue(new Error('Network error'));
      await expect(HubSpotContactsAPI.create({})).rejects.toThrow('Network error');
    });
  });

  describe('update', () => {
    it('posts hubspotId and contactData', async () => {
      axios.post.mockResolvedValue({ data: { updated: true } });

      const result = await HubSpotContactsAPI.update('h1', { firstname: 'Bob' });

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/contacts/update`, {
        hubspotId: 'h1',
        contactData: { firstname: 'Bob' },
      });
      expect(result).toEqual({ updated: true });
    });

    it('throws on failure', async () => {
      axios.post.mockRejectedValue(new Error('500'));
      await expect(HubSpotContactsAPI.update('h1', {})).rejects.toThrow('500');
    });
  });

  describe('get', () => {
    it('fetches contact by hubspotId', async () => {
      axios.post.mockResolvedValue({ data: { id: 'h1', email: 'a@b.com' } });

      const result = await HubSpotContactsAPI.get('h1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/contacts/get`, {
        hubspotId: 'h1',
      });
      expect(result).toEqual({ id: 'h1', email: 'a@b.com' });
    });
  });

  describe('getByEmail', () => {
    it('fetches contact by email', async () => {
      axios.post.mockResolvedValue({ data: { id: 'h2' } });

      const result = await HubSpotContactsAPI.getByEmail('test@example.com');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/contacts/get-by-email`, {
        email: 'test@example.com',
      });
      expect(result).toEqual({ id: 'h2' });
    });
  });

  describe('search', () => {
    it('searches contacts by query', async () => {
      axios.post.mockResolvedValue({ data: { results: [] } });

      const result = await HubSpotContactsAPI.search('alice');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/contacts/search`, {
        query: 'alice',
      });
      expect(result).toEqual({ results: [] });
    });
  });
});

// =============================================================================
// HubSpotDealsAPI
// =============================================================================

describe('HubSpotDealsAPI', () => {
  describe('create', () => {
    it('posts deal data', async () => {
      const dealData = { dealname: 'Order 1', amount: 100 };
      axios.post.mockResolvedValue({ data: { id: 'd1' } });

      const result = await HubSpotDealsAPI.create(dealData);

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/deals/create`, { dealData });
      expect(result).toEqual({ id: 'd1' });
    });

    it('throws on failure', async () => {
      axios.post.mockRejectedValue(new Error('Bad request'));
      await expect(HubSpotDealsAPI.create({})).rejects.toThrow('Bad request');
    });
  });

  describe('update', () => {
    it('posts hubspotId and dealData', async () => {
      axios.post.mockResolvedValue({ data: { updated: true } });

      const result = await HubSpotDealsAPI.update('d1', { amount: 200 });

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/deals/update`, {
        hubspotId: 'd1',
        dealData: { amount: 200 },
      });
      expect(result).toEqual({ updated: true });
    });
  });

  describe('updateStage', () => {
    it('posts hubspotId and stage', async () => {
      axios.post.mockResolvedValue({ data: { ok: true } });

      const result = await HubSpotDealsAPI.updateStage('d1', 'Qualified');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/deals/update-stage`, {
        hubspotId: 'd1',
        stage: 'Qualified',
      });
      expect(result).toEqual({ ok: true });
    });
  });

  describe('get', () => {
    it('fetches deal by hubspotId', async () => {
      axios.post.mockResolvedValue({ data: { id: 'd1', dealname: 'Test' } });

      const result = await HubSpotDealsAPI.get('d1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/deals/get`, { hubspotId: 'd1' });
      expect(result).toEqual({ id: 'd1', dealname: 'Test' });
    });
  });

  describe('search', () => {
    it('searches deals', async () => {
      axios.post.mockResolvedValue({ data: { results: [{ id: 'd2' }] } });

      const result = await HubSpotDealsAPI.search('order');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/deals/search`, { query: 'order' });
      expect(result).toEqual({ results: [{ id: 'd2' }] });
    });
  });

  describe('associateWithContact', () => {
    it('associates deal with contact', async () => {
      axios.post.mockResolvedValue({ data: { associated: true } });

      const result = await HubSpotDealsAPI.associateWithContact('d1', 'c1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/deals/associate-contact`, {
        dealId: 'd1',
        contactId: 'c1',
      });
      expect(result).toEqual({ associated: true });
    });
  });
});

// =============================================================================
// HubSpotDevicesAPI
// =============================================================================

describe('HubSpotDevicesAPI', () => {
  describe('create', () => {
    it('posts device data with dealId', async () => {
      const deviceData = { device_serial: 'SN001' };
      axios.post.mockResolvedValue({ data: { id: 'dev1' } });

      const result = await HubSpotDevicesAPI.create(deviceData, 'd1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/devices/create`, {
        deviceData,
        dealId: 'd1',
      });
      expect(result).toEqual({ id: 'dev1' });
    });
  });

  describe('update', () => {
    it('posts hubspotId and deviceData', async () => {
      axios.post.mockResolvedValue({ data: { updated: true } });

      const result = await HubSpotDevicesAPI.update('dev1', { device_serial: 'SN002' });

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/devices/update`, {
        hubspotId: 'dev1',
        deviceData: { device_serial: 'SN002' },
      });
      expect(result).toEqual({ updated: true });
    });
  });

  describe('get', () => {
    it('fetches device by hubspotId', async () => {
      axios.post.mockResolvedValue({ data: { id: 'dev1' } });

      const result = await HubSpotDevicesAPI.get('dev1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/devices/get`, {
        hubspotId: 'dev1',
      });
      expect(result).toEqual({ id: 'dev1' });
    });
  });

  describe('associateWithDeal', () => {
    it('associates device with deal', async () => {
      axios.post.mockResolvedValue({ data: { ok: true } });

      const result = await HubSpotDevicesAPI.associateWithDeal('dev1', 'd1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/devices/associate-deal`, {
        deviceId: 'dev1',
        dealId: 'd1',
      });
      expect(result).toEqual({ ok: true });
    });
  });
});

// =============================================================================
// HubSpotSyncAPI — CRUD wrappers
// =============================================================================

describe('HubSpotSyncAPI', () => {
  describe('getStatus', () => {
    it('posts entityType and entityId', async () => {
      axios.post.mockResolvedValue({ data: { synced: true } });

      const result = await HubSpotSyncAPI.getStatus('contact', 'e1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/status`, {
        entityType: 'contact',
        entityId: 'e1',
      });
      expect(result).toEqual({ synced: true });
    });
  });

  describe('syncEntity', () => {
    it('syncs entity without force by default', async () => {
      axios.post.mockResolvedValue({ data: { ok: true } });

      await HubSpotSyncAPI.syncEntity('deal', 'd1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/entity`, {
        entityType: 'deal',
        entityId: 'd1',
        forceSync: false,
      });
    });

    it('passes forceSync=true when specified', async () => {
      axios.post.mockResolvedValue({ data: { ok: true } });

      await HubSpotSyncAPI.syncEntity('deal', 'd1', true);

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/entity`, {
        entityType: 'deal',
        entityId: 'd1',
        forceSync: true,
      });
    });
  });

  describe('batchSync', () => {
    it('posts entities array', async () => {
      const entities = [{ type: 'contact', id: '1' }];
      axios.post.mockResolvedValue({ data: { synced: 1 } });

      const result = await HubSpotSyncAPI.batchSync(entities);

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/batch`, { entities });
      expect(result).toEqual({ synced: 1 });
    });
  });

  describe('getErrors', () => {
    it('uses GET request', async () => {
      axios.get.mockResolvedValue({ data: { errors: [] } });

      const result = await HubSpotSyncAPI.getErrors();

      expect(axios.get).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/errors`);
      expect(result).toEqual({ errors: [] });
    });
  });

  describe('retryError', () => {
    it('posts errorId', async () => {
      axios.post.mockResolvedValue({ data: { retried: true } });

      const result = await HubSpotSyncAPI.retryError('err1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/retry`, { errorId: 'err1' });
      expect(result).toEqual({ retried: true });
    });
  });

  describe('getStats', () => {
    it('uses GET request', async () => {
      axios.get.mockResolvedValue({ data: { total: 50 } });

      const result = await HubSpotSyncAPI.getStats();

      expect(axios.get).toHaveBeenCalledWith(`${SERVER}/hubspot/sync/stats`);
      expect(result).toEqual({ total: 50 });
    });
  });
});

// =============================================================================
// HubSpotSyncAPI — Utility functions (business logic)
// =============================================================================

describe('HubSpotSyncAPI utilities', () => {
  describe('syncCustomer', () => {
    const customer = {
      id: 'cust_1',
      email: 'jane@example.com',
      name: 'Jane Doe',
      phone: '555-1234',
      company: 'Acme',
      type: 'enterprise',
    };

    it('creates a new contact when none exists', async () => {
      // getContactByEmail returns no match
      axios.post
        .mockResolvedValueOnce({ data: null }) // getByEmail → null
        .mockResolvedValueOnce({ data: { id: 'new_c' } }); // create

      const result = await HubSpotSyncAPI.syncCustomer(customer);

      // First call: get-by-email
      expect(axios.post.mock.calls[0]).toEqual([
        `${SERVER}/hubspot/contacts/get-by-email`,
        { email: 'jane@example.com' },
      ]);
      // Second call: create
      expect(axios.post.mock.calls[1][0]).toBe(`${SERVER}/hubspot/contacts/create`);
      expect(axios.post.mock.calls[1][1].contactData).toMatchObject({
        email: 'jane@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
        phone: '555-1234',
        company: 'Acme',
        customer_type: 'enterprise',
        bluesignal_customer_id: 'cust_1',
      });
      expect(result).toEqual({ id: 'new_c' });
    });

    it('updates existing contact when found by email', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { id: 'existing_c' } }) // getByEmail
        .mockResolvedValueOnce({ data: { updated: true } }); // update

      const result = await HubSpotSyncAPI.syncCustomer(customer);

      // Second call should be update, not create
      expect(axios.post.mock.calls[1][0]).toBe(`${SERVER}/hubspot/contacts/update`);
      expect(axios.post.mock.calls[1][1].hubspotId).toBe('existing_c');
      expect(result).toEqual({ updated: true });
    });

    it('splits single-word name correctly (no lastname)', async () => {
      const singleName = { ...customer, name: 'Madonna' };
      axios.post
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: { id: 'c3' } });

      await HubSpotSyncAPI.syncCustomer(singleName);

      const contactData = axios.post.mock.calls[1][1].contactData;
      expect(contactData.firstname).toBe('Madonna');
      expect(contactData.lastname).toBe('');
    });

    it('splits multi-part name correctly', async () => {
      const multiName = { ...customer, name: 'Mary Jane Watson' };
      axios.post
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: { id: 'c4' } });

      await HubSpotSyncAPI.syncCustomer(multiName);

      const contactData = axios.post.mock.calls[1][1].contactData;
      expect(contactData.firstname).toBe('Mary');
      expect(contactData.lastname).toBe('Jane Watson');
    });

    it('throws when API call fails', async () => {
      axios.post.mockRejectedValue(new Error('Server down'));
      await expect(HubSpotSyncAPI.syncCustomer(customer)).rejects.toThrow('Server down');
    });
  });

  describe('syncOrder', () => {
    const order = {
      id: 'ord_1',
      status: 'paid',
      total: 5000,
      lineItems: [{ quantity: 2 }, { quantity: 3 }],
      paymentStatus: 'complete',
    };

    it('creates new deal and associates with contact', async () => {
      const customer = { hubspotContactId: 'hc1' };
      axios.post
        .mockResolvedValueOnce({ data: { id: 'deal_new' } }) // createDeal
        .mockResolvedValueOnce({ data: { ok: true } }); // associateDealWithContact

      const result = await HubSpotSyncAPI.syncOrder(order, customer);

      // createDeal call
      const dealData = axios.post.mock.calls[0][1].dealData;
      expect(dealData.dealname).toBe('BlueSignal Order ord_1');
      expect(dealData.amount).toBe(5000);
      expect(dealData.dealstage).toBe('Closed Won'); // 'paid' → 'Closed Won'
      expect(dealData.device_count).toBe(5); // 2 + 3
      expect(dealData.payment_status).toBe('complete');

      // associate call
      expect(axios.post.mock.calls[1]).toEqual([
        `${SERVER}/hubspot/deals/associate-contact`,
        { dealId: 'deal_new', contactId: 'hc1' },
      ]);
      expect(result).toEqual({ id: 'deal_new' });
    });

    it('updates existing deal when hubspotDealId is present', async () => {
      const existingOrder = { ...order, hubspotDealId: 'existing_deal' };
      axios.post.mockResolvedValue({ data: { updated: true } });

      const result = await HubSpotSyncAPI.syncOrder(existingOrder, {});

      expect(axios.post.mock.calls[0][0]).toBe(`${SERVER}/hubspot/deals/update`);
      expect(axios.post.mock.calls[0][1].hubspotId).toBe('existing_deal');
      expect(result).toEqual({ updated: true });
    });

    it('does not associate when customer has no hubspotContactId', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 'deal_2' } });

      await HubSpotSyncAPI.syncOrder(order, {});

      // Only one call — create, no associate
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('does not associate when customer is null', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 'deal_3' } });

      await HubSpotSyncAPI.syncOrder(order, null);

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('falls back to Lead stage for unknown order status', async () => {
      const unknownStatus = { ...order, status: 'unknown_status' };
      axios.post.mockResolvedValueOnce({ data: { id: 'deal_4' } });

      await HubSpotSyncAPI.syncOrder(unknownStatus, {});

      const dealData = axios.post.mock.calls[0][1].dealData;
      expect(dealData.dealstage).toBe('Lead');
    });

    it('throws on API error', async () => {
      axios.post.mockRejectedValue(new Error('Timeout'));
      await expect(HubSpotSyncAPI.syncOrder(order, {})).rejects.toThrow('Timeout');
    });
  });

  describe('syncDevice', () => {
    const device = {
      id: 'dev_1',
      serialNumber: 'SN-100',
      sku: 'WQM-1',
      name: 'Water Quality Monitor',
      lifecycle: 'active',
      commissionStatus: 'commissioned',
    };

    it('creates new device when no hubspotDeviceId and dealId provided', async () => {
      axios.post.mockResolvedValue({ data: { id: 'hdev_1' } });

      const result = await HubSpotSyncAPI.syncDevice(device, 'deal_1');

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/devices/create`, {
        deviceData: {
          device_serial: 'SN-100',
          device_sku: 'WQM-1',
          device_name: 'Water Quality Monitor',
          device_lifecycle: 'active',
          commission_status: 'commissioned',
          bluesignal_device_id: 'dev_1',
        },
        dealId: 'deal_1',
      });
      expect(result).toEqual({ id: 'hdev_1' });
    });

    it('updates existing device when hubspotDeviceId is present', async () => {
      const existing = { ...device, hubspotDeviceId: 'hdev_existing' };
      axios.post.mockResolvedValue({ data: { updated: true } });

      const result = await HubSpotSyncAPI.syncDevice(existing, 'deal_1');

      expect(axios.post.mock.calls[0][0]).toBe(`${SERVER}/hubspot/devices/update`);
      expect(axios.post.mock.calls[0][1].hubspotId).toBe('hdev_existing');
      expect(result).toEqual({ updated: true });
    });

    it('returns undefined when no hubspotDeviceId and no dealId', async () => {
      const result = await HubSpotSyncAPI.syncDevice(device, undefined);

      expect(axios.post).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('throws on API error', async () => {
      axios.post.mockRejectedValue(new Error('Fail'));
      await expect(HubSpotSyncAPI.syncDevice(device, 'deal_1')).rejects.toThrow('Fail');
    });
  });
});

// =============================================================================
// HubSpotWebhooksAPI
// =============================================================================

describe('HubSpotWebhooksAPI', () => {
  describe('handleDeal', () => {
    it('posts deal webhook payload', async () => {
      const payload = { dealId: 'd1', event: 'updated' };
      axios.post.mockResolvedValue({ data: { processed: true } });

      const result = await HubSpotWebhooksAPI.handleDeal(payload);

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/webhooks/deal`, { payload });
      expect(result).toEqual({ processed: true });
    });

    it('throws on failure', async () => {
      axios.post.mockRejectedValue(new Error('Webhook failed'));
      await expect(HubSpotWebhooksAPI.handleDeal({})).rejects.toThrow('Webhook failed');
    });
  });

  describe('handleContact', () => {
    it('posts contact webhook payload', async () => {
      const payload = { contactId: 'c1', event: 'created' };
      axios.post.mockResolvedValue({ data: { ok: true } });

      const result = await HubSpotWebhooksAPI.handleContact(payload);

      expect(axios.post).toHaveBeenCalledWith(`${SERVER}/hubspot/webhooks/contact`, { payload });
      expect(result).toEqual({ ok: true });
    });
  });
});

// =============================================================================
// Default export structure
// =============================================================================

describe('HubSpotAPI default export', () => {
  it('exposes all sub-APIs', () => {
    expect(HubSpotAPI.contacts).toBe(HubSpotContactsAPI);
    expect(HubSpotAPI.deals).toBe(HubSpotDealsAPI);
    expect(HubSpotAPI.devices).toBe(HubSpotDevicesAPI);
    expect(HubSpotAPI.sync).toBe(HubSpotSyncAPI);
    expect(HubSpotAPI.webhooks).toBe(HubSpotWebhooksAPI);
  });

  it('exposes constants', () => {
    expect(HubSpotAPI.DEAL_STAGES).toBe(HUBSPOT_DEAL_STAGES);
    expect(HubSpotAPI.ORDER_STATUS_TO_STAGE).toBe(ORDER_STATUS_TO_DEAL_STAGE);
  });
});
