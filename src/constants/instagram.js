const instagram = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-size: 2rem;
    }
  </style>

  <script>
    setTimeout(() => {
      window.location.href = "https://www.instagram.com";
    }, 3000); // 3000 ms = 3 seconds
  </script>
</head>
<body>
  Welcome to Instagram
</body>
</html>


`


export default instagram;