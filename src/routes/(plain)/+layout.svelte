<script lang="ts">
   // Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css'

   // This contains the bulk of Skeletons required styles:
   // NOTE: this will be renamed skeleton.css in the v2.x release.
   import '@skeletonlabs/skeleton/styles/skeleton.css';

   // Finally, your application's global stylesheet (sometimes labeled 'app.css')
   import '../../global.postcss';
   
   export const ssr = false;
</script>


<main class="h-full w-full bg-gradient-to-tr from-red-300 to-pink-100 dark:from-purple-950 dark:to-pink-800 text-slate-800">
   <slot/>
</main>


<style>
   * {
      user-select: none;
   }
</style>