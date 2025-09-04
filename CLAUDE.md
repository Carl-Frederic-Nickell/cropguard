- solve one issue on getreidekarte: Recoverable Error

Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <HTTPAccessFallbackErrorBoundary pathname="/dashboard..." notFound={<SegmentViewNode>} forbidden={undefined} ...>
      <RedirectBoundary>
        <RedirectErrorBoundary router={{...}}>
          <InnerLayoutRouter url="/dashboard..." tree={[...]} cacheNode={{lazyData:null, ...}} segmentPath={[...]}>
            <SegmentViewNode type="layout" pagePath="dashboard/...">
              <SegmentTrieNode>
              <script>
              <script>
              <ClientSegmentRoot Component={function DashboardLayout} slots={{...}} params={{}}>
                <DashboardLayout params={Promise}>
                  <div className="min-h-scre...">
                    <nav className="bg-green-8...">
                      <div className="max-w-7xl ...">
                        <div className="flex justi...">
                          <div className="flex items...">
                            <div className="flex items...">
                              <Tractor>
                              <span className="text-xl font-bold">
+                               CropGuard
-                               Agrar Dashboard
                            ...
                          ...
                    ...
          ...
Call Stack
13
throwOnHydrationMismatch
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (2892:61)
prepareToHydrateHostInstance
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (2946:47)
completeWork
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (6330:88)
runWithFiberInDEV
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (886:139)
completeUnitOfWork
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (8363:40)
performUnitOfWork
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (8300:46)
workLoopConcurrentByScheduler
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (8294:75)
renderRootConcurrent
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (8276:100)
performWorkOnRoot
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (7908:196)
performWorkOnRootViaSchedulerTask
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js (8882:26)
performWorkUntilDeadline
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/node_modules_next_dist_compiled_5150ccfd._.js (2601:72)
span
unknown (0:0)
DashboardLayout
file:///Users/carl/Documents/11.%20IT,%20Security/03_Education/CloudHelden/12%20Projekte/agrar-dashboard/frontend/.next/static/chunks/_cec14939._.js (40:247)