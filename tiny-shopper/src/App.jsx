import React, { useState, useEffect, useRef } from 'react';
import { STR } from './strings';

const BASE = import.meta.env.BASE_URL;
const u = (path) => `${BASE}uploads/${path}`;
const CHARS = [u('Character_1.png'), u('Character_2.png')];

const CheckBadge = () => (
  <div style={{position:'absolute',top:-7,right:-6,zIndex:2,width:22,height:22,borderRadius:'50%',background:'#7FE0A8',border:'2.5px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 5px rgba(74,59,50,.2)'}}>
    <div style={{width:8,height:4,borderLeft:'2.5px solid #fff',borderBottom:'2.5px solid #fff',transform:'rotate(-45deg)',marginBottom:2}}/>
  </div>
);

const ProductCard = ({ img, name, price, mission }) => (
  <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'#fff',borderRadius:13,padding:'7px 3px 6px',boxShadow:'0 3px 8px rgba(74,59,50,.1)',animation: mission ? 'glowpulse 2.2s ease-in-out infinite' : undefined}}>
    {mission && <CheckBadge />}
    <div style={{width:50,height:50,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <img src={img} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} alt="" />
    </div>
    <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:11,color:'#4A3B32',textAlign:'center',lineHeight:1.1}}>{name}</div>
    <div style={{marginTop:'auto',background:'#FFC94D',color:'#4A3B32',fontFamily:"'Nunito'",fontWeight:900,fontSize:15,padding:'0 8px',borderRadius:999}}>{price}</div>
  </div>
);

const CalcKey = ({ label, span, color, textColor, shadowColor }) => (
  <div style={{gridColumn: span ? `span ${span}` : undefined, background: color || '#fff', borderRadius:14, padding:'12px 0', textAlign:'center', fontFamily:"'Nunito'", fontWeight:900, fontSize:20, color: textColor || '#4A3B32', boxShadow:`0 3px 0 ${shadowColor || '#cfc6b4'}`}}>
    {label}
  </div>
);

