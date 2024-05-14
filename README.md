# Furr Buddies

[Appwrite](https://appwrite.io) [Hashnode](https://hashnode.com) Hackathon entry, powered by [`SvelteKit`](https://kit.svelte.dev/).

## About this App

Furr Buddies is a fully responsive cross-platform web app that focuses on the wellbeing of Pets. It helps Pet Owners manage their Dogs, Cats, Birds, and any other domestic animals they may own.

Before registering for a free account, Users have the ability to browse around the app and view certain information such as what Clinics or Playzones are available.

Upon creating a new account and signing in, User's can search for available Veterinarians (Clinics) in their area and browse their business page for contact details, location, working hours and other useful data.

Once at the Clinic (physically), the Vet can scan a Pet's ID from the Pet Owner's phone and have temporal access to update that pet's vaccination information, health data, e.tc...

### Additionally

Furr Buddies will also offer a marketplace for Vendors to sell any Pet-related products right from the Furr Buddies platform. We call it... `Shop`. 😎

#
## Technologies

`Furr Buddies` is powered by [`SvelteKit`](https://kit.svelte.dev), the web framework used as the foundation of this project.

[`Appwrite`](https://appwrite.io), the outstanding BaaS that made this such a breeze to achieve.

[`SkeletonUI`](https://skeleton.dev) hands down the best and most sensible UI framework for this stack.

Other necessary mentions here are [svelte-forms](https://chainlist.github.io/svelte-forms/), [svelte-french-toast](https://svelte-french-toast.com/) and the most obvious ofcourse... `Microsoft` for Windows, Terminal, and VScode, lol 😂.

## Installing

Clone this repo to your local workstation `https://github.com/cholasimmons/FurrBuddies.git` an install it's dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm dev
```

# or start the server and open the app in a new browser tab
```bash
pnpm dev --open

# starts the server on your local network for testing on other devices on the same network such as a mobile phone/tablet
pnpm dev --host
```
Note that the app relies on a working instance of Appwrite. Required values can be found in the `src/lib/appwrite.ts` file.

## Building

To create a production version of the app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

### Note:
To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment. Currently this project uses [adapter-static](https://www.npmjs.com/package/@sveltejs/adapter-static) so it can run on a regular web server, while Appwrite handles the backend.