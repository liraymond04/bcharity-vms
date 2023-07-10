if (!self.define) {
  let e,
    s = {}
  const c = (c, a) => (
    (c = new URL(c + '.js', a).href),
    s[c] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = c), (e.onload = s), document.head.appendChild(e)
        } else (e = c), importScripts(c), s()
      }).then(() => {
        let e = s[c]
        if (!e) throw new Error(`Module ${c} didn’t register its module`)
        return e
      })
  )
  self.define = (a, n) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[t]) return
    let i = {}
    const f = (e) => c(e, t),
      r = { module: { uri: t }, exports: i, require: f }
    s[t] = Promise.all(a.map((e) => r[e] || f(e))).then((e) => (n(...e), i))
  }
}
define(['./workbox-5f5b08d6'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/9ppwRIHPwW7PSS9nXvsoA/_buildManifest.js',
          revision: '26adfc5c9330e5efdb88f1894919f212'
        },
        {
          url: '/_next/static/9ppwRIHPwW7PSS9nXvsoA/_middlewareManifest.js',
          revision: 'fb2823d66b3e778e04a3f681d0d2fb19'
        },
        {
          url: '/_next/static/9ppwRIHPwW7PSS9nXvsoA/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933'
        },
        {
          url: '/_next/static/chunks/1070.35309cea829ecb9f.js',
          revision: '35309cea829ecb9f'
        },
        {
          url: '/_next/static/chunks/1070.35309cea829ecb9f.js.map',
          revision: 'de238545461b7fbc8d2a4b1a2cfcf8f8'
        },
        {
          url: '/_next/static/chunks/1491-426b286119a39dc6.js',
          revision: '426b286119a39dc6'
        },
        {
          url: '/_next/static/chunks/1491-426b286119a39dc6.js.map',
          revision: 'aa2bf29f63fa230c92b1e13e47e35fb6'
        },
        {
          url: '/_next/static/chunks/1515.f40a47f8952dcc20.js',
          revision: 'f40a47f8952dcc20'
        },
        {
          url: '/_next/static/chunks/1515.f40a47f8952dcc20.js.map',
          revision: '3476200cc5e85f2d108d4b6cb1a6bb0f'
        },
        {
          url: '/_next/static/chunks/1664-d38a8af1c829d526.js',
          revision: 'd38a8af1c829d526'
        },
        {
          url: '/_next/static/chunks/1664-d38a8af1c829d526.js.map',
          revision: '74068a498e8d1c5f739100999ebaa82b'
        },
        {
          url: '/_next/static/chunks/2131-e2665f2f62a577ef.js',
          revision: 'e2665f2f62a577ef'
        },
        {
          url: '/_next/static/chunks/2131-e2665f2f62a577ef.js.map',
          revision: '45c3f05a25f488d7d390967a59586a96'
        },
        {
          url: '/_next/static/chunks/2337-49eb2bcd3a7df37f.js',
          revision: '49eb2bcd3a7df37f'
        },
        {
          url: '/_next/static/chunks/2337-49eb2bcd3a7df37f.js.map',
          revision: '4b6d911973e9a253ef87f936b9867366'
        },
        {
          url: '/_next/static/chunks/2431.c9273b5f4da3a006.js',
          revision: 'c9273b5f4da3a006'
        },
        {
          url: '/_next/static/chunks/2431.c9273b5f4da3a006.js.map',
          revision: '2d9841762db2c8a9c29b4ea4df92765a'
        },
        {
          url: '/_next/static/chunks/2642-60d75afbcfcca28e.js',
          revision: '60d75afbcfcca28e'
        },
        {
          url: '/_next/static/chunks/2642-60d75afbcfcca28e.js.map',
          revision: 'e633e2b3b7e296b108537222a50b64a6'
        },
        {
          url: '/_next/static/chunks/2677-7bd990ef763f07b4.js',
          revision: '7bd990ef763f07b4'
        },
        {
          url: '/_next/static/chunks/2677-7bd990ef763f07b4.js.map',
          revision: 'd3416334f56a6df94670e1afcd53a7c3'
        },
        {
          url: '/_next/static/chunks/2736.ac678b697f6e7397.js',
          revision: 'ac678b697f6e7397'
        },
        {
          url: '/_next/static/chunks/2736.ac678b697f6e7397.js.map',
          revision: '2ebe602e7a553a6efefec8902d404a12'
        },
        {
          url: '/_next/static/chunks/2883-3ba8b6e094b6a726.js',
          revision: '3ba8b6e094b6a726'
        },
        {
          url: '/_next/static/chunks/2883-3ba8b6e094b6a726.js.map',
          revision: '122b5ae2541287c00ed009e9498650e5'
        },
        {
          url: '/_next/static/chunks/3235.8ca7c601f1b2e896.js',
          revision: '8ca7c601f1b2e896'
        },
        {
          url: '/_next/static/chunks/3235.8ca7c601f1b2e896.js.map',
          revision: '33df1a1ec12e6541fc8adb4a7dd3d8f9'
        },
        {
          url: '/_next/static/chunks/344.bddc1230f828453f.js',
          revision: 'bddc1230f828453f'
        },
        {
          url: '/_next/static/chunks/344.bddc1230f828453f.js.map',
          revision: 'b06ed92e1a13c815ad513f736c7d00c7'
        },
        {
          url: '/_next/static/chunks/3636.44872a9f5890886a.js',
          revision: '44872a9f5890886a'
        },
        {
          url: '/_next/static/chunks/3636.44872a9f5890886a.js.map',
          revision: 'd3dc6fb63d0e3a82de56fc0bedb6a9c4'
        },
        {
          url: '/_next/static/chunks/3906.b2184c2807e18c55.js',
          revision: 'b2184c2807e18c55'
        },
        {
          url: '/_next/static/chunks/3906.b2184c2807e18c55.js.map',
          revision: '69fb2da28261bba9c6f74b4ca6357822'
        },
        {
          url: '/_next/static/chunks/398.f090f14a358fd517.js',
          revision: 'f090f14a358fd517'
        },
        {
          url: '/_next/static/chunks/398.f090f14a358fd517.js.map',
          revision: 'b3c30af1d70c7bc57daccae2db590494'
        },
        {
          url: '/_next/static/chunks/445-d20b820ca3d6ec56.js',
          revision: 'd20b820ca3d6ec56'
        },
        {
          url: '/_next/static/chunks/445-d20b820ca3d6ec56.js.map',
          revision: '9c44aaf77cecec3afa9e773928dbb9fc'
        },
        {
          url: '/_next/static/chunks/4522.0751d8797f69bc75.js',
          revision: '0751d8797f69bc75'
        },
        {
          url: '/_next/static/chunks/4522.0751d8797f69bc75.js.map',
          revision: '22b4f16e9d1f03cd303d690e906f90b2'
        },
        {
          url: '/_next/static/chunks/4883.42b8359b4c8aab2d.js',
          revision: '42b8359b4c8aab2d'
        },
        {
          url: '/_next/static/chunks/4883.42b8359b4c8aab2d.js.map',
          revision: '8bd8a840b955d1442f2bc69dcd5918db'
        },
        {
          url: '/_next/static/chunks/532.be88343e904c2340.js',
          revision: 'be88343e904c2340'
        },
        {
          url: '/_next/static/chunks/532.be88343e904c2340.js.map',
          revision: 'df5b0abec36304baa479ec390d8c7662'
        },
        {
          url: '/_next/static/chunks/5398-2b9bb641188c63ea.js',
          revision: '2b9bb641188c63ea'
        },
        {
          url: '/_next/static/chunks/5398-2b9bb641188c63ea.js.map',
          revision: '53f9e05957949dc525ec297f49ae490c'
        },
        {
          url: '/_next/static/chunks/560-30da90f04f6392f3.js',
          revision: '30da90f04f6392f3'
        },
        {
          url: '/_next/static/chunks/560-30da90f04f6392f3.js.map',
          revision: 'a3b822845573a6b7af83f2526c4a0333'
        },
        {
          url: '/_next/static/chunks/5858.82e850a44aa8ccfa.js',
          revision: '82e850a44aa8ccfa'
        },
        {
          url: '/_next/static/chunks/5858.82e850a44aa8ccfa.js.map',
          revision: 'dd8c3ffdc4eb816866e1a048417144b1'
        },
        {
          url: '/_next/static/chunks/6042-d7e5fcfd79c5cef7.js',
          revision: 'd7e5fcfd79c5cef7'
        },
        {
          url: '/_next/static/chunks/6042-d7e5fcfd79c5cef7.js.map',
          revision: '98ea52bb185382b3d547c2539d63124f'
        },
        {
          url: '/_next/static/chunks/6459-9b5e99bff992f500.js',
          revision: '9b5e99bff992f500'
        },
        {
          url: '/_next/static/chunks/6459-9b5e99bff992f500.js.map',
          revision: 'ed85b8d470e7419e597ab8f4dff324f4'
        },
        {
          url: '/_next/static/chunks/6497.399b8c941ce9b5f3.js',
          revision: '399b8c941ce9b5f3'
        },
        {
          url: '/_next/static/chunks/6497.399b8c941ce9b5f3.js.map',
          revision: '22d58870e183a529172ca156875fd1c6'
        },
        {
          url: '/_next/static/chunks/6563.099381adeb047d8f.js',
          revision: '099381adeb047d8f'
        },
        {
          url: '/_next/static/chunks/6652-75b97d85fd96d557.js',
          revision: '75b97d85fd96d557'
        },
        {
          url: '/_next/static/chunks/6652-75b97d85fd96d557.js.map',
          revision: 'a8f0c4d3bed125950e2e2c06e97c51a7'
        },
        {
          url: '/_next/static/chunks/673.fc77ec5241afd452.js',
          revision: 'fc77ec5241afd452'
        },
        {
          url: '/_next/static/chunks/673.fc77ec5241afd452.js.map',
          revision: 'b0d2d2369a220d9c7a5ae3fb5e5ad473'
        },
        {
          url: '/_next/static/chunks/6901.6b74eb271cb1334e.js',
          revision: '6b74eb271cb1334e'
        },
        {
          url: '/_next/static/chunks/6901.6b74eb271cb1334e.js.map',
          revision: '5d5a51728386c48c888791302ff27c29'
        },
        {
          url: '/_next/static/chunks/6971.08f6f4ff375d3932.js',
          revision: '08f6f4ff375d3932'
        },
        {
          url: '/_next/static/chunks/6971.08f6f4ff375d3932.js.map',
          revision: 'a43df4d2ca4938f6f16a09bb80e8b45d'
        },
        {
          url: '/_next/static/chunks/7219.e9ccdc75e09994f9.js',
          revision: 'e9ccdc75e09994f9'
        },
        {
          url: '/_next/static/chunks/7219.e9ccdc75e09994f9.js.map',
          revision: '62180453af6f67bd876ffbc12147ad7b'
        },
        {
          url: '/_next/static/chunks/7710.f64ac1cdc9070e79.js',
          revision: 'f64ac1cdc9070e79'
        },
        {
          url: '/_next/static/chunks/7710.f64ac1cdc9070e79.js.map',
          revision: 'cd3e30b3904208b02fb56fcda3cdcdcd'
        },
        {
          url: '/_next/static/chunks/7726.9f3a4833d42583fe.js',
          revision: '9f3a4833d42583fe'
        },
        {
          url: '/_next/static/chunks/7726.9f3a4833d42583fe.js.map',
          revision: 'e74762a3e163a5dd33d675da81ff5dda'
        },
        {
          url: '/_next/static/chunks/7833-21c666f57864eb67.js',
          revision: '21c666f57864eb67'
        },
        {
          url: '/_next/static/chunks/7833-21c666f57864eb67.js.map',
          revision: '4b90c0921e2393801f13a42f3edff899'
        },
        {
          url: '/_next/static/chunks/8427.e370cb539bdd4ad3.js',
          revision: 'e370cb539bdd4ad3'
        },
        {
          url: '/_next/static/chunks/8427.e370cb539bdd4ad3.js.map',
          revision: '8468482e73f7827244e66a9d9b2369a9'
        },
        {
          url: '/_next/static/chunks/8636.c0d69ff2736445d6.js',
          revision: 'c0d69ff2736445d6'
        },
        {
          url: '/_next/static/chunks/8636.c0d69ff2736445d6.js.map',
          revision: '2a181d6361722b6642b5a97111587378'
        },
        {
          url: '/_next/static/chunks/8642-8c3854cb99bbb208.js',
          revision: '8c3854cb99bbb208'
        },
        {
          url: '/_next/static/chunks/8642-8c3854cb99bbb208.js.map',
          revision: 'd800cfef160efdd362f0bdfb1d3a753a'
        },
        {
          url: '/_next/static/chunks/8704.e83b4e082ab9dc7a.js',
          revision: 'e83b4e082ab9dc7a'
        },
        {
          url: '/_next/static/chunks/8704.e83b4e082ab9dc7a.js.map',
          revision: '70a4b3c36673191c2128835fa82ff18f'
        },
        {
          url: '/_next/static/chunks/8862.361c383b73729ccd.js',
          revision: '361c383b73729ccd'
        },
        {
          url: '/_next/static/chunks/8862.361c383b73729ccd.js.map',
          revision: '01014f6e5275933ca6de218fd3a605f1'
        },
        {
          url: '/_next/static/chunks/9008.1ac1206b16a10900.js',
          revision: '1ac1206b16a10900'
        },
        {
          url: '/_next/static/chunks/9008.1ac1206b16a10900.js.map',
          revision: '70c0b870239770edba69d560390d7bd0'
        },
        {
          url: '/_next/static/chunks/901.1281e19b2f99c9f4.js',
          revision: '1281e19b2f99c9f4'
        },
        {
          url: '/_next/static/chunks/901.1281e19b2f99c9f4.js.map',
          revision: 'd7bd57266580e4881cd6c7fe2b47a567'
        },
        {
          url: '/_next/static/chunks/910-0367efb80f4d5061.js',
          revision: '0367efb80f4d5061'
        },
        {
          url: '/_next/static/chunks/910-0367efb80f4d5061.js.map',
          revision: '02ce955e6da276c0e9fd5715dd346302'
        },
        {
          url: '/_next/static/chunks/9379-6ccf19b02298c4d6.js',
          revision: '6ccf19b02298c4d6'
        },
        {
          url: '/_next/static/chunks/9379-6ccf19b02298c4d6.js.map',
          revision: '6111981412cce987023042bf32459427'
        },
        {
          url: '/_next/static/chunks/9382-a0868f1f17114c77.js',
          revision: 'a0868f1f17114c77'
        },
        {
          url: '/_next/static/chunks/9382-a0868f1f17114c77.js.map',
          revision: '8edecefe23f247ba5f08619a8b9d1d90'
        },
        {
          url: '/_next/static/chunks/9518.65a740609ccd485c.js',
          revision: '65a740609ccd485c'
        },
        {
          url: '/_next/static/chunks/9518.65a740609ccd485c.js.map',
          revision: '665878a0720c5913ea6933035c0dccf5'
        },
        {
          url: '/_next/static/chunks/9522.c71850c0b5ebca84.js',
          revision: 'c71850c0b5ebca84'
        },
        {
          url: '/_next/static/chunks/9522.c71850c0b5ebca84.js.map',
          revision: 'cead8a4bc73e8b013bb2f8aedc0b621f'
        },
        {
          url: '/_next/static/chunks/9571-246e22d6009cb514.js',
          revision: '246e22d6009cb514'
        },
        {
          url: '/_next/static/chunks/9571-246e22d6009cb514.js.map',
          revision: '6848ea0e1e33925d1345347d8b0adcfb'
        },
        {
          url: '/_next/static/chunks/9593-6c18be10b87292c5.js',
          revision: '6c18be10b87292c5'
        },
        {
          url: '/_next/static/chunks/9593-6c18be10b87292c5.js.map',
          revision: '57cf1b0e7fdb150510cc6080425c01e0'
        },
        {
          url: '/_next/static/chunks/9740-bba21bbbd5abafb0.js',
          revision: 'bba21bbbd5abafb0'
        },
        {
          url: '/_next/static/chunks/9740-bba21bbbd5abafb0.js.map',
          revision: '93262a17f163c107e27374cc6f422031'
        },
        {
          url: '/_next/static/chunks/9847-407514707102c6e7.js',
          revision: '407514707102c6e7'
        },
        {
          url: '/_next/static/chunks/9847-407514707102c6e7.js.map',
          revision: '46ecc7d89eba5025a8f85404d78757ab'
        },
        {
          url: '/_next/static/chunks/9882.f3e569ba3ee122ee.js',
          revision: 'f3e569ba3ee122ee'
        },
        {
          url: '/_next/static/chunks/9882.f3e569ba3ee122ee.js.map',
          revision: '419bcf0a732c0703f91a43b28b775b79'
        },
        {
          url: '/_next/static/chunks/framework-ec7578bc3e7e9c78.js',
          revision: 'ec7578bc3e7e9c78'
        },
        {
          url: '/_next/static/chunks/framework-ec7578bc3e7e9c78.js.map',
          revision: 'fe1182684b49a6d947250f4b044c9465'
        },
        {
          url: '/_next/static/chunks/main-4dbc7b4f7f6ebf4c.js',
          revision: '4dbc7b4f7f6ebf4c'
        },
        {
          url: '/_next/static/chunks/main-4dbc7b4f7f6ebf4c.js.map',
          revision: '2d83aaf90a1edb3d977f8edf4034d5e6'
        },
        {
          url: '/_next/static/chunks/pages/404-0ea9b633f068eec3.js',
          revision: '0ea9b633f068eec3'
        },
        {
          url: '/_next/static/chunks/pages/404-0ea9b633f068eec3.js.map',
          revision: '059c4a43657f791fbc57f40be640e10a'
        },
        {
          url: '/_next/static/chunks/pages/500-8e7c19c6823306c0.js',
          revision: '8e7c19c6823306c0'
        },
        {
          url: '/_next/static/chunks/pages/500-8e7c19c6823306c0.js.map',
          revision: '0c6380a7d55737ec03c9f44972a97352'
        },
        {
          url: '/_next/static/chunks/pages/_app-118cada773c95241.js',
          revision: '118cada773c95241'
        },
        {
          url: '/_next/static/chunks/pages/_app-118cada773c95241.js.map',
          revision: '6f5b4b3a7f6a11529dd13ceb4c3643d5'
        },
        {
          url: '/_next/static/chunks/pages/_error-0fb4a8ea89e581d9.js',
          revision: '0fb4a8ea89e581d9'
        },
        {
          url: '/_next/static/chunks/pages/_error-0fb4a8ea89e581d9.js.map',
          revision: '4ce88737a7198d098d556bd7b3e19e8c'
        },
        {
          url: '/_next/static/chunks/pages/contact-bdd7baf17a3c6810.js',
          revision: 'bdd7baf17a3c6810'
        },
        {
          url: '/_next/static/chunks/pages/contact-bdd7baf17a3c6810.js.map',
          revision: '1ec54bdb9750efa6f4573ddb5128ac9c'
        },
        {
          url: '/_next/static/chunks/pages/create/fundraise-38a5f56ba4a10a75.js',
          revision: '38a5f56ba4a10a75'
        },
        {
          url: '/_next/static/chunks/pages/create/fundraise-38a5f56ba4a10a75.js.map',
          revision: '334e39092163653747e5f3175cc6d380'
        },
        {
          url: '/_next/static/chunks/pages/create/group-fbe1c6ae57d3ba25.js',
          revision: 'fbe1c6ae57d3ba25'
        },
        {
          url: '/_next/static/chunks/pages/create/group-fbe1c6ae57d3ba25.js.map',
          revision: '3d5702903030555c729d65c21050c532'
        },
        {
          url: '/_next/static/chunks/pages/create/profile-bc117f1099381463.js',
          revision: 'bc117f1099381463'
        },
        {
          url: '/_next/static/chunks/pages/create/profile-bc117f1099381463.js.map',
          revision: '2f8117a3774d67ac745e0a7d15b5d71d'
        },
        {
          url: '/_next/static/chunks/pages/explore-92c2863e1cf36532.js',
          revision: '92c2863e1cf36532'
        },
        {
          url: '/_next/static/chunks/pages/explore-92c2863e1cf36532.js.map',
          revision: 'fb64d423925ab10ac87260e613a06b5c'
        },
        {
          url: '/_next/static/chunks/pages/groups-eddfa1077c80c01b.js',
          revision: 'eddfa1077c80c01b'
        },
        {
          url: '/_next/static/chunks/pages/groups-eddfa1077c80c01b.js.map',
          revision: 'cfb46e339a0e159dc675b69bc17f41dc'
        },
        {
          url: '/_next/static/chunks/pages/groups/%5Bid%5D-1f446dc0ee99e636.js',
          revision: '1f446dc0ee99e636'
        },
        {
          url: '/_next/static/chunks/pages/groups/%5Bid%5D-1f446dc0ee99e636.js.map',
          revision: 'cac895b24570476a5e1349823732b300'
        },
        {
          url: '/_next/static/chunks/pages/index-e2cdd0a1c1ea5c00.js',
          revision: 'e2cdd0a1c1ea5c00'
        },
        {
          url: '/_next/static/chunks/pages/index-e2cdd0a1c1ea5c00.js.map',
          revision: '42f8ee911a01938da5e9bf2bc17faa71'
        },
        {
          url: '/_next/static/chunks/pages/notifications-d1d7dc8cc8a5ae5a.js',
          revision: 'd1d7dc8cc8a5ae5a'
        },
        {
          url: '/_next/static/chunks/pages/notifications-d1d7dc8cc8a5ae5a.js.map',
          revision: 'cee385216348dac405878f7befc78a3f'
        },
        {
          url: '/_next/static/chunks/pages/posts/%5Bid%5D-d762546a73521484.js',
          revision: 'd762546a73521484'
        },
        {
          url: '/_next/static/chunks/pages/posts/%5Bid%5D-d762546a73521484.js.map',
          revision: '8ae218c1f45de058417565dfa03000b0'
        },
        {
          url: '/_next/static/chunks/pages/privacy-d118979babecaa1f.js',
          revision: 'd118979babecaa1f'
        },
        {
          url: '/_next/static/chunks/pages/privacy-d118979babecaa1f.js.map',
          revision: 'a42866395881aa481fbf53bfe97ce330'
        },
        {
          url: '/_next/static/chunks/pages/report/%5Bid%5D-b47dd48a38042b27.js',
          revision: 'b47dd48a38042b27'
        },
        {
          url: '/_next/static/chunks/pages/report/%5Bid%5D-b47dd48a38042b27.js.map',
          revision: '3a4478be1f895f9b4213fd930c82f974'
        },
        {
          url: '/_next/static/chunks/pages/search-8ee0d1ffe45510cc.js',
          revision: '8ee0d1ffe45510cc'
        },
        {
          url: '/_next/static/chunks/pages/search-8ee0d1ffe45510cc.js.map',
          revision: 'b521e61edbed4af41cfe74b779b52d47'
        },
        {
          url: '/_next/static/chunks/pages/settings-bae30fd0624ae347.js',
          revision: 'bae30fd0624ae347'
        },
        {
          url: '/_next/static/chunks/pages/settings-bae30fd0624ae347.js.map',
          revision: '63a0e9063abc150acfdce78ba4c50984'
        },
        {
          url: '/_next/static/chunks/pages/settings/account-f9d20f07142b58f2.js',
          revision: 'f9d20f07142b58f2'
        },
        {
          url: '/_next/static/chunks/pages/settings/account-f9d20f07142b58f2.js.map',
          revision: 'd755a1a12b2a52fd20cd0c2031a87fb8'
        },
        {
          url: '/_next/static/chunks/pages/settings/allowance-e9e5569830763c07.js',
          revision: 'e9e5569830763c07'
        },
        {
          url: '/_next/static/chunks/pages/settings/allowance-e9e5569830763c07.js.map',
          revision: '1907a48b5cb3bdb5ab3a177fcbe9a6af'
        },
        {
          url: '/_next/static/chunks/pages/settings/delete-4f54f38f8e60a50e.js',
          revision: '4f54f38f8e60a50e'
        },
        {
          url: '/_next/static/chunks/pages/settings/delete-4f54f38f8e60a50e.js.map',
          revision: 'ac9a17360b52f33e9d6de5e8483947e2'
        },
        {
          url: '/_next/static/chunks/pages/thanks-3b0ab84c408e3cfc.js',
          revision: '3b0ab84c408e3cfc'
        },
        {
          url: '/_next/static/chunks/pages/thanks-3b0ab84c408e3cfc.js.map',
          revision: '20000bd77b9567b09390edd8e0d6532e'
        },
        {
          url: '/_next/static/chunks/pages/u/%5Busername%5D-163ad7fd05d752f8.js',
          revision: '163ad7fd05d752f8'
        },
        {
          url: '/_next/static/chunks/pages/u/%5Busername%5D-163ad7fd05d752f8.js.map',
          revision: '28871f03ada880821f0cab04282c3a1e'
        },
        {
          url: '/_next/static/chunks/polyfills-5cd94c89d3acac5f.js',
          revision: '99442aec5788bccac9b2f0ead2afdd6b'
        },
        {
          url: '/_next/static/chunks/webpack-1cf133705783cc31.js',
          revision: '1cf133705783cc31'
        },
        {
          url: '/_next/static/chunks/webpack-1cf133705783cc31.js.map',
          revision: '1c9a1e39206eca293b889cb5e59973e4'
        },
        {
          url: '/_next/static/css/56d1f5034e1e3936.css',
          revision: '56d1f5034e1e3936'
        },
        {
          url: '/_next/static/css/56d1f5034e1e3936.css.map',
          revision: '8fb96bf231e4b85a95a6d40826d253ac'
        },
        {
          url: '/_next/static/css/a0fa6bf6f8c30c7e.css',
          revision: 'a0fa6bf6f8c30c7e'
        },
        {
          url: '/_next/static/css/a0fa6bf6f8c30c7e.css.map',
          revision: '034e44449561ab8d1f5aeea69fa538a6'
        },
        {
          url: '/_next/static/css/a6d0f3a189388d6f.css',
          revision: 'a6d0f3a189388d6f'
        },
        {
          url: '/_next/static/css/a6d0f3a189388d6f.css.map',
          revision: '95cffa2b9579d2746e343893f54674be'
        },
        {
          url: '/_next/static/media/bg-hero.468c4f70.png',
          revision: '468c4f70'
        },
        { url: '/bg-hero.png', revision: '40572701763929daef90ae933a2d3ffe' },
        { url: '/ens.svg', revision: '644b49c89af8f37a753a04bde4649075' },
        { url: '/eth-white.svg', revision: '24ceec7272261d795f0039c02f0d46c1' },
        { url: '/favicon.ico', revision: 'c78f34365878d50da617530f5e9cbdd2' },
        { url: '/favicon.svg', revision: '20a391483a10c6c2eda99a9167ceaf07' },
        { url: '/lens.png', revision: '1b981fccf7f43315ba82b66fb2f7423a' },
        { url: '/logo.jpg', revision: 'ea3584810e23f1ffd505f2642f4124a9' },
        { url: '/logo.svg', revision: '24f9ae3cafeb4ac30050ade77f4e6260' },
        { url: '/manifest.json', revision: '4b18a1bd30b114066a39810e2d156e87' },
        {
          url: '/opensearch.xml',
          revision: '19fe6728e95ff73517fa3c9209cee004'
        },
        { url: '/pride.svg', revision: '26aeb5da249046f5162dba892d7c3217' },
        { url: '/robots.txt', revision: 'f140fb7eb3bed35594150663143dd2a2' },
        { url: '/sitemap.xml', revision: '6a87424d431686de00b70252667b70e8' }
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: c,
              state: a
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers
                  })
                : s
          }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })
        ]
      }),
      'GET'
    )
})
//# sourceMappingURL=sw.js.map
