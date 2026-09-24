/**
 * Codelified P1.1 acceptance probe worker (harmless, revertible).
 * Plain JavaScript per the current worker-entrypoint contract.
 */
export default {
    async fetch() {
        return new Response('codelified-p1b8-sample-ok');
    },
};
