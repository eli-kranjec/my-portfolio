<svelte:head>
    <title>Contact Me</title>
</svelte:head>
<body>

    <!--<div class="contact_navbar">
        <nav>
            <a href="https://tardicoder.github.io/portfolio">Main Page</a>
            <a href="https://tardicoder.github.io/portfolio/contact">Contact</a>
            <a href="https://tardicoder.github.io/portfolio/projects">Projects</a>
            <a href="https://github.com/TardiCoder" target="_blank">Profile Page</a>  
        </nav>
    </div>
-->
    <h1>Contact Me:</h1><hr>
    
    <form action="mailto:eli.b.kranjec@gmail.com" method="POST" enctype="text/plain">
        <label>Email: <input type="email" name="Email"/></label><br>
        <label>Subject: <input name="Subject"/></label><br>
        <label>Message:<textarea></textarea></label><br>
        <button type="submit">Submit</button>

    </form>
</body>