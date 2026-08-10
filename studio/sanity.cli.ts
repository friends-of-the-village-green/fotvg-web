import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'nd22vlzw',
    dataset: 'production'
  },
  deployment: {
    /**
     * The deployed Studio at https://fotvg.sanity.studio
     *
     * Issued by Sanity on the first `sanity deploy`. Recording it here stops
     * the CLI asking which application to deploy to every time, and — more
     * usefully — is what allows pinning a Studio version rather than always
     * tracking the latest channel.
     *
     * Not a secret. It identifies the deployed app, it does not authorize
     * anything; deploying still requires being logged in as a project member.
     */
    appId: 'llg85ofl96ybrc4e2d0yr0lj',

    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
