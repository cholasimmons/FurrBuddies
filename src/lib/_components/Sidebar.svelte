<script lang="ts">
	import { page } from "$app/stores";
	import { state } from "$lib/store";
    import "iconify-icon";

</script>

<ul class="flex items-start md:flex-col justify-evenly">
    <a href="/" class="{$page.url.pathname === '/' ? 'chosen' : ''} order-3 md:order-none">
        <li><iconify-icon icon="mdi:home" class="home"></iconify-icon><span>Home</span></li>
    </a>
    <a href="/pets" class="{$page.url.pathname.startsWith('/pets') ? 'chosen' : ''} order-1 md:order-none"><li><iconify-icon icon="mdi:paw"></iconify-icon>Buddies</li></a>
    <a href="/clinics" class="{$page.url.pathname.startsWith('/clinics') ? 'chosen' : ''} order-2 md:order-none"><li><iconify-icon icon="tabler:building-hospital"></iconify-icon>Clinics</li></a>
    <a href="/shop" class="xl:hidden {$page.url.pathname.startsWith('/shop') ? 'chosen' : ''} hidden md:block"><li><iconify-icon icon="tabler:shopping-cart"></iconify-icon>Shop</li></a>
    <a href="/mail" class="{$page.url.pathname.startsWith('/mail') ? 'chosen' : ''} order-4 md:order-none"><li><iconify-icon icon="mdi:mail"></iconify-icon>Mail</li></a>
    <a href="/setup" class="{$page.url.pathname.startsWith('/setup') ? 'chosen' : ''} order-5 md:order-none"><li><iconify-icon icon="mdi:cog"></iconify-icon>Setup</li></a>
    <div class="hidden md:block">
        <hr class="mx-auto text-primary-500">
        <span hidden="{ !$state.account?.$id}">
            <a href="/user/profile" class="{$page.url.pathname === '/user/profile' ? 'chosen' : ''}"><li>Account</li></a>
            <a href="/auth/logout" class="{$page.url.pathname === '/auth/logout' ? 'chosen' : ''}"><li>Sign Out</li></a>
        </span>
        <span hidden="{ $state.account?.$id !== (null||undefined)}">
            <a href="/auth/login" class="{$page.url.pathname === '/auth/login' ? 'chosen' : ''}"><li>Log In</li></a>
            <a href="/auth/register" class="{$page.url.pathname === '/auth/register' ? 'chosen' : ''}"><li>Sign Up</li></a>
        </span>
    </div>
    
</ul>

<style>
    ul {
        margin-top: 0;
    }
    ul a li, ul button li {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        padding: 1rem 1.2rem;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        flex-grow: 1;
    }
    ul a.chosen li, ul a.chosen li iconify-icon {
        /*background-color: rgba(128, 128, 128,0.55);*/
        /* border-right: 4px solid rgb(255, 220, 48); */
        color: #ffdc30;
        opacity: 1;
        font-weight: 500;
    }


    /* Small screens only */
    @media (max-width: 768px) {
        ul a:hover li iconify-icon {
            transform: translateY(-6px);
            color: white
        }
        ul a:hover li {
            color: white;
            opacity: 1;
        }

        ul a li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: 300;
            transition: transform 0.3s ease;
            color: white;
            opacity: 0.6;
        }

        ul a li iconify-icon {
            font-size: 1.6rem;
            transition: transform 0.3s ease;
        }
    }

    /* Larger screens */
    @media (min-width: 769px) {
        ul a:hover li, ul button:hover li {
            transform: translateX(8px);
            color: white;
            opacity: 1;
        }
        ul a:hover li iconify-icon {
            transform: translateX(-8px);
            color: white;
            opacity: 1;
        }

        ul a li iconify-icon {
            margin-right: 1rem;
        }

        ul a li, ul a li iconify-icon {
            color: white;
            opacity: 0.6;
            font-size: 1rem;
            transition: opacity 0.5s ease;
            transition: transform 0.3s ease;
        }
    }
</style>