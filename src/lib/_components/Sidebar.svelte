<script lang="ts">
	import { page } from "$app/stores";
	import { state } from "$lib/store";
    import "iconify-icon";
	import type { LayoutData, LayoutLoad, PageLoad } from "../../routes/$types";

</script>
<ul>
    <a href="/" class="{$page.url.pathname === '/' ? 'chosen' : ''}"><li><iconify-icon icon="mdi:home"></iconify-icon>Home</li></a>
    <a href="/pets" class="{$page.url.pathname.startsWith('/pets') ? 'chosen' : ''}"><li><iconify-icon icon="mdi:paw"></iconify-icon>Buddies</li></a>
    <a href="/clinics" class="{$page.url.pathname.startsWith('/clinics') ? 'chosen' : ''}"><li><iconify-icon icon="tabler:building-hospital"></iconify-icon>Clinics</li></a>
    <a href="/shop" class="{$page.url.pathname.startsWith('/shop') ? 'chosen' : ''}"><li><iconify-icon icon="tabler:shopping-cart"></iconify-icon>Shop</li></a>
    <a href="/mail" class="{$page.url.pathname.startsWith('/mail') ? 'chosen' : ''}"><li><iconify-icon icon="mdi:mail"></iconify-icon>Mail</li></a>
    <a href="/setup" class="{$page.url.pathname.startsWith('/setup') ? 'chosen' : ''}"><li><iconify-icon icon="mdi:cog"></iconify-icon>Setup</li></a>
    <hr class="w-20 mx-auto text-primary-500">
    <a href="/auth/login"><li>Log In</li></a>
    <a href="/auth/register"><li>Sign Up</li></a>
    <button on:click="{()=>{state.logout()}}"><li>Sign Out</li></button>
</ul>

<style>
    ul a li {
        margin: 8px 0;
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        padding: 1rem 1.2rem;
        border-radius: 8px;
    }
    ul a:hover li {
         /* background-color: rgba(128, 128, 128,0.48); */
         background-color: rgb(255, 220, 48, 0.28);
    }
    ul > a.chosen li {
        /*background-color: rgba(128, 128, 128,0.55);*/
        border-right: 4px solid rgb(255, 220, 48);
        color: rgb(255, 220, 48);
        font-weight: 500;
    }
    iconify-icon {
        margin-right: 1rem;
    }
</style>