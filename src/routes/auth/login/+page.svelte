<script lang="ts">
	import { goto } from "$app/navigation";
	import LoadingCircle from "$lib/_components/icons/Loading_Circle.svelte";
    import { state } from "$lib/store";
	import { toastStore, type ToastSettings } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";

    let email: string, password: string = "";

    onMount(async ()=>{
        try {
            await state.checkLoggedIn();
            toastStore.trigger(tru);
            // state.alert({ color: 'green', message: 'You are already signed in'});
            goto('/');
        } catch (error:any) {
            state.alert({ color: 'red', message: error.message });
            console.warn(error.message);
            
        }
        
    });

    const tru: ToastSettings = {
            message: $state.alert?.message || 'You are already signed in '+$state.account?.name||'.',
            background: 'variant-filled-success', timeout: 2500,
            action: {
                label: 'Sign Out?',
                response: async () => {await state.logout(); goto('/auth/login')}
            }
    };

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

<main>
    <section class="container h-screen flex">
        <div class="flex-grow flex flex-col max-w-xl justify-center p-6">
            <h2 class="text-4xl font-light">Login</h2>
            <p class="mt-6">
                Don't have an account ?
                <span class="cursor-pointer underline">
                    <a href="/auth/register"> Sign Up </a>
                </span>
            </p>
            <form on:submit|preventDefault={login}>
                <label class="block mt-6" for="email"> Email</label>
                <input
                    id="email"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="email"
                    bind:value={email}
                />
                <label class="block mt-6" for="password"> Password</label>
                <input
                    id="password"
                    class="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
                    type="password"
                    bind:value={password}
                />
    
                <div class="mt-6">
                    <button
                        disabled={!checkForm || !$state._loading}
                        type="submit"
                        class="mx-auto mt-4 py-4 px-16 font-light btn rounded-lg text-white hover:text-gray-900 bg-gray-700 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                        {$state._loading ? 'Loading...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    </section>
</main>

