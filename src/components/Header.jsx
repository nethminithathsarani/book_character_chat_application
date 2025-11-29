import '../styles/Header.css';

function Header() {
  return (
    <div className="home-header" role="banner" aria-label="Storybook Chat header">
      <div className="header-ornament header-ornament-left" aria-hidden="true"></div>
      <div className="header-ornament header-ornament-right" aria-hidden="true"></div>
      <div className="header-content">
        <div className="title-wrapper">
          <span className="golden-seal" aria-hidden="true"></span>
          <h1 className="title">
            <span className="book-emoji" aria-hidden="true">📚</span>
            Storybook Chat
          </h1>
        </div>
        <p className="subtitle">Chat with your favorite book characters!</p>
      </div>
      <div className="scroll-shadow" aria-hidden="true"></div>
    </div>
  );
}

export default Header;
