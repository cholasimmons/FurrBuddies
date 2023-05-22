<script lang="ts">
	import { page } from "$app/stores";

    
</script>

<main>
    <div class="mt-[2rem] flex items-center justify-center text-xl text-center">
        <span class="font-light">Error {$page.status}&nbsp;|</span>&nbsp;{$page.error?.message}
    </div>
    
</main>