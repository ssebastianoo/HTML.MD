<script lang="ts">
    import TurndownService from "turndown";

    const turndownService = new TurndownService();
    turndownService.remove("script");
    turndownService.remove("style");

    let showCopied = $state(false);

    let ais = [
        {
            name: "Claude",
            url: "https://claude.ai/new?q={url}",
        },
        {
            name: "ChatGPT",
            url: "https://chat.openai.com/?q={url}",
        },
        {
            name: "Gemini",
            url: "https://www.google.com/search?udm=50&aep=11&q={url}",
        },
    ];

    let loading = $state(false);
    let error = $state("");

    async function getMarkdown() {
        const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });

        if (!tab.id) {
            throw new Error("No active tab found");
        }

        const response = await browser.tabs.sendMessage(tab.id, {
            type: "GET_PAGE_CONTENT",
        });

        if (response?.html) {
            const content = turndownService.turndown(response.html);
            return `---\ntitle: ${response.title}\n---\n\n${content}`;
        } else {
            throw new Error("Could not get page content");
        }
    }

    async function open(url: string) {
        loading = true;
        error = "";

        let markdown: string;
        try {
            markdown = await getMarkdown();
        } catch (e) {
            error = `Error: ${e instanceof Error ? e.message : "Unknown error"}`;
            return;
        }

        const formattedURL = url.replaceAll(
            "{url}",
            encodeURIComponent(markdown),
        );
        await browser.tabs.create({ url: formattedURL });
        window.close();
        loading = false;
    }

    async function copyToClipboard() {
        loading = true;
        try {
            const markdown = await getMarkdown();
            navigator.clipboard.writeText(markdown);
        } catch (e) {
            error = `Error: ${e instanceof Error ? e.message : "Unknown error"}`;
        } finally {
            loading = false;
            showCopied = true;
            setTimeout(() => {
                showCopied = false;
            }, 1000);
        }
    }
</script>

<main>
    <div>
        <h1>HTML.MD</h1>
        <div class="ais">
            <button onclick={copyToClipboard}
                >{showCopied ? "Copied!" : "Copy"}</button
            >
        </div>
        <p class="subtext">or send to</p>
        <div class="ais">
            {#each ais as ai (ai.url)}
                <button onclick={() => open(ai.url)} disabled={loading}>
                    {ai.name}
                </button>
            {/each}
        </div>

        {#if error}
            <div class="error">
                {error}
            </div>
        {/if}
    </div>
</main>

<style>
    main {
        padding: 10px;
        min-width: 200px;
    }

    h1 {
        font-size: 23px;
        margin-bottom: 10px;
    }

    .subtext {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 15px;
        text-align: center;
    }

    .ais {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }

    button {
        all: unset;
        text-align: center;
        padding: 7px 10px;
        cursor: pointer;
        border-radius: 10px;
        border: 1px solid #525252;
        background-color: #0a0a0a;
        color: var(--foreground);
    }

    button:hover {
        border-color: #737373;
    }

    .error {
        margin-top: 10px;
    }
</style>
