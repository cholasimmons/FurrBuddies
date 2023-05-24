<script lang="ts">
	import { state } from "$lib/store";


</script>
<main>
    <h3 class="title">{$state.account?.name || 'Welcome Guest'}</h3>

    <hr>
    
    <div class="mt-5 flex justify-evenly">
        <p><a href="auth/login">Log In</a></p>
        <p><a href="auth/register">Sign Up</a></p>
    </div>
    
</main>