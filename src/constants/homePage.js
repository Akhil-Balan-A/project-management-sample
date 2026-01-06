 const homePage = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quiet Quotes</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background-color: #000;
      color: #f5f5f5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      max-width: 700px;
      padding: 40px;
      text-align: center;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 30px;
      letter-spacing: 1px;
    }

    .quote {
      font-size: 1.2rem;
      margin-bottom: 24px;
      line-height: 1.6;
      opacity: 0.9;
    }

    .author {
      display: block;
      margin-top: 6px;
      font-size: 0.9rem;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <a href="/instagram">instagram</a>
  <div class="container">
    <h1>Midnight Thoughts</h1>

    <div class="quote">
      “Silence is not empty. It’s full of answers.”
      <span class="author">— Unknown</span>
    </div>

    <div class="quote">
      “Most people don’t want the truth. They want comfort.”
      <span class="author">— Somewhere between honesty and pain</span>
    </div>

    <div class="quote">
      “You grow the moment you stop explaining yourself.”
      <span class="author">— Unsaid wisdom</span>
    </div>

    <div class="quote">
      “Not everything that weighs heavy is visible.”
      <span class="author">— Late-night realization</span>
    </div>
  </div>
</body>
</html>


`

export default homePage;
