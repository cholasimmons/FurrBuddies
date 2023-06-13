<script lang="ts">
    import { slide, fly, fade } from 'svelte/transition'
  
    export let key: string
    // export let meta: string
    export let duration: number = 350
  </script>
  
  {#key key}
    <div
      in:fly={{ duration, delay: duration+50, y:-4 }}
      out:fly={{ duration, y:4 }}>
      <slot />
    </div>
  {/key}
  
  <style>
    div {
      position: relative;
      inset: 0;
    }
  </style>
  