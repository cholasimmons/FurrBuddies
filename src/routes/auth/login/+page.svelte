<script lang="ts">
	import { goto } from "$app/navigation";
    import { state } from "$lib/store";

    export let data;
    let email: string, password: string = "";

    const login = async () => {
        if (!checkForm) {
            return;
        }
        try {
            await state.login(email, password);
            goto("/");
        } catch (error: any) {
            state.alert({ color: "red", message: error.message });
        }
    };

    $: checkForm = email !== "" && password !== "";
</script>

<svelte:head>
	<title>{data.appName} | Login</title>
	<meta name="description" content="{data.appName} authenticated login" />
</svelte:head>

<main>
    <h3 class="title text-center">Login</h3>
    <p class="mt-0 text-center">
        Don't have an account yet?
        <span class="text-primary-500">
            <a href="/auth/register"> Sign Up </a>
        </span>
    </p>

    <section class="container flex">
        <div class="flex-grow flex flex-col max-w-xl justify-center">
            
            
            <form on:submit|preventDefault={login}>
                <label class="block mt-6" for="email"> Email</label>
                <input
                    id="email"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="email"
                    bind:value="{email}"
                />
                <label class="block mt-6" for="password"> Password</label>
                <input
                    id="password"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="password"
                    bind:value="{password}"
                />
    
                <div class="mt-6 flex justify-center">
                    <button
                        disabled="{!checkForm || $state._loading}"
                        type="submit"
                        class="mx-auto mt-4 py-4 px-16 font-light btn variant-filled rounded-lg text-white hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                        {$state._loading ? 'Loading...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>

<style>
    * {
        outline: none
    }
    form input {
        border-radius: 0.6rem;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 1.2rem;
    }
    form label {
        opacity: 0.75
    }
</style>