/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

!function(n,t){var r=t.querySelector("link[rel=next]");if(r){var i=t.querySelector(".post-feed");if(i){var o=300,s=!1,l=!1,c=n.scrollY,u=n.innerHeight,d=t.documentElement.scrollHeight;n.addEventListener("scroll",a,{passive:!0}),n.addEventListener("resize",m),f()}}function v(){if(404===this.status)return n.removeEventListener("scroll",a),void n.removeEventListener("resize",m);this.response.querySelectorAll(".post-card").forEach(function(e){i.appendChild(e)});var e=this.response.querySelector("link[rel=next]");e?r.href=e.href:(n.removeEventListener("scroll",a),n.removeEventListener("resize",m)),d=t.documentElement.scrollHeight,l=s=!1}function e(){if(!l)if(c+u<=d-o)s=!1;else{l=!0;var e=new n.XMLHttpRequest;e.responseType="document",e.addEventListener("load",v),e.open("GET",r.href),e.send(null)}}function f(){s||n.requestAnimationFrame(e),s=!0}function a(){c=n.scrollY,f()}function m(){u=n.innerHeight,d=t.documentElement.scrollHeight,f()}}(window,document);
//# sourceMappingURL=infinitescroll.js.map
