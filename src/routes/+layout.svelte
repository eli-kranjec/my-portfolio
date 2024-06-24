      
    <script>
        import { page } from '$app/stores';  
        export let pages  = [
            {url: "./", title: "Home Page"},
            {url: "./projects", title: "Projects Page"},
            {url: "./contact", title: "Contact Me"},
            {url: "https://github.com/TardiCoder/", title: "Github Page"}

        ];


        

    </script>
    <style>
        a:hover{

            background-color: color-mix(in oklch, pink, canvas 85%);
            border-bottom-color: darkmagenta;
            border-bottom-width: 6px;
        }

        a{

            flex: 1;
            text-decoration: none;
            color: inherit;
            text-align: center;
            padding: 0.5em;

            border-bottom-width: 2px;
            border-bottom-style: solid;
            border-bottom-color: oklch(50% 10% 200 / 40%);
            padding-bottom: 10px;
            font-size: 2em;

        }

        nav{

            margin-bottom: 50px;
            font-weight: bold;  
            max-width: 100%;

        }

        .current{

            border-bottom-width: 5px;
            

        }   

    </style>
    <nav>
            
            {#each pages as p}
                <a href = {p.url} class:current={ "." + $page.route.id === p.url }  target = { p.url.startsWith("http") ? "_blank" : null } > {p.title} </a>
            {/each}
    </nav>
    <slot></slot>