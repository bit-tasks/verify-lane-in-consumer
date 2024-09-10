import { Button } from '@learnbit-react/design.input.button';
import { H4 } from '@learnbit-react/design.typography.heading';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <H4 style={{ color: 'white' }}>Hello!</H4>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>Learn React</Button>
        </a>
      </header>
    </div>
  );
}

export default App;
