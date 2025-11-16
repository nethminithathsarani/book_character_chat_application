import '../styles/Header.css';

function Header() {
  return (
    <div className="home-header">
      <div className="header-content">
        <h1 className="title">
          <img src="/src/assets/book-logo.png" alt="Book" className="book-logo" />
          Storybook Chat
        </h1>
        <p className="subtitle">Chat with your favorite book characters!</p>
      </div>
    </div>
  );
}

export default Header;