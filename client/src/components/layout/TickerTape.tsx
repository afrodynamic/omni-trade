import { useEffect } from 'react';

export const TickerTape = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500"
          },
          {
            "proName": "FOREXCOM:NSXUSD",
            "title": "US 100"
          },
          {
            "description": "VIX",
            "proName": "PEPPERSTONE:VIX"
          },
          {
            "description": "DXY",
            "proName": "CAPITALCOM:DXY"
          },
          {
            "description": "Bitcoin",
            "proName": "KUCOIN:BTCUSDT"
          },
          {
            "description": "Ethereum",
            "proName": "KUCOIN:ETHUSDT"
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": false,
        "displayMode": "adaptive",
        "locale": "en"
      }
    `;

    const tradingviewWidgetScript = document.getElementById('tradingview-widget-script');
    tradingviewWidgetScript?.appendChild(script);

    return () => {
      tradingviewWidgetScript?.removeChild(script);
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div id="tradingview-widget-script"></div>
    </div>
  );
};
