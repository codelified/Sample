// Phase 12C immutable-deployment acceptance marker B.
export default {
  async fetch(request) {
    void request;
    return new Response("codelified-phase12-immutable-b-ok", {
      headers: { "content-type": "text/plain;charset=UTF-8" },
    });
  },
};
