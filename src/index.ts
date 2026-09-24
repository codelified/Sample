/**
 * Codelified P1 acceptance probe worker (harmless, revertible).
 * Added by the P1.13 controlled Sample E2E to exercise the unified
 * build → dispatch → verify → activate path on staging. Safe to revert.
 *
 * Plain JavaScript only: the unified adapter path ships the entry module
 * verbatim (no TypeScript transpilation yet — see P1 gate notes).
 */
export default {
    async fetch() {
        return new Response('codelified-p1-sample-ok');
    },
};
