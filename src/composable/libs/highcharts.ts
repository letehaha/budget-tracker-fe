import { merge } from 'lodash-es';
import { format } from 'date-fns';
import { useFormatCurrency } from '@/composable';

const defaultConfig = {
  credits: false,
};

export const useHighcharts = () => {
  const { formatBaseCurrency } = useFormatCurrency();

  const getDefaultConfig = () => ({ ...defaultConfig });

  const buildAreaChartConfig = (extendConfig) => merge(getDefaultConfig(), {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
    },
    // So xAxis will be rendered correctly but not as hours
    time: {
      useUTC: false,
    },
    title: null,
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%d %b',
      },
      // Show fullheight crosshair for the selected point
      // crosshair: true
      gridLineWidth: 0,
      labels: {
        style: {
          color: 'var(--app-text-base)',
        },
      },
    },
    yAxis: {
      title: null,
      labels: {
        style: {
          color: 'var(--app-text-base)',
        },
      },
      gridLineColor: 'rgba(var(--app-primary-rgb), 0.1)',
    },
    plotOptions: {
      area: {
        fillOpacity: 0.5,
        lineColor: 'var(--app-primary)',
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3,
          },
        },
        threshold: null,
        fillColor: {
          linearGradient: {
            x1: 0, x2: 0, y1: 0, y2: 1,
          },
          stops: [
            [0, 'rgba(var(--app-primary-rgb), 0.3)'],
            [1, 'rgba(var(--app-primary-rgb), 0)'],
          ],
        },
        marker: {
          // Disable markers so the line will be smoother
          enabled: false,
          states: {
            hover: {
              enabled: true,
              fillColor: 'var(--app-primary)',
              lineColor: 'var(--app-primary)',
              lineWidth: 0,
            },
          },
        },
      },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: 'var(--app-bg-box)',
      borderColor: 'transparent',
      formatter() {
        return `
          <div class="balance-trend-widget__tooltip">
            <div class="balance-trend-widget__tooltip-date">
              ${format(this.x, 'MMMM d, yyyy')}
            </div>
            <div class="balance-trend-widget__tooltip-value">
              Balance: <span>${formatBaseCurrency(this.y)}</span>
            </div>
          </div>
        `;
      },
      shadow: false,
      borderRadius: 8,
      style: {
        color: 'var(--app-text-base)',
      },
    },
  }, extendConfig);

  return {
    getDefaultConfig,
    buildAreaChartConfig,
  };
};
