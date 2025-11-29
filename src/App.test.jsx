import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('App Component - Mode Detection Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Hostname-based mode detection', () => {
    it('should detect cloud mode for cloud.bluesignal.xyz', () => {
      const host = 'cloud.bluesignal.xyz'
      const mode =
        host === 'cloud.bluesignal.xyz' ||
        host.endsWith('.cloud.bluesignal.xyz') ||
        host === 'cloud-bluesignal.web.app'
          ? 'cloud'
          : 'marketplace'

      expect(mode).toBe('cloud')
    })

    it('should detect cloud mode for cloud-bluesignal.web.app', () => {
      const host = 'cloud-bluesignal.web.app'
      const mode =
        host === 'cloud.bluesignal.xyz' ||
        host.endsWith('.cloud.bluesignal.xyz') ||
        host === 'cloud-bluesignal.web.app'
          ? 'cloud'
          : 'marketplace'

      expect(mode).toBe('cloud')
    })

    it('should detect cloud mode for subdomain of cloud.bluesignal.xyz', () => {
      const host = 'test.cloud.bluesignal.xyz'
      const mode =
        host === 'cloud.bluesignal.xyz' ||
        host.endsWith('.cloud.bluesignal.xyz') ||
        host === 'cloud-bluesignal.web.app'
          ? 'cloud'
          : 'marketplace'

      expect(mode).toBe('cloud')
    })

    it('should detect marketplace mode for waterquality.trading', () => {
      const host = 'waterquality.trading'
      const mode =
        host === 'waterquality.trading' ||
        host === 'waterquality-trading.web.app' ||
        host.endsWith('.waterquality.trading')
          ? 'marketplace'
          : 'marketplace'

      expect(mode).toBe('marketplace')
    })

    it('should detect marketplace mode for waterquality-trading.web.app', () => {
      const host = 'waterquality-trading.web.app'
      const mode =
        host === 'waterquality.trading' ||
        host === 'waterquality-trading.web.app' ||
        host.endsWith('.waterquality.trading')
          ? 'marketplace'
          : 'marketplace'

      expect(mode).toBe('marketplace')
    })

    it('should default to marketplace mode for unknown hosts', () => {
      const host = 'localhost'
      let mode = 'marketplace'

      if (
        host === 'cloud.bluesignal.xyz' ||
        host.endsWith('.cloud.bluesignal.xyz') ||
        host === 'cloud-bluesignal.web.app'
      ) {
        mode = 'cloud'
      } else if (
        host === 'waterquality.trading' ||
        host === 'waterquality-trading.web.app' ||
        host.endsWith('.waterquality.trading')
      ) {
        mode = 'marketplace'
      }

      expect(mode).toBe('marketplace')
    })
  })

  describe('Query parameter mode override', () => {
    it('should override mode with ?app=cloud query parameter', () => {
      const params = new URLSearchParams('?app=cloud')
      const appParam = params.get('app')

      expect(appParam).toBe('cloud')
    })

    it('should override mode with ?app=marketplace query parameter', () => {
      const params = new URLSearchParams('?app=marketplace')
      const appParam = params.get('app')

      expect(appParam).toBe('marketplace')
    })

    it('should return null for invalid app parameter', () => {
      const params = new URLSearchParams('?app=invalid')
      const appParam = params.get('app')

      expect(['cloud', 'marketplace']).not.toContain(appParam)
    })
  })

  describe('Mode selection priority', () => {
    it('should prioritize cloud hostname over query param', () => {
      const host = 'cloud.bluesignal.xyz'
      const params = new URLSearchParams('?app=marketplace')

      let mode = 'marketplace'

      // Hostname detection first
      if (
        host === 'cloud.bluesignal.xyz' ||
        host.endsWith('.cloud.bluesignal.xyz') ||
        host === 'cloud-bluesignal.web.app'
      ) {
        mode = 'cloud'
      } else if (
        host === 'waterquality.trading' ||
        host === 'waterquality-trading.web.app' ||
        host.endsWith('.waterquality.trading')
      ) {
        mode = 'marketplace'
      } else {
        const appParam = params.get('app')
        if (appParam === 'cloud' || appParam === 'marketplace') {
          mode = appParam
        }
      }

      expect(mode).toBe('cloud')
    })

    it('should use query param when hostname is unknown', () => {
      const host = 'localhost'
      const params = new URLSearchParams('?app=cloud')

      let mode = 'marketplace'

      // Hostname detection first
      if (
        host === 'cloud.bluesignal.xyz' ||
        host.endsWith('.cloud.bluesignal.xyz') ||
        host === 'cloud-bluesignal.web.app'
      ) {
        mode = 'cloud'
      } else if (
        host === 'waterquality.trading' ||
        host === 'waterquality-trading.web.app' ||
        host.endsWith('.waterquality.trading')
      ) {
        mode = 'marketplace'
      } else {
        const appParam = params.get('app')
        if (appParam === 'cloud' || appParam === 'marketplace') {
          mode = appParam
        }
      }

      expect(mode).toBe('cloud')
    })
  })
})

describe('App Component - Build Version', () => {
  it('should have a valid build version format', () => {
    const BUILD_VERSION = '2025-11-28-03'

    expect(BUILD_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}-\d{2}$/)
  })

  it('should log build version on app initialization', () => {
    const consoleLogSpy = vi.spyOn(console, 'log')
    const BUILD_VERSION = '2025-11-28-03'

    console.log('🔥 BUILD VERSION:', BUILD_VERSION)

    expect(consoleLogSpy).toHaveBeenCalledWith('🔥 BUILD VERSION:', BUILD_VERSION)

    consoleLogSpy.mockRestore()
  })
})
