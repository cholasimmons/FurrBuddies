<script lang="ts">
	import { goto } from "$app/navigation";
	import { state } from "$lib/store";

</script>

<!-- This will be the page that displays the logged in User's account details -->
<main>
    <h3 class="title text-center">{$state.account?.name || 'Welcome Guest'}</h3>

    <hr>
    
    <div class="mt-5 flex justify-evenly">
        <button on:click={()=>goto('/auth/login')} class="text-success-400 btn variant-ghost-success">Log In</button>
        <button on:click={()=>goto('/auth/register')} class="text-primary-400 btn variant-ghost-warning">Sign Up</button>
        <button on:click={()=>goto('/auth/logout')} class="text-red-400 btn variant-ghost-error">Log Out</button>
    </div>
    
</main>