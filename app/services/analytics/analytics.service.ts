declare var analytics;
import {Injectable} from 'angular2/core';

@Injectable()
export class AnalyticsService {
  constructor() {
    if (window['analytics']) {
      analytics.startTrackerWithId('UA-76474284-1');
      analytics.enableUncaughtExceptionReporting(true);
      analytics.trackEvent('AnalyticsService', 'Loaded', 'Good', 'Application and service loaded');
    }
  }

  trackEvent(category: string, action: string, label: string, value: any) {
    if (window['analytics']) {
      analytics.trackEvent(category, action, label, value);
    }
  }

  trackException(description: string, fatal: boolean) {
    if (window['analytics']) {
      analytics.trackEvent(description, fatal);
    }
  }

  trackView(title: string) {
    if (window['analytics']) {
      analytics.trackView(title);
    }
  }


}
