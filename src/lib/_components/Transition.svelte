<script lang="ts">
    import { slide, fly, fade } from 'svelte/transition'
  
    export let key: string
    // export let meta: string
    export let duration: number = 250
  </script>
  
  {#key key}
    <div
      in:fly={{ duration, delay: duration+25, x:-6 }}
      out:fly={{ duration, x:6 }}>
      <slot />
    </div>
  {/key}
  
  <style>
    div {
      position: relative;
      inset: 0;
    }
  </style>
  