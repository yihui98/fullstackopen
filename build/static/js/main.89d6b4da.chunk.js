(this.webpackJsonpnotes=this.webpackJsonpnotes||[]).push([[0],{39:function(t,n,e){"use strict";e.r(n);var c=e(15),o=e.n(c),r=e(6),a=e(4),i=e(2),u=e(0),s=function(t){var n=t.note,e=t.toggleImportance,c=n.important?"make not important":"make important";return Object(u.jsxs)("li",{children:[n.content,Object(u.jsx)("button",{onClick:e,children:c})]})},l=e(3),j=e.n(l),f="/api/notes",d=function(){return j.a.get(f).then((function(t){return t.data}))},b=function(t){return j.a.post(f,t).then((function(t){return t.data}))},h=function(t,n){return j.a.put("".concat(f,"/").concat(t),n).then((function(t){return t.data}))},p=function(){var t=Object(i.useState)([]),n=Object(a.a)(t,2),e=n[0],c=n[1],o=Object(i.useState)(""),l=Object(a.a)(o,2),j=l[0],f=l[1],p=Object(i.useState)(!1),O=Object(a.a)(p,2),m=O[0],g=O[1];Object(i.useEffect)((function(){d().then((function(t){c(t)}))}),[]),console.log("render",e.length,"notes");var v=m?e:e.filter((function(t){return t.important}));return Object(u.jsxs)("div",{children:[Object(u.jsx)("h1",{children:"Notes"}),Object(u.jsx)("div",{children:Object(u.jsxs)("button",{onClick:function(){return g(!m)},children:["show ",m?"important":"all"]})}),Object(u.jsx)("ul",{children:v.map((function(t){return Object(u.jsx)(s,{note:t,toggleImportance:function(){return function(t){"http://localhost:3001/notes/".concat(t);var n=e.find((function(n){return n.id===t})),o=Object(r.a)(Object(r.a)({},n),{},{important:!n.important});h(t,o).then((function(o){c(e.map((function(n){return n.id!==t?n:o}))).catch((function(o){alert("the note '".concat(n.content,"' was already deleted from server")),c(e.filter((function(n){return n.id!==t})))}))}))}(t.id)}},t.id)}))}),Object(u.jsxs)("form",{onSubmit:function(t){t.preventDefault();var n={content:j,date:(new Date).toISOString(),important:Math.random()>.5,id:e.length+1};b(n).then((function(t){c(e.concat(t)),f("")}))},children:[Object(u.jsx)("input",{value:j,onChange:function(t){console.log(t.target.value),f(t.target.value)}}),Object(u.jsx)("button",{type:"submit",children:"save"})]})]})};o.a.render(Object(u.jsx)(p,{}),document.getElementById("root"))}},[[39,1,2]]]);
//# sourceMappingURL=main.89d6b4da.chunk.js.map