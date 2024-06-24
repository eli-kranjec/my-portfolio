<svelte:head>
    <title>Home Page</title>
</svelte:head>
<script>
    import projects from '$lib/projects.json';

    let profileData = fetch("https://api.github.com/users/TardiCoder");

</script>
<body>
    <h1>
        
        <!--<nav class="home_page">
            <a href="https://tardicoder.github.io/portfolio">Main Page</a>
            <a href="https://tardicoder.github.io/portfolio/contact">Contact</a>
            <a href="https://tardicoder.github.io/portfolio/projects">Projects</a>
            <a href="https://github.com/TardiCoder"  target="_blank">Profile Page</a>
        </nav> -->
        Eli Kranjec</h1>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est sapiente quis reprehenderit, ullam odit praesentium qui ab unde consequatur autem pariatur. Omnis dolores tenetur quaerat nulla autem quis distinctio. Facere?</p>
    <img src ="images/download.jpg" alt="Picture of me">
    <h1>Latest Projects </h1>
    
    <div class = "projects">
        {#each projects.slice(0,3) as p}
            <article>
                <h2>{p.title}</h2>
                <img src= {p.image} alt="">
                <p>{p.description}</p>
            </article>
        
        {/each}
    </div>

        {#await fetch("https://api.github.com/users/TardiCoder") }
            <p>Loading...</p>
        {:then response}
        {#await response.json()}
                <p>Decoding...</p>
        {:then data}
            <h2>Github Stats</h2>
            <dl>
                <li>Followers = {data.followers}</li>
                <li>Public Repos = {data.public_repos}</li>
            </dl>
            
        {:catch error}
            <p class="error">
                Something went wrong: {error.message}
            </p>
        {/await}
        {:catch error}
            <p class="error">
                Something went wrong: {error.message}
            </p>
        {/await}
</body>