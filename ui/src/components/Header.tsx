import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="brand">
            <h1>ShadowAPR</h1>
            <p>Stake confidentially. Earn cZAMA effortlessly.</p>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </header>
  );
}
