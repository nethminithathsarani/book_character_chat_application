import '../styles/Header.css';

function Header() {
  return (
    <div className="home-header">
      <div className="header-ornament-left"></div>
      <div className="header-ornament-right"></div>
      <div className="header-content">
        <div className="title-wrapper">
          <span className="golden-seal"></span>
          <h1 className="title">
            <span className="book-emoji">📚</span>
            Storybook Chat
          </h1>
        </div>
        <p className="subtitle">Chat with your favorite book characters!</p>
      </div>
      <div className="scroll-shadow"></div>
    </div>
  );
}

export default Header;
