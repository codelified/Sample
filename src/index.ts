/**
 * Codelified P1 acceptance probe worker (harmless, revertible).
 * Added by the P1.13 controlled Sample E2E to exercise the unified
 * build → dispatch → verify → activate path on staging. Safe to revert.
 */
export default {
    async fetch(): Promise<Response> {
        return new Response('codelified-p1-sample-ok');
    },
};
