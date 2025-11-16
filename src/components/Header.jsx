import '../styles/Header.css';

function Header() {
  return (
    <div className="home-header">
      <div className="header-content">
        <h1 className="title">
          <span className="book-emoji">📚</span>
          Storybook Chat
        </h1>
        <p className="subtitle">Chat with your favorite book characters!</p>
      </div>
    </div>
  );
}

export default Header;
