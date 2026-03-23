/**
 * Audience-conditional content for the WQT landing page.
 * All copy lives here so marketing can update in one place.
 */

export const AUDIENCE_CONTENT = {
  homeowner: {
    hero: {
      eyebrow: 'Earn Money From Water',
      headline: 'Get Paid to Harvest Clean Water',
      headlineAccent: 'From the Air.',
      subhead:
        'Generate verified water credits from your property. Monitored 24/7. Earn passively.',
      cta: { label: 'Start Earning Credits', href: '/marketplace' },
    },
    howItWorks: {
      steps: [
        {
          title: 'Install an AWG or Collection System',
          desc: 'Set up an atmospheric water generator or rainwater collection on your property. BlueSignal pairs it with a WQM-1 sensor.',
          color: '#06B6D4',
        },
        {
          title: 'BlueSignal Monitors Production 24/7',
          desc: 'The sensor reads water quality around the clock — every gallon is timestamped, encrypted, and verified automatically.',
          color: '#3B82F6',
        },
        {
          title: 'Earn QC Credits for Every Gallon Verified',
          desc: 'Quality and Quantity Credits stack. Your utility pays you automatically — rebates appear on your water bill.',
          color: '#10B981',
        },
      ],
    },
    valueProps: [
      {
        title: 'Passive Income from Water Production',
        desc: 'Your AWG runs. The sensor verifies. Credits accumulate. Rebates hit your bill — no manual steps required.',
        color: '#06B6D4',
      },
      {
        title: 'Real-Time Monitoring via BlueSignal WQM-1',
        desc: 'Track production, water quality readings, and credit generation from anywhere — all in real time.',
        color: '#3B82F6',
      },
      {
        title: 'Verified Credits Backed by Continuous Sensor Data',
        desc: 'Every credit is tied to a real sensor reading — timestamped, encrypted, and independently verifiable.',
        color: '#8B5CF6',
      },
    ],
    trust: 'Verified by BlueSignal WQM-1 · Featured in Global Water Intelligence',
    bottomCta: {
      headline: 'Start Earning From Your Water Generator',
      label: 'Join the Marketplace',
      href: '/login',
    },
  },
  utility: {
    hero: {
      eyebrow: 'Built for Utilities',
      headline: 'Add Supply Without',
      headlineAccent: 'Breaking Ground.',
      subhead:
        'Distributed local water production — metered, verified, and priced on your terms.',
      cta: { label: 'See How It Works', href: '#demand-response' },
    },
    howItWorks: {
      steps: [
        {
          title: 'Homeowners Install Distributed Production',
          desc: 'Residents deploy atmospheric water generators across your service area — reducing centralized demand at the source.',
          color: '#3B82F6',
        },
        {
          title: 'BlueSignal Verifies Every Gallon with Inline Metering',
          desc: 'Each installation is paired with a WQM-1 sensor. Production data flows in real time — auditable, encrypted, tamper-evident.',
          color: '#8B5CF6',
        },
        {
          title: 'Purchase Bundled Credits at Your Buyback Rate',
          desc: 'You set the rate. Credits are generated automatically and settled against participant water bills — no new billing infrastructure needed.',
          color: '#10B981',
        },
      ],
    },
    valueProps: [
      {
        title: 'Defer Capital Projects — No New Pipelines or Plants',
        desc: 'Distributed production offsets centralized demand. Delay or avoid expensive infrastructure upgrades.',
        color: '#3B82F6',
      },
      {
        title: 'Auditable Per-Gallon Production Data',
        desc: 'Every gallon is metered, timestamped, and stored — giving your compliance team the data they need.',
        color: '#8B5CF6',
      },
      {
        title: 'You Set Buyback Rates and Quality Multipliers',
        desc: 'Configure rebate economics to match your service area. Transparent pricing backed by real production data.',
        color: '#10B981',
      },
    ],
    trust:
      'Three-layer verification: inline metering, continuous monitoring, independent third-party sampling',
    bottomCta: {
      headline: 'Launch a Water Credit Program for Your Service Area',
      label: 'Request a Pilot Program Brief',
      href: 'mailto:hi@bluesignal.xyz?subject=Utility%20Pilot%20Inquiry',
    },
  },
};
