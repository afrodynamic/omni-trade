import { FC, useEffect, useRef } from 'react';

let tvScriptLoadingPromise: Promise<void>;

export const TradingViewWidget: FC = () => {
  const onLoadScriptRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = () => resolve();

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current?.());

    return () => {
      onLoadScriptRef.current = null;
    };
  }, []);

  function createWidget() {
    if (document.getElementById('technical-analysis-chart-demo') && 'TradingView' in window) {
      new window.TradingView.widget({
        container_id: 'technical-analysis-chart-demo',
        width: '100%',
        height: '100%',
        autosize: true,
        symbol: 'KUCOIN:XLMUSDT',
        interval: '1',
        timezone: 'exchange',
        theme: 'dark',
        style: '1',
        toolbar_bg: '#f1f3f6',
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        studies: [],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        locale: 'en',
      });
    }
  }

  return (
    <div className='tradingview-widget-container'>
      <div id='technical-analysis-chart-demo' />
    </div>
  );
};
