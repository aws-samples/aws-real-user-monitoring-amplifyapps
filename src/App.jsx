import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo-box">
          <img src={"architecture.jpg"} className="App-logo" alt="logo" />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://eu-west-1.console.aws.amazon.com/cloudwatch/home"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check your application metrics on the CloudWatch RUM console (you
          might have to switch AWS Region)
        </a>
        <p>
          To learn more about Amazon CloudWatch RUM and AWS Amplify, refer to
          the documentations{" "}
          <a
            className="App-link"
            href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          and{" "}
          <a
            className="App-link"
            href="https://docs.amplify.aws/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </header>
    </div>
  );
}

export default App;
