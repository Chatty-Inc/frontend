# Frontend v0.3

> Iteration 3 of the Chatty frontend. Currently a skeleton React 
> web app with mock views for development. Implements v0.3 of the
> Chatty communication protocol.

Well, I was getting good at this after 3 rewrites, and this is the best
version of the chatty architecture yet. Obviously, there might've been
some overlooked security flaws, so don't count on this for anything
top-secret (other than the fact that it isn't operational at all). Code
is mainly maintainable, but largely incomplete. Requires an actual [NodeJS
server](https://github.com/Chatty-Inc/backend) which also handles authentication
in addition to message relaying.

This repo currently contains client-side E2EE WebCrypto code, WebSocket
(re)connection logic, and code for the frontend chat UI.

## The "Chatty Protocol"
Version 0.3 of the protocol is implemented in this codebase, which
fixes many of the flaws of previous iterations of the protocol. Shares
no common code with implementations of older generations of the protocol,
so bugs aren't carried forward.
