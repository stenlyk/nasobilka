(this.webpackJsonpnasobilka=this.webpackJsonpnasobilka||[]).push([[0],{16:function(e,t,a){},17:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(7),s=a.n(l),c=(a(14),a(15),a(16),a(2)),i=a(3),o=a(5),m=a(4),u=[1,2,3,4,5,6,7,8,9,10],d=function(e){Object(o.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={num:u,skils:{nas:"N\xe1soben\xed",del:"D\u011blen\xed"}},n}return Object(i.a)(a,[{key:"renderNumber",value:function(e){var t=this.props.selected.num.indexOf(e);return r.a.createElement(r.a.Fragment,{key:e},r.a.createElement("input",{type:"checkbox",name:"num",value:e,checked:-1!==t,id:"input"+e,onChange:this.props.onChange}),r.a.createElement("label",{className:"checkbox",htmlFor:"input"+e},e))}},{key:"renderSkils",value:function(e,t){return r.a.createElement(r.a.Fragment,{key:t},r.a.createElement("input",{type:"checkbox",name:t,value:!0,checked:!0===this.props.selected.skils[t],id:"input"+t,onChange:this.props.onChange}),r.a.createElement("label",{className:"checkbox",htmlFor:"input"+t},e))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"start"},r.a.createElement("form",{onSubmit:this.props.onSubmit},r.a.createElement("h4",null,"S jak\xfdmi \u010d\xedsly chce\u0161 po\u010d\xedtat?"),r.a.createElement("div",{className:"numbers justify-content-between"},r.a.createElement("input",{type:"checkbox",value:!0,name:"all",checked:this.props.selected.num.length===this.state.num.length,onChange:this.props.onChange,id:"inputAll"}),r.a.createElement("label",{className:"checkbox all",htmlFor:"inputAll"},"V\u0161e"),this.state.num.map((function(t){return e.renderNumber(t)}))),r.a.createElement("h4",null,"Co chce\u0161 tr\xe9novat?"),r.a.createElement("div",{className:"justify-content-between"},Object.keys(this.state.skils).map((function(t){return e.renderSkils(e.state.skils[t],t)}))),r.a.createElement("hr",null),r.a.createElement("div",{className:"row align-items-center"},r.a.createElement("div",{className:"col light-text"},this.props.total," dokon\u010den\xfdch p\u0159\xedklad\u016f"),r.a.createElement("div",{className:"col text-right"},r.a.createElement("button",{type:"submit",className:"btn"},r.a.createElement("img",{src:"/ic-next-white.svg",alt:"Po\u010d\xedt\xe1\u0161 na jedni\u010dku"})," ","Za\u010d\xedt po\u010d\xedtat")))))}}]),a}(r.a.Component),h=a(8),v=a(1),g=function(e){Object(o.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state=n.initialState,n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){this.generateQuestions()}},{key:"reload",value:function(e){var t=this;this.setState(this.initialState),setTimeout((function(){t.generateQuestions()}),100),e.preventDefault()}},{key:"handleChange",value:function(e){var t=this.state.answers;t[this.state.position]=Number(e.target.value),this.setState({answers:t})}},{key:"handleSubmit",value:function(e){var t=this,a=this.state,n=a.questions,r=a.wrong,l=a.answers,s=a.position;if(Object.keys(n).length>s){var c=Object.keys(n)[s],i=n[c],o=2e3;if(this.setState({submited:!0}),i.date=(new Date).toISOString().slice(0,10),this.evaluate(i,l[s])){var m=v.reactLocalStorage.getObject("correct",[]);m.push(i),v.reactLocalStorage.setObject("correct",m),this.setState({correctAnswer:"Spr\xe1vn\u011b!",correctAnswerState:"success"}),o=800}else{var u=this.getCorrectAnswer(i),d=v.reactLocalStorage.getObject("wrong",[]);d.push(i),v.reactLocalStorage.setObject("wrong",d),r[c]=i,this.setState({correctAnswer:"Spr\xe1vn\xe1 odpov\u011b\u010f je "+u,correctAnswerState:"danger",wrong:r})}setTimeout((function(){return t.setState({position:s+1,submited:!1})}),o)}Object.keys(n).length===s+1&&this.setState({done:!0}),e.preventDefault()}},{key:"evaluate",value:function(e,t){return this.getCorrectAnswer(e)===t}},{key:"getCorrectAnswer",value:function(e){return"nas"===e.method&&"right"===e.side?e.num1*e.num2:e.first?e.num2:e.num1}},{key:"setDone",value:function(e,t){var a=this.state.questions;t?this.setState({done:!0,answers:[1,2,3,4,5,6,7,8,9,10],position:10}):this.setState({done:!0,answers:[1,2,3,4,5,6,7,8,9,10],position:10,wrong:Object.entries(a).slice(0,4).map((function(e){return e[1]}))}),e.preventDefault()}},{key:"generateQuestions",value:function(){for(var e=0;e<10;e++)this.generateQuestion()}},{key:"generateQuestion",value:function(){var e=this.props.num,t=this.props.nas,a=this.props.del,n=["left","right"],r=["nas","del"],l=this.state.questions,s=1,c=1,i="left",o="nas",m=!0;if(Object.keys(l).length<10){s=Math.floor(11*Math.random()),c=e[Math.floor(Math.random()*e.length)],i=n[Math.floor(Math.random()*n.length)],m=Math.floor(1e3*Math.random())%2===0,o=t?"nas":"del",t&&a&&(o=r[Math.floor(Math.random()*r.length)]),0===s&&(i="right",m=!1);var u=o+"|"+i+"|"+m+"|"+s+"|"+c;l[u]&&this.generateQuestion(),l[u]={num1:s,num2:c,method:o,side:i,first:m},this.setState((function(e){return Object(h.a)({},e,{questions:l})}))}}},{key:"renderQuestion",value:function(){var e=this.state.position,t=this.state.questions,a=this.state.submited,n=this.state.correctAnswer,l=this.state.correctAnswerState,s=t[Object.keys(t)[e]],c=s.num1,i=s.num2,o=s.side,m=s.method,u=s.first;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"row question justify-content-center align-items-center"},r.a.createElement("div",{className:"col"},"nas"===m?this.renderMultiplication(c,i,o,u):this.renderDivade(c,i,o,u))),a?r.a.createElement("div",{className:"alert alert-"+l},n):r.a.createElement("div",{className:"alert"}),r.a.createElement("div",{className:"row text-right"},r.a.createElement("div",{className:"col"},r.a.createElement("input",{type:"submit",className:"btn",value:"Zkontrolovat"}))))}},{key:"renderMultiplication",value:function(e,t,a,n){var l=this,s="nas|"+a+"|"+n+"|"+e+"|"+t;return"left"===a?r.a.createElement("h2",null,n?e:t," ",r.a.createElement("span",{className:"mul"},"*")," ",r.a.createElement("input",{key:s,type:"number",name:"num",min:"0",max:"10",step:"1",required:!0,autoFocus:!0,onChange:function(e){return l.handleChange(e)}})," ",r.a.createElement("span",null,"="),e*t):r.a.createElement("h2",null,e," ",r.a.createElement("span",{className:"mul"},"*")," ",t," ",r.a.createElement("span",null,"=")," ",r.a.createElement("input",{key:s,type:"number",name:"num",min:"0",step:"1",required:!0,autoFocus:!0,onChange:function(e){return l.handleChange(e)}}))}},{key:"renderDivade",value:function(e,t,a,n){var l=this,s="del|"+a+"|"+n+"|"+e+"|"+t,c=e*t;return"left"===a?r.a.createElement("h2",null,c," ",r.a.createElement("span",{className:"div"},":")," ",r.a.createElement("input",{key:s,type:"number",name:"num",min:"0",max:"10",step:"1",required:!0,autoFocus:!0,onChange:function(e){return l.handleChange(e)}})," ",r.a.createElement("span",null,"="),n?e:t):r.a.createElement("h2",null,c," ",r.a.createElement("span",{className:"div"},":")," ",n?e:t," ",r.a.createElement("span",null,"=")," ",r.a.createElement("input",{key:s,type:"number",name:"num",min:"0",step:"1",required:!0,autoFocus:!0,onChange:function(e){return l.handleChange(e)}}))}},{key:"renderViewMultiplication",value:function(e,t,a,n){var l=e*t,s="nas|"+a+"|"+n+"|"+e+"|"+t;return"left"===a?r.a.createElement("h3",{key:s},n?e:t," *"," ",r.a.createElement("strong",{className:"bg-danger"},n?t:e)," ="," ",e*t):r.a.createElement("h3",{key:s},e," * ",t," = ",r.a.createElement("strong",{className:"bg-danger"},l))}},{key:"renderViewDivade",value:function(e,t,a,n){var l="del|"+a+"|"+n+"|"+e+"|"+t,s=e*t;return"left"===a?r.a.createElement("h3",{key:l},s," : ",r.a.createElement("strong",{className:"bg-danger"},n?t:e)," ="," ",n?e:t):r.a.createElement("h3",{key:l},s," : ",n?e:t," ="," ",r.a.createElement("strong",{className:"bg-danger"},n?t:e))}},{key:"renderWrong",value:function(e){var t=this;return Object.keys(e).map((function(a){var n=e[a];return"nas"===n.method?r.a.createElement("div",{className:"col-6",key:a},t.renderViewMultiplication(n.num1,n.num2,n.side,n.first)):r.a.createElement("div",{className:"col-6",key:a},t.renderViewDivade(n.num1,n.num2,n.side,n.first))}))}},{key:"renderSummary",value:function(){var e=this,t=this.state.questions,a=this.state.wrong,n=Object.keys(t).length,l=Object.keys(a).length;return r.a.createElement(r.a.Fragment,null,r.a.createElement("h4",{className:"text-center quizHeader"},["Excelentn\u011b!","V\xfdborn\u011b.","Skv\u011ble.","Dobr\xe1 pr\xe1ce.","Je\u0161t\u011b to chce zlep\u0161it.","Tr\xe9nink d\u011bl\xe1 mistra.","Nev\u011b\u0161 hlavu a tr\xe9nuj.","Zkusto znovu a l\xe9pe.","Zkusto znovu a l\xe9pe.","Tak to se nepovedlo.","Tr\xe9nuj, tr\xe9nuj, tr\xe9nuj!"][l]),r.a.createElement("h5",{className:"text-center quizHeader"},"Koukni jak ti to \u0161lo."),r.a.createElement("div",{className:"row quiz justify-content-around"},r.a.createElement("div",{className:"col"},r.a.createElement("div",{className:"badge success"},r.a.createElement("img",{src:"/ic-good-badge.svg",alt:"x"}),r.a.createElement("span",null,n-l),r.a.createElement("h4",null,"Spr\xe1vn\u011b"))),0!==l?r.a.createElement("div",{className:"col"},r.a.createElement("div",{className:"badge danger"},r.a.createElement("img",{src:"/ic-wrong-badge.svg",alt:"x"}),r.a.createElement("span",null,l),r.a.createElement("h4",null,"Chybn\u011b"))):null),l>0?r.a.createElement(r.a.Fragment,null,r.a.createElement("hr",null),r.a.createElement("div",{className:"row quiz"},r.a.createElement("div",{className:"col"},r.a.createElement("h4",null,"Poj\u010f, projdeme tv\xe9 chybn\xe9 odpov\u011bdi"),r.a.createElement("div",{className:"row resume"},this.renderWrong(a))))):null,r.a.createElement("hr",null),r.a.createElement("div",{className:"row quiz"},r.a.createElement("div",{className:"col text-right"},r.a.createElement("button",{className:"btn btn-primary btn-lg",onClick:function(t){return e.reload(t)}},"Za\u010d\xedt znovu"))))}},{key:"render",value:function(){var e=this,t=Object.keys(this.state.questions),a=this.state.wrong,n=this.state.position,l=this.state.done;return 0===t.length?null:r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,l?this.renderSummary():r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"progress justify-content-between"},t.map((function(e,t){var l="";return t<n&&(l=a[e]?"danger":"success"),t===n&&(l="current"),r.a.createElement("div",{key:t,className:l+" bullet"})}))),r.a.createElement("form",{onSubmit:function(t){return e.handleSubmit(t)},autoComplete:"off"},this.renderQuestion()))))}},{key:"initialState",get:function(){return{questions:{},wrong:{},position:0,answers:[],submited:!1,correctAnswer:"",correctAnswerState:"success",done:!1}}}]),a}(r.a.Component),E=function(e){Object(o.a)(a,e);var t=Object(m.a)(a);function a(){return Object(c.a)(this,a),t.apply(this,arguments)}return Object(i.a)(a,[{key:"render",value:function(){return r.a.createElement("svg",{className:"circle-chart",viewBox:"0 0 33.83098862 33.83098862",width:"70",height:"70",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("defs",null,r.a.createElement("linearGradient",{id:"linear",x1:"0%",y1:"0%",x2:"100%",y2:"0%"},r.a.createElement("stop",{offset:"0%",stopColor:"#8ac5ff"}),r.a.createElement("stop",{offset:"100%",stopColor:"#006eda"}))),r.a.createElement("circle",{className:"circle-chart__background",stroke:"#efefef",strokeWidth:"2",fill:"none",cx:"16.91549431",cy:"16.91549431",r:"13.91549431"}),r.a.createElement("circle",{className:"circle-chart__circle",strokeWidth:"3",stroke:"url(#linear)",strokeDasharray:this.props.percent+",100",strokeLinecap:"round",fill:"none",cx:"16.91549431",cy:"16.91549431",r:"13.91549431"}),r.a.createElement("g",{className:"circle-chart__info"},r.a.createElement("text",{className:"circle-chart__percent",x:"16.91549431",y:"15.5",alignmentBaseline:"central",textAnchor:"middle",fontSize:"8"},this.props.label)))}}]),a}(r.a.Component),p=function(e){Object(o.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={selected:{num:[1,2,3,4],skils:{nas:!0,del:!0}},submited:!1,error:"",num:u,levels:{20:"green",50:"orange",200:"silver",500:"gold"},tab:"nas"},n}return Object(i.a)(a,[{key:"handleChange",value:function(e){var t=e.target,a=t.value,n=t.name,r=this.state.selected;if("num"===n)if(t.checked)r.num.push(Number(a));else{var l=r.num.indexOf(Number(t.value));-1!==l&&r.num.splice(l,1)}else"all"===n?(console.log(t),console.log(r.num.length,u.length),r.num.length===u.length?r.num=[]:r.num=u):r.skils[n]=t.checked;this.setState({selected:r})}},{key:"handleSubmit",value:function(e){var t=this.state.selected;t.num.length>0&&(t.skils.nas||t.skils.del)?this.setState({submited:!0,error:""}):this.setState({error:"Vyber alespo\u0148 jedno \u010d\xedslo a zvol n\xe1soben\xed nebo d\u011blen\xed."}),e.preventDefault()}},{key:"leave",value:function(e){this.setState({submited:!1}),e.preventDefault()}},{key:"switchTab",value:function(e){this.setState({tab:e.target.value})}},{key:"renderStart",value:function(){var e=this,t=v.reactLocalStorage.getObject("wrong",[]),a=v.reactLocalStorage.getObject("correct",[]),n=t.length+a.length;return r.a.createElement(d,{onChange:function(t){return e.handleChange(t)},onSubmit:function(t){return e.handleSubmit(t)},selected:this.state.selected,total:n})}},{key:"renderQuiz",value:function(){return r.a.createElement(g,{num:this.state.selected.num,nas:this.state.selected.skils.nas,del:this.state.selected.skils.del})}},{key:"getLevel",value:function(e){var t=this.state.levels,a=Object.keys(t),n=["green",20];return a.forEach((function(r,l,s){r<e&&(n=l+1<a.length?[t[s[l+1]],s[l+1]]:[t[r],r])})),n}},{key:"renderStat",value:function(e){var t=this,a=this.state.tab,n=e.nas;"nas"!==this.state.tab&&(n=e.del);var l=this.state.num,s={},c=0;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"radio-bar"},r.a.createElement("input",{type:"radio",name:"tab",value:"nas",id:"nas",checked:"nas"===a,onChange:function(e){return t.switchTab(e)}}),r.a.createElement("label",{htmlFor:"nas"},"N\xe1soben\xed"),r.a.createElement("input",{type:"radio",name:"tab",value:"del",id:"del",checked:"del"===a,onChange:function(e){return t.switchTab(e)}}),r.a.createElement("label",{htmlFor:"del"},"D\u011blen\xed")),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col"},r.a.createElement("div",{className:"justify-content-between flex-wrap"},l.map((function(e){return s=t.getLevel(n[e].correct),c=n[e].correct/s[1]*100,r.a.createElement("div",{className:"graph",key:e},r.a.createElement(E,{percent:c,label:e}),r.a.createElement("img",{src:"/ic-"+s[0]+"-badge.svg",alt:s[0]}))}))))))}},{key:"renderStats",value:function(){var e=this.state.num,t=v.reactLocalStorage.getObject("wrong",[]),a=v.reactLocalStorage.getObject("correct",[]),n={nas:{},del:{},today:{nas:{},del:{}}};return e.map((function(e){return n.nas[e]={correct:0,wrong:0},n.del[e]={correct:0,wrong:0},n.today.nas[e]={correct:0,wrong:0},n.today.del[e]={correct:0,wrong:0},null})),a.map((function(e){return n[e.method][e.num2].correct=n[e.method][e.num2].correct?n[e.method][e.num2].correct+1:1})),t.map((function(e){return n[e.method][e.num2].wrong=n[e.method][e.num2].wrong?n[e.method][e.num2].wrong+1:1})),r.a.createElement(r.a.Fragment,null,this.renderStat(n),r.a.createElement("hr",null),r.a.createElement("div",{className:"row legned info align-items-center"},r.a.createElement("div",{className:"col-md-6 col-sm-12"},r.a.createElement("img",{src:"/ic-green-badge.svg",alt:"Zelen\xe1\u010d"})," ",r.a.createElement("span",null,"Zelen\xe1\u010d")),r.a.createElement("div",{className:"col-md-6 col-sm-12"},r.a.createElement("img",{src:"/ic-orange-badge.svg",alt:"Chce to je\u0161t\u011b tr\xe9nink"})," ",r.a.createElement("span",null,"Chce to je\u0161t\u011b tr\xe9nink")),r.a.createElement("div",{className:"col-md-6 col-sm-12"},r.a.createElement("img",{src:"/ic-silver-badge.svg",alt:"U\u017e jen kousek k c\xedli"})," ",r.a.createElement("span",null,"U\u017e jen kousek k c\xedli")),r.a.createElement("div",{className:"col-md-6 col-sm-12"},r.a.createElement("img",{src:"/ic-gold-badge.svg",alt:"Po\u010d\xedt\xe1\u0161 na jedni\u010dku"})," ",r.a.createElement("span",null,"Po\u010d\xedt\xe1\u0161 na jedni\u010dku"))))}},{key:"render",value:function(){var e=this,t=this.state.submited,a=this.state.error;return r.a.createElement(r.a.Fragment,null,t?r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement("div",{className:"col-md-5 col-sm-12"},r.a.createElement("a",{href:"#leave",className:"leave",onClick:function(t){return e.leave(t)}},r.a.createElement("img",{src:"/ic-close.svg",alt:"Odej\xedt"}),"Odej\xedt"),r.a.createElement("div",{className:"box"},this.renderQuiz()))):r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-lg-6 col-sm-12"},r.a.createElement("div",{className:"box"},""!==a?r.a.createElement("div",{className:"alert alert-danger"},a):"",this.renderStart()),r.a.createElement("div",{className:"row copy"},r.a.createElement("div",{className:"col-6"},"Made with"," ",r.a.createElement("span",{role:"img","aria-label":"love"},"\u2764\ufe0f")," ","by Standa"),r.a.createElement("div",{className:"col-6"},"Designed by ",r.a.createElement("a",{href:"https://zarzicky.cz"},"Luk\xe1\u0161")))),r.a.createElement("div",{className:"col-lg-6 col-sm-12"},r.a.createElement("div",{className:"box"},r.a.createElement("h4",null,"Tvoje v\xfdsledky"),this.renderStats())))))}}]),a}(r.a.Component);var b=function(){return r.a.createElement("div",{className:"App container"},r.a.createElement("div",{className:"row justify-content-center"},r.a.createElement("div",{className:"col-auto"},r.a.createElement("img",{src:"/ic-logo.svg",alt:"po\u010d\xedtej s\xe1m",className:"logo"}))),r.a.createElement(p,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},9:function(e,t,a){e.exports=a(17)}},[[9,1,2]]]);
//# sourceMappingURL=main.fe4b2c0e.chunk.js.map