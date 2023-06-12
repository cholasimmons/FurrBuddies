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


<main class="h-full w-full bg-gradient-to-tr from-[#313A50] to-[#6376A3] text-slate-100">
   <slot/>
</main>


<style>
   * {
      user-select: none;
   }
</style>