export default function App() {
  const [screen, setScreen] = useState('home');
  const [lang, setLang] = useState('zhHant');
  const [langOpen, setLangOpen] = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const phoneRef = useRef(null);

  const T = STR[lang] || STR.zhHant;
  const charImg = CHARS[charIdx];

  useEffect(() => {
    const fit = () => {
      const el = phoneRef.current;
      if (!el) return;
      const s = Math.min((window.innerWidth - 32) / 390, (window.innerHeight - 32) / 810, 1.5);
      el.style.transform = `scale(${s})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const go = (s) => { setScreen(s); setLangOpen(false); };

  const optStyle = (l) => ({
    bg: lang === l ? '#FFF1EC' : '#fff',
    border: lang === l ? '#FF6F52' : '#E8E2D8',
    dot: lang === l ? '#FF6F52' : '#E8E2D8',
    check: lang === l,
  });
  const oH = optStyle('zhHant'), oS = optStyle('zhHans'), oE = optStyle('en');

  const Back = ({ onClick }) => (
    <div onClick={onClick} style={{position:'absolute',top:22,left:18,width:44,height:44,borderRadius:'50%',border:'2.5px solid #fff',background:'rgba(255,255,255,.8)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 10px rgba(74,59,50,.14)',zIndex:10}}>
      <div style={{width:12,height:12,borderLeft:'3px solid #6f6256',borderBottom:'3px solid #6f6256',transform:'rotate(45deg)',marginLeft:4}}/>
    </div>
  );

  return (
    <div style={{position:'fixed',inset:0,background:'#e7e5df',fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito',sans-serif",color:'#4A3B32',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <div ref={phoneRef} style={{position:'relative',width:390,height:810,flexShrink:0,transformOrigin:'center center'}}>

        {/* ===== HOME ===== */}
        {screen === 'home' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'#FFF6E6',boxShadow:'0 16px 44px rgba(74,50,50,.18)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:430,background:'linear-gradient(#BFE3F0 0%,#E3F1E6 60%,#FFF6E6 100%)',overflow:'hidden'}}>
              <img src={u("Store%20Exterior.png")} alt="store" style={{position:'absolute',left:'50%',top:197,transform:'translate(-50%,-50%)',width:589,height:386,filter:'drop-shadow(0 10px 18px rgba(74,59,50,.18))'}} />
              <div style={{position:'absolute',left:0,right:0,bottom:0,height:70,background:'linear-gradient(transparent,#FFF6E6)'}}/>
            </div>
            <div style={{position:'absolute',left:24,right:24,bottom:30,background:'#fff',border:'5px solid #fff',borderRadius:30,boxShadow:'0 14px 30px rgba(74,59,50,.18)',padding:'12px 24px 24px',textAlign:'center'}}>
              {/* character selector */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginBottom:6}}>
                <div onClick={() => setCharIdx((charIdx+1)%2)} style={{cursor:'pointer',flexShrink:0,width:42,height:42,borderRadius:'50%',border:'2.5px solid #fff',background:'#FFEDE6',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px rgba(74,59,50,.16)'}}>
                  <div style={{width:11,height:11,borderLeft:'3.5px solid #FF6F52',borderBottom:'3.5px solid #FF6F52',transform:'rotate(45deg)',marginLeft:4}}/>
                </div>
                <div style={{width:107,height:143,backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundSize:'contain',filter:'drop-shadow(0 6px 10px rgba(74,59,50,.18))',backgroundImage:`url('${charImg}')`}}/>
                <div onClick={() => setCharIdx((charIdx+1)%2)} style={{cursor:'pointer',flexShrink:0,width:42,height:42,borderRadius:'50%',border:'2.5px solid #fff',background:'#FFEDE6',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px rgba(74,59,50,.16)'}}>
                  <div style={{width:11,height:11,borderRight:'3.5px solid #FF6F52',borderTop:'3.5px solid #FF6F52',transform:'rotate(45deg)',marginRight:4}}/>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:'50%',background: charIdx===0 ? '#FF6F52' : '#E8D9CE'}}/>
                <div style={{width:8,height:8,borderRadius:'50%',background: charIdx===1 ? '#FF6F52' : '#E8D9CE'}}/>
              </div>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,color:'#4A3B32'}}>{T.homeGreeting}</div>
              <div style={{marginTop:20,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <div onClick={() => go('mission')} style={{cursor:'pointer',animation:'bob 2.4s ease-in-out infinite',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'4px solid #fff',borderRadius:24,padding:'17px 0',boxShadow:'0 7px 0 #E2512F,0 14px 22px rgba(74,59,50,.26)'}}>
                  <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:24,letterSpacing:2}}>{T.startShopping}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:12,marginTop:16}}>
                <div onClick={() => setLangOpen(true)} style={{cursor:'pointer',flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,border:'2.5px solid #E8E2D8',borderRadius:18,padding:'11px 0'}}>
                  <div style={{width:14,height:14,borderRadius:'50%',border:'3px solid #9a8a78'}}/>
                  <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:14,color:'#6f6256'}}>{T.settings}</span>
                </div>
                <div onClick={() => go('parent')} style={{cursor:'pointer',flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,border:'2.5px solid #E8E2D8',borderRadius:18,padding:'11px 0'}}>
                  <div style={{width:13,height:15,background:'#C9A6E0',borderRadius:'4px 4px 7px 7px'}}/>
                  <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:14,color:'#6f6256'}}>{T.parentShort}</span>
                </div>
              </div>
            </div>
            {/* lang picker overlay */}
            {langOpen && (
              <div style={{position:'absolute',inset:0,background:'rgba(74,59,50,.45)',display:'flex',alignItems:'center',justifyContent:'center',padding:'0 30px',backdropFilter:'blur(2px)'}}>
                <div style={{width:'100%',background:'#fff',border:'5px solid #fff',borderRadius:28,boxShadow:'0 18px 40px rgba(74,59,50,.3)',padding:'24px 22px 22px'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:18}}>
                    <div style={{width:16,height:16,borderRadius:'50%',border:'3px solid #FF6F52'}}/>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:20,color:'#4A3B32'}}>{T.chooseLang}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {[['zhHant','繁體中文',oH,"'Noto Sans TC'"],['zhHans','简体中文',oS,"'Noto Sans SC'"],['en','English',oE,"'Nunito'"]].map(([code,label,opt,font]) => (
                      <div key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',border:`3px solid ${opt.border}`,background:opt.bg,borderRadius:18,padding:'14px 18px'}}>
                        <span style={{fontFamily:font,fontWeight:800,fontSize:18,color:'#4A3B32'}}>{label}</span>
                        <div style={{width:22,height:22,borderRadius:'50%',background:opt.dot,display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {opt.check && <div style={{width:8,height:5,borderLeft:'2.5px solid #fff',borderBottom:'2.5px solid #fff',transform:'rotate(-45deg)',marginBottom:2}}/>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div onClick={() => setLangOpen(false)} style={{cursor:'pointer',marginTop:16,textAlign:'center',fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:800,fontSize:14,color:'#9a8a78',padding:'8px 0'}}>✕</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== MISSION ===== */}
        {screen === 'mission' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'#FFF6E6',boxShadow:'0 16px 44px rgba(74,59,50,.2)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:540,overflow:'hidden',background:'#fff'}}>
              <img src={u("Store%20Interior.png")} alt="store interior" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 28%',filter:'blur(1.5px)'}} />
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(255,246,230,.05),rgba(255,246,230,.5))'}}/>
            </div>
            <Back onClick={() => go('home')} />
            <div style={{position:'absolute',left:0,right:0,bottom:0,background:'#fff',borderRadius:'34px 34px 0 0',boxShadow:'0 -10px 30px rgba(74,59,50,.16)',padding:'30px 26px 30px'}}>
              <div style={{display:'flex',alignItems:'center',gap:18}}>
                <div style={{flexShrink:0,width:96,height:96,borderRadius:'50%',border:'4px solid #fff',background:`#FDF3D8 url('${charImg}') center -2px/118% no-repeat`,boxShadow:'0 8px 16px rgba(74,59,50,.16)'}}/>
                <div>
                  <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:12,letterSpacing:2,color:'#FF6F52',textTransform:'uppercase'}}>{T.missionLabel}</div>
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,lineHeight:1.3,color:'#4A3B32',marginTop:6}}>{T.missionTitle}</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:14}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:16,color:'#4A3B32'}}>{T.shoppingList}</span>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:900,fontSize:12,color:'#fff',background:'#FF8A52',borderRadius:999,padding:'2px 10px'}}>{T.missionCount}</span>
              </div>
              <div style={{display:'flex',gap:5,marginTop:10}}>
                {[
                  {img:u('1.2_%E6%A9%99%E6%B1%81.png'), name:T.itOrange, bg:'#F4FAFD'},
                  {img:u('2.1_%E8%96%AF%E7%89%87.png'), name:T.itChips, bg:'#FDF7EA'},
                  {img:u('3.1_%E6%A3%92%E6%A3%92%E7%B3%96.png'), name:T.itLolli, bg:'#F8F1FC'},
                  {img:u('4.2_%E9%9B%AA%E6%A2%9D.png'), name:T.itIcepop, bg:'#EFF8FA'},
                  {img:u('5.1_%E7%86%B1%E7%8B%97.png'), name:T.itHotdog, bg:'#FCEFE7'},
                ].map(({img,name,bg}) => (
                  <div key={img} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5,background:bg,border:'2px solid #fff',borderRadius:14,padding:'9px 3px 8px',boxShadow:'0 3px 8px rgba(74,59,50,.1)'}}>
                    <div style={{width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center'}}><img src={img} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} alt="" /></div>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:12,color:'#4A3B32',textAlign:'center',lineHeight:1.1}}>{name}</span>
                  </div>
                ))}
              </div>
              <div onClick={() => go('nav')} style={{cursor:'pointer',marginTop:24,animation:'bob 2.6s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'4px solid #fff',borderRadius:26,padding:'18px 0',boxShadow:'0 8px 0 #E2512F,0 15px 22px rgba(74,59,50,.24)'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:24,letterSpacing:2}}>{T.go}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== STORE NAVIGATION ===== */}
        {screen === 'nav' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'linear-gradient(#EAF6FB,#FFF6E6 60%)',boxShadow:'0 16px 44px rgba(74,59,50,.2)'}}>
            {/* top bar */}
            <div style={{position:'absolute',top:24,left:18,right:18,display:'flex',alignItems:'center',gap:10,zIndex:10}}>
              <div onClick={() => go('home')} style={{flexShrink:0,width:44,height:44,borderRadius:'50%',border:'2.5px solid #c9bda8',background:'rgba(255,255,255,.7)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <div style={{width:12,height:12,borderLeft:'3px solid #6f6256',borderBottom:'3px solid #6f6256',transform:'rotate(45deg)',marginLeft:4}}/>
              </div>
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#fff',border:'2.5px solid #fff',borderRadius:999,padding:'9px 14px',boxShadow:'0 5px 12px rgba(74,59,50,.14)'}}>
                <div style={{width:14,height:14,borderRadius:'50%',background:'#FF6F52'}}/>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:14,color:'#4A3B32',whiteSpace:'nowrap'}}>{T.shoppingList}</span>
              </div>
              <div style={{flexShrink:0,position:'relative',width:48,height:48,borderRadius:16,background:'#fff',border:'3px solid #fff',boxShadow:'0 5px 12px rgba(74,59,50,.14)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{width:22,height:16,borderRadius:'0 0 7px 7px',background:'#FF8A52',position:'relative'}}>
                  <div style={{position:'absolute',left:'50%',top:-7,transform:'translateX(-50%)',width:14,height:9,border:'3px solid #FF8A52',borderBottom:'none',borderRadius:'8px 8px 0 0'}}/>
                </div>
                <div style={{position:'absolute',top:-7,right:-7,width:24,height:24,borderRadius:'50%',background:'#FF6F52',border:'2.5px solid #fff',color:'#fff',fontFamily:"'Nunito'",fontWeight:900,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>1</div>
              </div>
            </div>

            {/* task checklist strip */}
            <div style={{position:'absolute',top:78,left:18,right:18,zIndex:5,background:'#fff',border:'2.5px solid #fff',borderRadius:18,padding:'7px 9px',boxShadow:'0 6px 16px rgba(74,59,50,.16)',display:'flex',alignItems:'center',gap:7}}>
              <span style={{flexShrink:0,maxWidth:48,fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:12,color:'#FF6F52',lineHeight:1.05,textAlign:'center'}}>{T.listToBuy}</span>
              <div style={{flex:1,display:'flex',gap:5,minWidth:0}}>
                {[
                  {img:u('1.2_%E6%A9%99%E6%B1%81.png'), bg:'#E3F3FA', checked:true, border:''},
                  {img:u('2.1_%E8%96%AF%E7%89%87.png'), bg:'#FFF3D6', checked:false, border:'#E9D6A8'},
                  {img:u('3.1_%E6%A3%92%E6%A3%92%E7%B3%96.png'), bg:'#F4EAFB', checked:false, border:'#D9C2E8'},
                  {img:u('4.2_%E9%9B%AA%E6%A2%9D.png'), bg:'#E7F4F7', checked:false, border:'#BBD9E2'},
                  {img:u('5.1_%E7%86%B1%E7%8B%97.png'), bg:'#FDECE2', checked:false, border:'#EEC4AC'},
                ].map(({img,bg,checked,border},i) => (
                  <div key={i} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:3,background:bg,borderRadius:11,padding:'5px 4px',minWidth:0}}>
                    <div style={{flexShrink:0,width:24,height:24,borderRadius:7,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      <img src={img} style={{width:20,height:20,objectFit:'contain'}} alt="" />
                    </div>
                    <div style={{flexShrink:0,width:15,height:15,borderRadius:'50%',background: checked ? '#7FE0A8' : 'transparent',border: checked ? 'none' : `2px solid ${border}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {checked && <div style={{width:6,height:3,borderLeft:'2px solid #fff',borderBottom:'2px solid #fff',transform:'rotate(-45deg)',marginBottom:1}}/>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* scrollable zones */}
            <div style={{position:'absolute',top:150,left:0,right:0,bottom:96,overflowY:'auto',padding:'6px 16px 16px',display:'flex',flexDirection:'column',gap:14}}>
              {[
                {bg:'#E3F3FA',icon:u('1_%E9%A3%B2%E6%96%99%E5%8D%80.png'),label:T.zDrinks,color:'#2d6f8c',items:[
                  {img:u('1.1_%E7%A4%A6%E6%B3%89%E6%B0%B4.png'),name:T.pWater,price:'$10'},
                  {img:u('1.2_%E6%A9%99%E6%B1%81.png'),name:T.pOrange,price:'$15',mission:true},
                  {img:u('1.3_%E7%89%9B%E5%A5%B6.png'),name:T.pMilk,price:'$12'},
                  {img:u('1.4_%E6%9E%9C%E6%B1%81%E7%9B%92.png'),name:T.pJuiceBox,price:'$8'},
                ]},
                {bg:'#FFF3D6',icon:u('2_%E9%9B%B6%E9%A3%9F%E5%8D%80.png'),label:T.zSnacks,color:'#7a5a14',items:[
                  {img:u('2.1_%E8%96%AF%E7%89%87.png'),name:T.pChips,price:'$20',mission:true},
                  {img:u('2.2_%E9%A4%85%E4%B9%BE.png'),name:T.pBiscuit,price:'$18'},
                  {img:u('2.3_%E7%88%86%E7%B1%B3%E8%8A%B1.png'),name:T.pPopcorn,price:'$25'},
                  {img:u('2.4_%E7%99%BE%E5%8A%9B%E6%BB%8B.png'),name:T.pPretzel,price:'$15'},
                ]},
                {bg:'#F4EAFB',icon:u('3_%E7%B3%96%E6%9E%9C%E5%8D%80.png'),label:T.zCandy,color:'#5e3d7a',items:[
                  {img:u('3.1_%E6%A3%92%E6%A3%92%E7%B3%96.png'),name:T.pLolli,price:'$5'},
                  {img:u('3.2_%E6%B0%B4%E6%9E%9C%E7%B3%96.png'),name:T.pFruitCandy,price:'$12'},
                  {img:u('3.3_%E8%BB%9F%E7%B3%96.png'),name:T.pGummy,price:'$20'},
                  {img:u('3.4_%E5%B7%A7%E5%85%8B%E5%8A%9B.png'),name:T.pChoco,price:'$25'},
                ]},
                {bg:'#E9F6F9',icon:u('4_%E5%86%B7%E5%87%8D%E5%8D%80.png'),label:T.zFrozen,color:'#3a7d92',items:[
                  {img:u('4.1_%E9%9B%AA%E7%B3%95%E6%9D%AF.png'),name:T.pIceCup,price:'$22'},
                  {img:u('4.2_%E9%9B%AA%E6%A2%9D.png'),name:T.pIcepop,price:'$10'},
                  {img:u('4.3_%E5%86%B7%E5%87%8D%E8%96%84%E9%A4%85.png'),name:T.pFrozenPizza,price:'$35'},
                  {img:u('4.4_%E5%86%B7%E5%87%8D%E9%BB%9E%E5%BF%83.png'),name:T.pFrozenDim,price:'$30'},
                ]},
                {bg:'#FFEDE2',icon:u('5_%E7%86%B1%E9%A3%9F%E5%8D%80.png'),label:T.zHot,color:'#c2461f',items:[
                  {img:u('5.1_%E7%86%B1%E7%8B%97.png'),name:T.pHotdog,price:'$25'},
                  {img:u('5.2_%E5%8C%85%E9%BB%9E.png'),name:T.pBun,price:'$12'},
                  {img:u('5.3_%E9%97%9C%E6%9D%B1%E7%85%AE.png'),name:T.pOden,price:'$30'},
                  {img:u('5.4_%E7%82%B8%E9%9B%9E%E5%A1%8A.png'),name:T.pNuggets,price:'$28'},
                ]},
              ].map(zone => (
                <div key={zone.label} style={{background:zone.bg,border:'2.5px solid #fff',borderRadius:20,padding:'10px 12px 12px',boxShadow:'0 4px 12px rgba(74,59,50,.08)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
                    <div style={{width:36,height:36,borderRadius:10,background:'#fff',boxShadow:'0 2px 5px rgba(74,59,50,.12)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      <img src={zone.icon} style={{width:32,height:32,objectFit:'contain'}} alt="" />
                    </div>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:17,color:zone.color}}>{zone.label}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                    {zone.items.map(item => (
                      <ProductCard key={item.img} img={item.img} name={item.name} price={item.price} mission={item.mission} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* bottom bar */}
            <div style={{position:'absolute',left:0,right:0,bottom:30,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',zIndex:10}}>
              <div style={{width:54,height:54,borderRadius:'50%',background:'#fff',border:'3px solid #fff',boxShadow:'0 6px 14px rgba(74,59,50,.16)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <div style={{width:14,height:14,borderLeft:'4px solid #FF6F52',borderBottom:'4px solid #FF6F52',transform:'rotate(45deg)',marginLeft:4}}/>
              </div>
              <div onClick={() => go('cart')} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#7FE0A8,#5FCB8E)',color:'#225c40',border:'4px solid #fff',borderRadius:22,padding:'13px 30px',boxShadow:'0 6px 0 #3FA56E,0 12px 18px rgba(74,59,50,.2)'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:19}}>{T.checkout}</span>
              </div>
              <div style={{width:54,height:54,borderRadius:'50%',background:'#fff',border:'3px solid #fff',boxShadow:'0 6px 14px rgba(74,59,50,.16)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <div style={{width:14,height:14,borderRight:'4px solid #FF6F52',borderTop:'4px solid #FF6F52',transform:'rotate(45deg)',marginRight:4}}/>
              </div>
            </div>
          </div>
        )}

        {/* ===== CART ===== */}
        {screen === 'cart' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'#FFF6E6',boxShadow:'0 16px 44px rgba(74,59,50,.2)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:128,background:'linear-gradient(#BFE6C5,#A8D9B2)',display:'flex',alignItems:'center',gap:14,padding:'0 22px'}}>
              <div style={{flexShrink:0,width:72,height:72,borderRadius:'50%',border:'3px solid #fff',background:`#E6F4EA url('${charImg}') center -2px/118% no-repeat`,boxShadow:'0 5px 12px rgba(74,59,50,.16)'}}/>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,color:'#2f5a3c'}}>{T.cartTitle}</div>
            </div>
            {/* 5-item row */}
            <div style={{position:'absolute',top:138,left:18,right:18,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:7}}>
              {[
                {img:u('1.2_%E6%A9%99%E6%B1%81.png'),name:T.itOrange,price:'$15',bg:'#EAF4FA'},
                {img:u('2.1_%E8%96%AF%E7%89%87.png'),name:T.itChips,price:'$20',bg:'#FBF3DE'},
                {img:u('3.1_%E6%A3%92%E6%A3%92%E7%B3%96.png'),name:T.itLolli,price:'$5',bg:'#F6EEFB'},
                {img:u('4.2_%E9%9B%AA%E6%A2%9D.png'),name:T.itIcepop,price:'$10',bg:'#EAF7FA'},
                {img:u('5.1_%E7%86%B1%E7%8B%97.png'),name:T.itHotdog,price:'$25',bg:'#FBEEE6'},
              ].map(({img,name,price,bg}) => (
                <div key={img} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'#fff',border:'3px solid #fff',borderRadius:16,padding:'9px 4px 8px',boxShadow:'0 5px 12px rgba(74,59,50,.1)'}}>
                  <div style={{width:44,height:44,borderRadius:12,background:bg,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    <img src={img} style={{width:36,height:36,objectFit:'contain'}} alt="" />
                  </div>
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:12,color:'#4A3B32',textAlign:'center',lineHeight:1.1}}>{name}</div>
                  <div style={{marginTop:'auto',fontFamily:"'Nunito'",fontWeight:900,fontSize:18,color:'#4A3B32'}}>{price}</div>
                </div>
              ))}
            </div>
            {/* calculator */}
            <div style={{position:'absolute',bottom:166,left:24,right:24,background:'linear-gradient(#EFE9DD,#E2DBCB)',border:'4px solid #fff',borderRadius:26,padding:16,boxShadow:'0 14px 30px rgba(74,59,50,.22)'}}>
              <div style={{background:'#3a4a3f',borderRadius:14,padding:'10px 16px',textAlign:'right',marginBottom:12,boxShadow:'inset 0 2px 6px rgba(0,0,0,.3)'}}>
                <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:30,color:'#9fe8bd',letterSpacing:1}}>75</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
                <CalcKey label="7"/><CalcKey label="8"/><CalcKey label="9"/>
                <CalcKey label="C" color="#FFC94D" textColor="#7a5a14" shadowColor="#E2A52F"/>
                <CalcKey label="4"/><CalcKey label="5"/><CalcKey label="6"/>
                <CalcKey label="−" color="#C9A6E0" textColor="#fff" shadowColor="#9F73C0"/>
                <CalcKey label="1"/><CalcKey label="2"/><CalcKey label="3"/>
                <CalcKey label="×" color="#C9A6E0" textColor="#fff" shadowColor="#9F73C0"/>
                <CalcKey label="0" span={2}/>
                <CalcKey label="."/>
                <CalcKey label="=" color="#7FE0A8" textColor="#225c40" shadowColor="#3FA56E"/>
              </div>
            </div>
            <div onClick={() => go('payment')} style={{cursor:'pointer',position:'absolute',bottom:58,left:24,right:24,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',border:'4px solid #fff',borderRadius:22,padding:'15px 0',boxShadow:'0 6px 0 #E2512F,0 12px 18px rgba(74,59,50,.22)'}}>
              <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:20,color:'#fff',letterSpacing:2}}>{T.confirmAmount}</span>
            </div>
          </div>
        )}

        {/* ===== PAYMENT ===== */}
        {screen === 'payment' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'#FFF6E6',boxShadow:'0 16px 44px rgba(74,59,50,.2)'}}>
            {/* receipt */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:128,background:'linear-gradient(#FF8468,#FF6F52)',padding:'16px 22px',color:'#fff'}}>
              {[
                {name:T.itOrange,price:'$15'},{name:T.itChips,price:'$20'},
                {name:T.itLolli,price:'$5'},{name:T.itIcepop,price:'$10'},{name:T.itHotdog,price:'$25'},
              ].map(({name,price}) => (
                <div key={name} style={{display:'flex',justifyContent:'space-between',fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:12,opacity:.92,marginTop:2}}>
                  <span>{name} {T.unit}</span><span>{price}</span>
                </div>
              ))}
              <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginTop:8,borderTop:'2px dashed rgba(255,255,255,.5)',paddingTop:8}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:18}}>{T.amountDue}</span>
                <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:34,letterSpacing:1}}>$75</span>
              </div>
            </div>
            {/* tray */}
            <div style={{position:'absolute',top:128,left:0,right:0,height:250,background:'#FFF6E6',padding:'16px 22px'}}>
              <div style={{position:'relative',height:120,borderRadius:22,background:'linear-gradient(#D9B98A,#C49B68)',border:'4px solid #E7CEA6',boxShadow:'inset 0 4px 10px rgba(74,40,10,.18)',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
                <div style={{position:'absolute',top:8,left:14,fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontSize:10,fontWeight:700,color:'#fff8ec',opacity:.85,letterSpacing:1}}>{T.trayLabel}</div>
                <img src={u("%24100.png")} style={{width:96,height:'auto',transform:'rotate(-5deg)',filter:'drop-shadow(0 4px 8px rgba(74,59,50,.25))'}} alt="$100" />
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14}}>
                <div style={{display:'flex',flexDirection:'column'}}>
                  <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:13,color:'#8a7c6c'}}>{T.paidIn}</span>
                  <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:26,color:'#4A3B32'}}>$100</span>
                </div>
                <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#7FE0A8',border:'3px solid #fff',borderRadius:999,padding:'9px 18px',boxShadow:'0 5px 12px rgba(74,59,50,.16)'}}>
                  <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:16,color:'#225c40'}}>{T.change}</span>
                  <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:24,color:'#225c40'}}>$25</span>
                </div>
              </div>
            </div>
            {/* wallet */}
            <div style={{position:'absolute',top:378,left:0,right:0,bottom:0,background:'linear-gradient(#F3ECDD,#E8E2D8)',borderRadius:'30px 30px 0 0',padding:'18px 22px 22px',boxShadow:'0 -8px 22px rgba(74,59,50,.12)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:18,color:'#4A3B32'}}>{T.wallet}</span>
                <div onClick={() => go('success')} style={{cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6,background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'2.5px solid #fff',borderRadius:999,padding:'7px 16px',boxShadow:'0 4px 10px rgba(74,59,50,.2)'}}>
                  <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:14}}>{T.takeChange}</span>
                  <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:14}}>→</span>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px 14px'}}>
                {[{src:u('%24100.png'),qty:'×2'},{src:u('%2450.png'),qty:'×2'},{src:u('%2420.png'),qty:'×3'},{src:u('%2410.png'),qty:'×4'}].map(({src,qty}) => (
                  <div key={src} style={{position:'relative',cursor:'pointer'}}>
                    <img src={src} style={{width:'100%',height:'auto',display:'block',filter:'drop-shadow(0 4px 8px rgba(74,59,50,.18))'}} alt="" />
                    <span style={{position:'absolute',top:-5,right:-5,fontFamily:"'Nunito'",fontWeight:900,fontSize:11,color:'#fff',background:'#4A3B32',border:'2px solid #fff',borderRadius:999,padding:'1px 7px'}}>{qty}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:18,marginTop:14,justifyContent:'center'}}>
                {[{src:u('%245.png'),qty:'×4'},{src:u('%242.png'),qty:'×5'},{src:u('%241.png'),qty:'×5'}].map(({src,qty}) => (
                  <div key={src} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                    <img src={src} style={{width:62,height:'auto',display:'block',cursor:'pointer',filter:'drop-shadow(0 4px 8px rgba(74,59,50,.2))'}} alt="" />
                    <span style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,color:'#9a8a78'}}>{qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== SUCCESS ===== */}
        {screen === 'success' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'linear-gradient(#BFE3F0 0%,#FFE9C2 55%,#BFE6C5 100%)',boxShadow:'0 16px 44px rgba(74,59,50,.2)'}}>
            <div style={{position:'absolute',top:40,left:46,width:80,height:80,borderRadius:'50%',background:'radial-gradient(circle at 40% 38%,#FFE9A8,#FFC94D)',boxShadow:'0 0 44px 14px rgba(255,201,77,.4)'}}/>
            {[
              {top:60,left:40,w:10,color:'#FF6F52',br:2},
              {top:100,right:60,w:9,color:'#C9A6E0',br:'50%'},
              {top:150,left:90,w:8,color:'#7FE0A8',br:0},
              {top:120,right:120,w:10,color:'#5BB6E0',br:2},
            ].map((s,i) => (
              <div key={i} style={{position:'absolute',top:s.top,left:s.left,right:s.right,width:s.w,height:s.w,background:s.color,borderRadius:s.br,animation:`twinkle ${2.4+i*.3}s ease-in-out infinite`}}/>
            ))}
            <div style={{position:'absolute',top:70,left:0,right:0,display:'flex',justifyContent:'center'}}>
              <img src={u("Great%20Job.png")} alt="Great Job!" style={{width:300,height:'auto',filter:'drop-shadow(0 12px 20px rgba(74,59,50,.22))',animation:'bob 3s ease-in-out infinite'}} />
            </div>
            <div style={{position:'absolute',top:392,left:24,right:24,background:'#fff',border:'5px solid #fff',borderRadius:24,padding:18,boxShadow:'0 12px 26px rgba(74,59,50,.18)'}}>
              <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:12}}>
                {[
                  {img:u('1.2_%E6%A9%99%E6%B1%81.png'),bg:'#EAF4FA'},
                  {img:u('2.1_%E8%96%AF%E7%89%87.png'),bg:'#FBF3DE'},
                  {img:u('3.1_%E6%A3%92%E6%A3%92%E7%B3%96.png'),bg:'#F6EEFB'},
                  {img:u('4.2_%E9%9B%AA%E6%A2%9D.png'),bg:'#EAF7FA'},
                  {img:u('5.1_%E7%86%B1%E7%8B%97.png'),bg:'#FBEEE6'},
                ].map(({img,bg}) => (
                  <div key={img} style={{width:46,height:46,borderRadius:12,background:bg,border:'2.5px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    <img src={img} style={{width:38,height:38,objectFit:'contain'}} alt="" />
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'2px dashed #E8E2D8'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:15,color:'#8a7c6c'}}>{T.paid}</span>
                <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:20,color:'#4A3B32'}}>$100</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'2px dashed #E8E2D8'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:15,color:'#8a7c6c'}}>{T.change}</span>
                <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:20,color:'#3FA56E'}}>$25</span>
              </div>
            </div>
            <div style={{position:'absolute',bottom:28,left:24,right:24,display:'flex',flexDirection:'column',gap:12}}>
              <div onClick={() => go('home')} style={{cursor:'pointer',animation:'bob 2.6s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'4px solid #fff',borderRadius:24,padding:'16px 0',boxShadow:'0 7px 0 #E2512F,0 14px 20px rgba(74,59,50,.24)'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,letterSpacing:2}}>{T.playAgain}</span>
              </div>
              <div onClick={() => go('home')} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',border:'3px solid #c9bda8',borderRadius:22,padding:'12px 0'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:18,color:'#6f6256'}}>{T.backHome}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== PARENT DASHBOARD ===== */}
        {screen === 'parent' && (
          <div style={{width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',background:'#F5F2EC',boxShadow:'0 16px 44px rgba(74,59,50,.2)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,padding:'24px 24px 18px',background:'#fff',borderBottom:'1px solid #ECE7DE'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div onClick={() => go('home')} style={{cursor:'pointer',width:38,height:38,borderRadius:12,background:'#F0EDE6',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:11,height:11,borderLeft:'3px solid #6f6256',borderBottom:'3px solid #6f6256',transform:'rotate(45deg)',marginLeft:3}}/>
                </div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,color:'#4A3B32'}}>{T.parentTitle}</div>
              </div>
            </div>
            <div style={{position:'absolute',top:112,left:24,right:24,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:10}}>{T.latestSession}</div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div><div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:13,color:'#4A3B32'}}>Jun 18</div><div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.pDate}</div></div>
                <div><div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:13,color:'#4A3B32'}}>6 min</div><div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.pDuration}</div></div>
                <div><div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:800,fontSize:13,color:'#4A3B32'}}>{T.levelIntermediate}</div><div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.pLevel}</div></div>
              </div>
            </div>
            <div style={{position:'absolute',top:236,left:24,right:24,display:'flex',gap:12}}>
              <div style={{flex:1,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16,textAlign:'center'}}>
                <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:34,color:'#3FA56E',lineHeight:1}}>92<span style={{fontSize:18}}>%</span></div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:13,color:'#6f6256',marginTop:6}}>{T.calcAccuracy}</div>
              </div>
              <div style={{flex:1,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16,textAlign:'center'}}>
                <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:34,color:'#E0992F',lineHeight:1}}>78<span style={{fontSize:18}}>%</span></div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:13,color:'#6f6256',marginTop:6}}>{T.payAccuracy}</div>
              </div>
            </div>
            <div style={{position:'absolute',top:372,left:24,right:24,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:14}}>{T.confusedDenoms}</div>
              <div style={{display:'flex',flexDirection:'column',gap:11}}>
                {[{label:'$50',w:'80%',color:'#FF8A52',count:'8×'},{label:'$5',w:'55%',color:'#FFC94D',count:'5×'},{label:'$1',w:'30%',color:'#C9A6E0',count:'3×'}].map(({label,w,color,count}) => (
                  <div key={label} style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{width:42,fontFamily:"'Nunito'",fontWeight:900,fontSize:13,color:'#4A3B32'}}>{label}</span>
                    <div style={{flex:1,height:10,borderRadius:999,background:'#F0EDE6',overflow:'hidden'}}>
                      <div style={{width:w,height:'100%',background:color,borderRadius:999}}/>
                    </div>
                    <span style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,color:'#9a8a78'}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{position:'absolute',top:556,left:24,right:24,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:14}}>{T.stampHistory}</div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                {[{color:'#3FA56E',label:'W1'},{color:'#3FA56E',label:'W2'},{color:'#7FE0A8',label:'W3'},{color:null,label:'W4'}].map(({color,label},i) => (
                  <React.Fragment key={label}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                      <div style={{width:26,height:26,borderRadius:'50%',background: color || '#EFEAE0',border: color ? undefined : '2px dashed #cfc6b4'}}/>
                      <span style={{fontFamily:"'Nunito'",fontWeight:700,fontSize:10,color:'#9a8a78'}}>{label}</span>
                    </div>
                    {i < 3 && <div style={{flex:1,height:3,background:'#E5E0D6'}}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{position:'absolute',bottom:28,left:24,right:24,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:14,color:'#4A3B32'}}>{T.digestTitle}</div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.digestSub}</div>
              </div>
              <div style={{width:52,height:30,borderRadius:999,background:'#3FA56E',position:'relative'}}>
                <div style={{position:'absolute',top:3,right:3,width:24,height:24,borderRadius:'50%',background:'#fff',boxShadow:'0 2px 4px rgba(0,0,0,.2)'}}/>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
