"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[394],{4394:(I,l,o)=>{o.r(l),o.d(l,{AdminModule:()=>F});var A=o(6895),p=o(5649),s=o(433),c=o(805),n=o(8256),u=o(529),y=o(2340),d=o(8505),g=o(4004),f=o(262),v=o(9646);let h=(()=>{class t{constructor(e){this.http=e,this.baseUrl=y.N.baseUrl}get user(){return{...this._user}}login({username:e,password:i}){const m=(new u.LE).append("admin",!0);return this.http.post(`${this.baseUrl}/auth/login`,{username:e,password:i},{params:m}).pipe((0,d.b)(({token:a})=>{a&&localStorage.setItem("token",a)}),(0,g.U)(a=>a.ok),(0,f.K)(a=>(0,v.of)(a.error.msg)))}revalidarToken(){const e=(new u.WM).set("x-token",localStorage.getItem("token")||""),i=(new u.LE).append("admin",!0);return this.http.get(`${this.baseUrl}/auth/revalidar`,{headers:e,params:i}).pipe((0,d.b)(({user:m,token:a})=>{this._user=m,localStorage.setItem("token",a)}),(0,g.U)(m=>m.ok),(0,f.K)(m=>(0,v.of)(!1)))}}return t.\u0275fac=function(e){return new(e||t)(n.LFG(u.eN))},t.\u0275prov=n.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();var S=o(1740),C=o(5593),U=o(7772);const Z=[{path:"login",component:(()=>{class t{constructor(e,i,m,a){this.adminService=e,this.fb=i,this.router=m,this.messageService=a,this.formLogin=this.fb.group({username:["",[s.kI.required]],password:["",[s.kI.required]]})}ngOnInit(){}login(){this.messageService.clear(),this.adminService.login(this.formLogin.value).subscribe(e=>{!0===e?this.router.navigateByUrl("/admin/home"):this.messageService.add({severity:"error",summary:e})})}}return t.\u0275fac=function(e){return new(e||t)(n.Y36(h),n.Y36(s.qu),n.Y36(p.F0),n.Y36(c.ez))},t.\u0275cmp=n.Xpm({type:t,selectors:[["app-login"]],features:[n._Bn([c.ez])],decls:14,vars:2,consts:[[1,"card"],[1,"card-container","flex","justify-content-center"],[1,"flex","gap-3","flex-column","p-3","mt-5",3,"formGroup","ngSubmit"],[1,"p-inputgroup"],[1,"p-inputgroup-addon"],[1,"pi","pi-user"],["type","text","pInputText","","placeholder","Username","formControlName","username"],[1,"pi","pi-key"],["type","password","pInputText","","placeholder","Password","formControlName","password"],["pButton","","label","Ingresar","type","submit",1,"col-12",3,"disabled"]],template:function(e,i){1&e&&(n.TgZ(0,"div",0)(1,"div",1)(2,"form",2),n.NdJ("ngSubmit",function(){return i.login()}),n.TgZ(3,"div",3)(4,"span",4),n._UZ(5,"i",5),n.qZA(),n._UZ(6,"input",6),n.qZA(),n.TgZ(7,"div",3)(8,"span",4),n._UZ(9,"i",7),n.qZA(),n._UZ(10,"input",8),n.qZA(),n.TgZ(11,"div",3),n._UZ(12,"button",9),n.qZA()()()(),n._UZ(13,"p-messages")),2&e&&(n.xp6(2),n.Q6J("formGroup",i.formLogin),n.xp6(10),n.Q6J("disabled",i.formLogin.invalid))},dependencies:[s._Y,s.Fj,s.JJ,s.JL,s.sg,s.u,S.o,C.Hq,U.V],styles:["form[_ngcontent-%COMP%]{border-radius:5px;border:thin solid gray}"]}),t})()},{path:"home",component:(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=n.Xpm({type:t,selectors:[["app-resumen"]],decls:2,vars:0,template:function(e,i){1&e&&(n.TgZ(0,"p"),n._uU(1,"resumen works!"),n.qZA())}}),t})(),canActivate:[(()=>{class t{constructor(e,i){this.adminService=e,this.router=i}canActivate(){return this.adminService.revalidarToken().pipe((0,d.b)(e=>{e||this.router.navigateByUrl("/admin/login")}))}}return t.\u0275fac=function(e){return new(e||t)(n.LFG(h),n.LFG(p.F0))},t.\u0275prov=n.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()]},{path:"**",redirectTo:"login"}];let L=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[p.Bz.forChild(Z),p.Bz]}),t})();var T=o(9658);let F=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[A.ez,s.UX,L,T.W]}),t})()}}]);