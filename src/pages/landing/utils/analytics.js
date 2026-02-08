/**
 * CTA event tracking for the landing page.
 * Pushes to dataLayer for Google Analytics / GTM.
 * Also fires gtag() if available.
 */
export function trackCTA(action, label) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'cta_click', action, label });

  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: 'CTA',
      event_label: label,
    });
  }
}
