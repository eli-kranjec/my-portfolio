<script>
    import projects from '$lib/projects.json';
    import Pie from '$lib/Pie.svelte';
    let pieData = [
	{ value: 1, label: "apples" },
	{ value: 2, label: "oranges" },
	{ value: 3, label: "mangos" },
	{ value: 4, label: "pears" },
	{ value: 5, label: "limes" },
	{ value: 5, label: "cherries" }
    ];

</script>
<svelte:head>
    <title>Projects Page</title>
</svelte:head>
<body>
<h1> {projects.length} So Far</h1>
    <Pie data={pieData} />
    <div class="projects">
        {#each projects as p}
            <article>
                <h2>{p.title}</h2>
                <img src= {p.image} alt="">
                <p>{p.description}</p>
            </article>
        {/each}
        <!-- <article>
            <h2>Magni necessitatibus itaque animi.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>A quas, modi expedita recusandae eaque dolores ullam facilis illum amet vel officiis dolorum. Alias praesentium sit non sint cumque iusto totam temporibus saepe iste magnam, officia quis! Delectus, quibusdam.</p>
        </article>
        <article>
            <h2>Animi praesentium veniam ad.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Sint molestias odit error qui quasi expedita beatae excepturi inventore officiis esse, similique perspiciatis ratione voluptatibus, libero id aliquid eaque mollitia aut, pariatur natus voluptate nostrum repellat. Labore, non perspiciatis.</p>
        </article>
        <article>
            <h2>Harum laboriosam aut debitis.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Excepturi et velit dicta, consequatur aperiam nobis corporis culpa voluptates minima deleniti sit mollitia sunt cumque laudantium laborum, possimus expedita atque molestias labore tempora? Cupiditate aliquam doloribus totam dolore libero?</p>
        </article>
        <article>
            <h2>Veniam minima porro eius?</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Vitae, rem. Eveniet aliquam dolore unde, laborum assumenda ipsum fugiat quam veniam ratione ex expedita corrupti ipsam magnam ab voluptatem non, aut omnis voluptatum a optio? Eius corrupti veritatis architecto?</p>
        </article>
        <article>
            <h2>Doloribus maiores eligendi inventore.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Quisquam ut ex enim culpa fugiat, rerum, tempora corrupti, consequuntur sapiente laboriosam a. Eligendi cumque, architecto vel nemo quo distinctio officiis, nostrum optio adipisci quae consectetur veniam porro fugiat. Dolore.</p>
        </article>
        <article>
            <h2>Esse animi doloremque eligendi!</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Animi, nulla voluptates sint veritatis tempore, earum, incidunt quia dolor eaque officiis optio voluptate quidem adipisci molestias tempora distinctio unde sequi consequatur consequuntur blanditiis quam. Soluta deserunt nihil repellat nulla!</p>
        </article>
        <article>
            <h2>Dolore error exercitationem odit.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Aperiam ut optio maiores eum quod, repudiandae quae? Placeat, dignissimos provident. Libero, corporis modi optio est cupiditate commodi minima laboriosam animi nemo quam voluptatibus, accusantium minus veniam, eum perferendis sequi.</p>
        </article>
        <article>
            <h2>Harum perferendis libero qui?</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Quibusdam alias dolores, harum laudantium tempore consequatur ullam beatae. Blanditiis suscipit incidunt mollitia culpa, deserunt laudantium voluptates libero eos vel, animi expedita error dolor quidem eveniet nostrum ea fuga nisi!</p>
        </article>
        <article>
            <h2>Magnam nihil deserunt aspernatur?</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Ad repellendus voluptatem laborum est odit vel delectus eveniet consectetur voluptates maxime veritatis fugit, blanditiis architecto? Reiciendis voluptates rerum commodi, magni dolorum quam nisi doloribus quidem, esse, doloremque quia aut.</p>
        </article>
        <article>
            <h2>Error quaerat impedit aspernatur.</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Nostrum rem ipsum repellendus vero voluptate voluptatum ut dolor delectus omnis beatae reiciendis illo, quidem accusantium dolores, eligendi tempora quibusdam placeat officiis cum odio quae, deserunt ipsa consequatur! Error, aliquam.</p>
        </article>
        <article>
            <h2>Tempora ex fugit repudiandae!</h2>
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="">
            <p>Saepe dignissimos a accusantium quaerat nobis in cum tenetur magni nemo provident impedit esse sapiente, deleniti sequi maiores culpa eos corporis sint quis exercitationem laboriosam quasi consectetur aperiam. Cupiditate, eligendi.</p>
        </article> -->
    </div>
</body>