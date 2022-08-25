/* @jsx _jsx */
function _jsx(type: string | Function, props: any, children: any) {
  console.log(type, props, children);
  if (typeof type === 'function') {
    return type();
  } else {
    const el = document.createElement(type);
    el.innerHTML = '123';
    return el;
  }
}
import Presence from '@yomo/presence';

const yomo = new Presence('https://prsc.yomo.dev', {
  auth: {
    // Certification Type
    type: 'token',
    // Api for getting access token
    endpoint: '/api/presence-auth',
    publicKey: ''
  },
});

yomo.on('connected', () => {
  console.log('Connected to server: ', yomo.host);
});

export function HugGroup() {
  return <div className="aaa">123</div>;
}

(() => {
  window.addEventListener('load', () => {
    const hugGroupEls: Element[] = Array.from(
      document.getElementsByTagName('hug-group')
    );
    hugGroupEls.forEach(el => {
      const hugGroup = <HugGroup />;
      el.replaceWith(hugGroup as any);
    });
  });
})();

export default HugGroup;
