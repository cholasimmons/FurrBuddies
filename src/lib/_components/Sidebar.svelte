<script lang="ts">
	import { page } from "$app/stores";
	import { state } from "$lib/_stores/auth_store";
    import "iconify-icon";

</script>

<ul>
    <a href="/" class="{$page.url.pathname === '/' ? 'chosen' : ''} order-3 md:order-none">
        <li><iconify-icon icon="mdi:home" class="home"></iconify-icon><span>Home</span></li>
    </a>
    <a href="/pets" class="{$page.url.pathname.startsWith('/pets') ? 'chosen' : ''} order-1 md:order-none"><li><iconify-icon icon="mdi:paw"></iconify-icon>Buddies</li></a>
    <a href="/clinics" class="{$page.url.pathname.startsWith('/clinics') ? 'chosen' : ''} order-2 md:order-none"><li><iconify-icon icon="tabler:building-hospital"></iconify-icon>Clinics</li></a>
    <!--a href="/shop" class="xl:hidden {$page.url.pathname.startsWith('/shop') ? 'chosen' : ''} hidden md:block"><li><iconify-icon icon="tabler:shopping-cart"></iconify-icon>Shop</li></a-->
    <a href="/mail" class="{$page.url.pathname.startsWith('/mail') ? 'chosen' : ''} order-4 md:order-none"><li><iconify-icon icon="mdi:mail"></iconify-icon>Mail</li></a>
    <!--a href="/setup" class="{$page.url.pathname.startsWith('/setup') ? 'chosen' : ''} order-5 md:order-none"><li><iconify-icon icon="mdi:cog"></iconify-icon>Setup</li></a-->
    <a href="/user/profile" class="{$page.url.pathname === '/user/profile' ? 'chosen dark:text-primary-400' : ''} order-5 md:order-none"><li><iconify-icon icon="mdi:user"></iconify-icon>Account</li></a>
    <div class="hidden md:block">
        <hr class="mx-auto ">
        <!-- If User isn't logged in -->
        <span hidden={ !$state.account}>
            <!--a href="/user/profile" class="{$page.url.pathname === '/user/profile' ? 'chosen dark:text-primary-400' : ''}"><li>Account</li></a>
            <a href="/auth/logout" class="{$page.url.pathname === '/auth/logout' ? 'chosen dark:text-primary-500' : ''}"><li>Sign Out</li></a-->
        </span>

        <!-- If User is successfully logged in -->
        <span hidden={ $state.account !== null }>
            <a href="/auth/login" class="{$page.url.pathname === '/auth/login' ? 'chosen' : ''}"><li>Log In</li></a>
            <a href="/auth/register" class="{$page.url.pathname === '/auth/register' ? 'chosen' : ''}"><li>Sign Up</li></a>
        </span>

        <!-- Always show this regardless... -->
        <span>
            <a href="/about" class="{$page.url.pathname === '/about' ? 'chosen' : ''}"><li>About</li></a>
        </span>
    </div>
    
</ul>

<style>
    ul a.chosen li, ul a.chosen li iconify-icon {
        /*background-color: rgba(128, 128, 128,0.55);*/
        /* border-right: 4px solid rgb(255, 220, 48); */
        /* @apply text-white dark:text-yellow-500; */
        opacity: 1;
        font-weight: 400;
    }

    /* Small screens only */
    @media (max-width: 768px) {
        ul {
            font-size: 0.9rem;
            margin: 0;
            padding: 1rem 1.6rem 0.5rem 1.6rem;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content:space-between
        }
        ul a li {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            font-weight: 300;
            transition: transform 0.3s ease;
            opacity: 0.45;
            row-gap: 2px;
        }

        ul a:hover li {
            opacity: 1;
        }
        ul a li iconify-icon {
            font-size: 1.8rem;
            transition: transform 0.3s ease;
        }
        ul a:hover li iconify-icon {
            transform: translateY(-6px);
        }
    }

    /* Larger screens */
    @media (min-width: 769px) {
        ul a:hover li, ul button:hover li {
            transform: translateX(8px);
            opacity: 1;
        }
        /* Just the icon */
        ul a:hover li iconify-icon {
            transform: translateX(-8px);
            opacity: 1;
        }

        ul a li {
            opacity: 0.6;
        }

        ul a li iconify-icon {
            opacity: 0.6;
            font-size: 1.2rem;
            margin-right: 1rem;
            transition: opacity 0.5s ease;
            transition: transform 0.3s ease;
        }
        ul a li, ul button li {
            display: flex;
            align-items: center;
            font-size: 1rem;
            font-weight: 400;
            padding: 1rem 1.2rem;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            flex-grow: 1;
            transition: opacity 0.5s ease;
            transition: transform 0.3s ease;
        }
    }
</style>