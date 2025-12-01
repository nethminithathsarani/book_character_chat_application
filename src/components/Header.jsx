import '../styles/Header.css';

function Header() {
  return (
    <div className="home-header" role="banner" aria-label="Storybook Chat header">
      <div className="header-ornament header-ornament-left" aria-hidden="true"></div>
      <div className="header-ornament header-ornament-right" aria-hidden="true"></div>
      <div className="header-content">
        <div className="title-wrapper">
          <img
            src={new URL('../assets/Aedora.png', import.meta.url).href}
            alt="Aedora logo"
            className="aedora-logo"
          />
          <div className="title-text">
            <h1 className="title">Aedora</h1>
            <p className="subtitle">Chat with your favorite book characters!</p>
          </div>
        </div>
      </div>
      <div className="scroll-shadow" aria-hidden="true"></div>
    </div>
  );
}

export default Header;
