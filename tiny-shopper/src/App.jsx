import React, { useState, useEffect, useRef } from 'react';
import { STR } from './strings';

const BASE = import.meta.env.BASE_URL;
const u = p => `${BASE}uploads/${p}`;

// ── Sound ────────────────────────────────────────────────────────────────────
function beep(type) {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const master = ac.createGain();
    master.connect(ac.destination);
    if (type === 'click') {
      const o = ac.createOscillator();
      o.connect(master); o.type = 'sine'; o.frequency.value = 700;
      master.gain.setValueAtTime(0.12, ac.currentTime);
      master.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      o.start(); o.stop(ac.currentTime + 0.08);
    } else if (type === 'coin') {
      const o = ac.createOscillator();
      o.connect(master); o.type = 'triangle'; o.frequency.value = 1100;
      master.gain.setValueAtTime(0.18, ac.currentTime);
      master.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      o.start(); o.stop(ac.currentTime + 0.18);
    } else if (type === 'error') {
      const o = ac.createOscillator();
      o.connect(master); o.type = 'sawtooth'; o.frequency.value = 160;
      master.gain.setValueAtTime(0.18, ac.currentTime);
      master.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
      o.start(); o.stop(ac.currentTime + 0.35);
    } else if (type === 'success') {
      [523, 659, 784, 1047].forEach((f, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.type = 'sine'; o.frequency.value = f;
        const t = ac.currentTime + i * 0.12;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t); o.stop(t + 0.3);
      });
    }
  } catch (_) {}
}

// ── Constants ─────────────────────────────────────────────────────────────────
const CHARS = [u('Character_1.png'), u('Character_2.png')];

const DIMG = {
  100: u('%24100.png'), 50: u('%2450.png'), 20: u('%2420.png'),
  10:  u('%2410.png'),  5:  u('%245.png'),  2:  u('%242.png'),  1: u('%241.png'),
};
const DENOMS = [100, 50, 20, 10, 5, 2, 1];
const W0 = { 100:2, 50:3, 20:4, 10:5, 5:4, 2:5, 1:5 };
const T0 = { 100:0, 50:0, 20:0, 10:0, 5:0, 2:0, 1:0 };

const POOL = [
  { id:'water',       key:'pWater',       price:10, zone:'drinks', bg:'#E3F3FA', img:u('1.1_%E7%A4%A6%E6%B3%89%E6%B0%B4.png') },
  { id:'orange',      key:'pOrange',      price:15, zone:'drinks', bg:'#E3F3FA', img:u('1.2_%E6%A9%99%E6%B1%81.png') },
  { id:'milk',        key:'pMilk',        price:12, zone:'drinks', bg:'#E3F3FA', img:u('1.3_%E7%89%9B%E5%A5%B6.png') },
  { id:'juiceBox',    key:'pJuiceBox',    price:8,  zone:'drinks', bg:'#E3F3FA', img:u('1.4_%E6%9E%9C%E6%B1%81%E7%9B%92.png') },
  { id:'chips',       key:'pChips',       price:20, zone:'snacks', bg:'#FFF3D6', img:u('2.1_%E8%96%AF%E7%89%87.png') },
  { id:'biscuit',     key:'pBiscuit',     price:18, zone:'snacks', bg:'#FFF3D6', img:u('2.2_%E9%A4%85%E4%B9%BE.png') },
  { id:'popcorn',     key:'pPopcorn',     price:25, zone:'snacks', bg:'#FFF3D6', img:u('2.3_%E7%88%86%E7%B1%B3%E8%8A%B1.png') },
  { id:'pretzel',     key:'pPretzel',     price:15, zone:'snacks', bg:'#FFF3D6', img:u('2.4_%E7%99%BE%E5%8A%9B%E6%BB%8B.png') },
  { id:'lolli',       key:'pLolli',       price:5,  zone:'candy',  bg:'#F4EAFB', img:u('3.1_%E6%A3%92%E6%A3%92%E7%B3%96.png') },
  { id:'fruitCandy',  key:'pFruitCandy',  price:12, zone:'candy',  bg:'#F4EAFB', img:u('3.2_%E6%B0%B4%E6%9E%9C%E7%B3%96.png') },
  { id:'gummy',       key:'pGummy',       price:20, zone:'candy',  bg:'#F4EAFB', img:u('3.3_%E8%BB%9F%E7%B3%96.png') },
  { id:'choco',       key:'pChoco',       price:25, zone:'candy',  bg:'#F4EAFB', img:u('3.4_%E5%B7%A7%E5%85%8B%E5%8A%9B.png') },
  { id:'iceCup',      key:'pIceCup',      price:22, zone:'frozen', bg:'#E9F6F9', img:u('4.1_%E9%9B%AA%E7%B3%95%E6%9D%AF.png') },
  { id:'icepop',      key:'pIcepop',      price:10, zone:'frozen', bg:'#E9F6F9', img:u('4.2_%E9%9B%AA%E6%A2%9D.png') },
  { id:'frozenPizza', key:'pFrozenPizza', price:35, zone:'frozen', bg:'#E9F6F9', img:u('4.3_%E5%86%B7%E5%87%8D%E8%96%84%E9%A4%85.png') },
  { id:'frozenDim',   key:'pFrozenDim',   price:30, zone:'frozen', bg:'#E9F6F9', img:u('4.4_%E5%86%B7%E5%87%8D%E9%BB%9E%E5%BF%83.png') },
  { id:'hotdog',      key:'pHotdog',      price:25, zone:'hot',    bg:'#FFEDE2', img:u('5.1_%E7%86%B1%E7%8B%97.png') },
  { id:'bun',         key:'pBun',         price:12, zone:'hot',    bg:'#FFEDE2', img:u('5.2_%E5%8C%85%E9%BB%9E.png') },
  { id:'oden',        key:'pOden',        price:30, zone:'hot',    bg:'#FFEDE2', img:u('5.3_%E9%97%9C%E6%9D%B1%E7%85%AE.png') },
  { id:'nuggets',     key:'pNuggets',     price:28, zone:'hot',    bg:'#FFEDE2', img:u('5.4_%E7%82%B8%E9%9B%9E%E5%A1%8A.png') },
];

const ZONES = [
  { id:'drinks', zKey:'zDrinks', bg:'#E3F3FA', color:'#2d6f8c', icon:u('1_%E9%A3%B2%E6%96%99%E5%8D%80.png') },
  { id:'snacks', zKey:'zSnacks', bg:'#FFF3D6', color:'#7a5a14', icon:u('2_%E9%9B%B6%E9%A3%9F%E5%8D%80.png') },
  { id:'candy',  zKey:'zCandy',  bg:'#F4EAFB', color:'#5e3d7a', icon:u('3_%E7%B3%96%E6%9E%9C%E5%8D%80.png') },
  { id:'frozen', zKey:'zFrozen', bg:'#E9F6F9', color:'#3a7d92', icon:u('4_%E5%86%B7%E5%87%8D%E5%8D%80.png') },
  { id:'hot',    zKey:'zHot',    bg:'#FFEDE2', color:'#c2461f', icon:u('5_%E7%86%B1%E9%A3%9F%E5%8D%80.png') },
];

const EXTRA_CSS = `
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
@keyframes popIn{0%{transform:scale(.7);opacity:.5}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes glowTray{0%,100%{box-shadow:0 0 0 0 rgba(127,224,168,0)}50%{box-shadow:0 0 0 16px rgba(127,224,168,.45)}}
`;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const phoneRef = useRef(null);
  const sfxRef   = useRef({});

  // Load audio files once after mount
  useEffect(() => {
    const p = `${BASE}sfx/`;
    sfxRef.current = {
      calcButton: new Audio(p + 'SFX_Calculator_Button.mp3'),
      confirm:    new Audio(p + 'SFX_Confirm.mp3'),
      completion: new Audio(p + 'SFX_Game_Completion.mp3'),
      gameStart:  new Audio(p + 'SFX_Game_Start.mp3'),
      remove:     new Audio(p + 'SFX_Remove.mp3'),
    };
  }, []);

  const play = name => {
    try {
      const a = sfxRef.current[name];
      if (a) { a.currentTime = 0; a.play().catch(() => {}); }
    } catch (_) {}
  };

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = EXTRA_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

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

  // ── UI state
  const [screen,   setScreen]   = useState('home');
  const [lang,     setLang]     = useState('zhHant');
  const [langOpen, setLangOpen] = useState(false);
  const [charIdx,  setCharIdx]  = useState(0);

  // ── Game state
  const [missionItems,  setMissionItems]  = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [amountDue,     setAmountDue]     = useState(0);

  // ── Calculator state
  const [calcDisp,  setCalcDisp]  = useState('0');
  const [calcPrev,  setCalcPrev]  = useState(null);
  const [calcOp,    setCalcOp]    = useState(null);
  const [calcFresh, setCalcFresh] = useState(false);
  const [calcShake, setCalcShake] = useState(false);
  const [calcGlow,  setCalcGlow]  = useState(false);
  const [calcTries, setCalcTries] = useState(0);

  // ── Payment state
  const [wallet,      setWallet]      = useState({ ...W0 });
  const [tray,        setTray]        = useState({ ...T0 });
  const [payDone,     setPayDone]     = useState(false);
  const [confusedD,   setConfusedD]   = useState({});
  const [payMistakes, setPayMistakes] = useState(0);

  // ── Session tracking
  const [sessions,  setSessions]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_sessions') || '[]'); } catch { return []; }
  });
  const [sessStart, setSessStart] = useState(null);

  // Play completion fanfare whenever success screen appears
  useEffect(() => {
    if (screen === 'success') play('completion');
  }, [screen]);

  // ── Derived values (re-computed every render)
  const T           = STR[lang] || STR.zhHant;
  const items       = POOL.map(p => ({ ...p, name: T[p.key] }));
  const charImg     = CHARS[charIdx];
  const correctTotal = selectedItems.reduce((s, i) => s + i.price, 0);
  const payTotal    = DENOMS.reduce((s, d) => s + d * (tray[d] || 0), 0);
  const change      = payTotal - amountDue;
  const missionDone = missionItems.length > 0 &&
    missionItems.every(mi => selectedItems.some(si => si.id === mi.id));

  // ── Navigation
  const go = s => { setScreen(s); setLangOpen(false); };

  // ── Start / restart a round
  const startGame = () => {
    play('gameStart');
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const cnt = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
    setMissionItems(shuffled.slice(0, cnt));
    setSelectedItems([]);
    setCalcDisp('0'); setCalcPrev(null); setCalcOp(null); setCalcFresh(false);
    setCalcShake(false); setCalcGlow(false); setCalcTries(0);
    setAmountDue(0);
    setWallet({ ...W0 }); setTray({ ...T0 }); setPayDone(false);
    setConfusedD({}); setPayMistakes(0);
    setSessStart(Date.now());
    go('mission');
  };

  // ── Store item toggle
  const toggleItem = item => {
    const removing = selectedItems.some(i => i.id === item.id);
    play(removing ? 'remove' : 'calcButton');
    setSelectedItems(prev =>
      removing ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  // ── Calculator
  const handleCalc = key => {
    if (calcGlow || calcShake) return;
    play('calcButton');

    if (key === 'C') {
      setCalcDisp('0'); setCalcPrev(null); setCalcOp(null); setCalcFresh(false);
      return;
    }

    if (key === '=') {
      let result = parseFloat(calcDisp) || 0;
      if (calcPrev !== null && calcOp) {
        const a = parseFloat(calcPrev) || 0;
        const b = parseFloat(calcDisp) || 0;
        result = calcOp === '+' ? a + b : calcOp === '−' ? a - b : a * b;
      }
      const rounded = Math.round(result * 100) / 100;
      setCalcDisp(String(rounded));
      setCalcPrev(null); setCalcOp(null); setCalcFresh(true);
      setCalcTries(n => n + 1);

      if (rounded === correctTotal) {
        play('confirm');
        setCalcGlow(true);
        setAmountDue(correctTotal);
        setTimeout(() => {
          setCalcGlow(false);
          setCalcDisp('0'); setCalcFresh(false);
          setWallet({ ...W0 }); setTray({ ...T0 });
          go('payment');
        }, 1500);
      } else {
        beep('error');
        setCalcShake(true);
        setTimeout(() => {
          setCalcShake(false);
          setCalcDisp('0'); setCalcFresh(false);
          setCalcPrev(null); setCalcOp(null);
        }, 700);
      }
      return;
    }

    if (['+', '−', '×'].includes(key)) {
      if (calcPrev !== null && calcOp && !calcFresh) {
        const a = parseFloat(calcPrev) || 0;
        const b = parseFloat(calcDisp) || 0;
        const r = calcOp === '+' ? a + b : calcOp === '−' ? a - b : a * b;
        setCalcPrev(String(r)); setCalcDisp(String(r));
      } else {
        setCalcPrev(calcDisp);
      }
      setCalcOp(key); setCalcFresh(true);
      return;
    }

    // Digit
    if (calcFresh || calcDisp === '0') {
      setCalcDisp(key); setCalcFresh(false);
    } else if (calcDisp.length < 6) {
      setCalcDisp(calcDisp + key);
    }
  };

  // ── Payment: tap a bill/coin from wallet into tray
  const tapDenom = denom => {
    if ((wallet[denom] || 0) <= 0 || payDone) return;
    play('calcButton');
    const nw = { ...wallet, [denom]: wallet[denom] - 1 };
    const nt = { ...tray,   [denom]: tray[denom]   + 1 };
    setWallet(nw); setTray(nt);
    const total = DENOMS.reduce((s, d) => s + d * nt[d], 0);
    if (total === amountDue) {
      setPayDone(true);
      play('confirm');
      setTimeout(() => { recordSession(total, 0); go('success'); }, 1400);
    }
  };

  // ── Payment: return a bill/coin from tray to wallet
  const untapDenom = denom => {
    if ((tray[denom] || 0) <= 0 || payDone) return;
    play('remove');
    setTray(t  => ({ ...t,  [denom]: t[denom]  - 1 }));
    setWallet(w => ({ ...w, [denom]: w[denom]  + 1 }));
    setPayMistakes(n => n + 1);
    setConfusedD(cd => ({ ...cd, [denom]: (cd[denom] || 0) + 1 }));
  };

  // ── Payment: overpay → take change
  const takeChange = () => {
    play('confirm');
    setPayDone(true);
    recordSession(payTotal, change);
    go('success');
  };

  // ── Record a completed session
  const recordSession = (paid, chg) => {
    const dur  = sessStart ? Math.max(1, Math.round((Date.now() - sessStart) / 60000)) : 1;
    const cnt  = missionItems.length;
    const level = cnt <= 3 ? T.levelEasy : cnt === 4 ? T.levelIntermediate : T.levelHard;
    const sess = {
      date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-HK'),
      duration: dur, level, calcTries, payMistakes,
      confusedDenoms: { ...confusedD },
      total: amountDue, paid, change: chg,
    };
    setSessions(prev => {
      const next = [sess, ...prev].slice(0, 20);
      try { localStorage.setItem('ts_sessions', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  // ── Shared micro-components (defined inside so they close over state)
  const Back = ({ to }) => (
    <div onClick={() => go(to)} style={{position:'absolute',top:22,left:18,width:44,height:44,borderRadius:'50%',border:'2.5px solid #fff',background:'rgba(255,255,255,.82)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 10px rgba(74,59,50,.14)',zIndex:10}}>
      <div style={{width:12,height:12,borderLeft:'3px solid #6f6256',borderBottom:'3px solid #6f6256',transform:'rotate(45deg)',marginLeft:4}}/>
    </div>
  );

  const CheckBadge = () => (
    <div style={{position:'absolute',top:-7,right:-6,zIndex:2,width:22,height:22,borderRadius:'50%',background:'#7FE0A8',border:'2.5px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 5px rgba(74,59,50,.2)'}}>
      <div style={{width:8,height:4,borderLeft:'2.5px solid #fff',borderBottom:'2.5px solid #fff',transform:'rotate(-45deg)',marginBottom:2}}/>
    </div>
  );

  const Key = ({ label, span, bg, fg, sh }) => (
    <div onClick={() => handleCalc(label)} style={{gridColumn:span?`span ${span}`:undefined,background:bg||'#fff',borderRadius:14,padding:'13px 0',textAlign:'center',fontFamily:"'Nunito'",fontWeight:900,fontSize:22,color:fg||'#4A3B32',boxShadow:`0 4px 0 ${sh||'#cfc6b4'}`,cursor:'pointer',userSelect:'none',WebkitTapHighlightColor:'transparent',active:{transform:'translateY(2px)'}}}>
      {label}
    </div>
  );

  const optOf = l => ({
    bg: lang === l ? '#FFF1EC' : '#fff',
    border: lang === l ? '#FF6F52' : '#E8E2D8',
    dot: lang === l ? '#FF6F52' : '#E8E2D8',
    active: lang === l,
  });

  const phone = {position:'relative',width:390,height:810,flexShrink:0,transformOrigin:'center center'};
  const card  = {width:390,height:810,borderRadius:36,overflow:'hidden',position:'relative',boxShadow:'0 16px 44px rgba(74,59,50,.2)'};

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{position:'fixed',inset:0,background:'#e7e5df',fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito',sans-serif",color:'#4A3B32',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <div ref={phoneRef} style={phone}>

        {/* ══════════ HOME ══════════ */}
        {screen === 'home' && (
          <div style={{...card,background:'#FFF6E6'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:430,background:'linear-gradient(#BFE3F0 0%,#E3F1E6 60%,#FFF6E6 100%)',overflow:'hidden'}}>
              <img src={u('Store%20Exterior.png')} alt="" style={{position:'absolute',left:'50%',top:197,transform:'translate(-50%,-50%)',width:589,height:386,filter:'drop-shadow(0 10px 18px rgba(74,59,50,.18))'}}/>
              <div style={{position:'absolute',left:0,right:0,bottom:0,height:70,background:'linear-gradient(transparent,#FFF6E6)'}}/>
            </div>
            <div style={{position:'absolute',left:24,right:24,bottom:30,background:'#fff',border:'5px solid #fff',borderRadius:30,boxShadow:'0 14px 30px rgba(74,59,50,.18)',padding:'12px 24px 24px',textAlign:'center'}}>
              {/* Character selector */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginBottom:6}}>
                <div onClick={() => setCharIdx(i => (i+1)%2)} style={{cursor:'pointer',flexShrink:0,width:42,height:42,borderRadius:'50%',border:'2.5px solid #fff',background:'#FFEDE6',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px rgba(74,59,50,.16)'}}>
                  <div style={{width:11,height:11,borderLeft:'3.5px solid #FF6F52',borderBottom:'3.5px solid #FF6F52',transform:'rotate(45deg)',marginLeft:4}}/>
                </div>
                <div style={{width:107,height:143,backgroundImage:`url('${charImg}')`,backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundSize:'contain',filter:'drop-shadow(0 6px 10px rgba(74,59,50,.18))'}}/>
                <div onClick={() => setCharIdx(i => (i+1)%2)} style={{cursor:'pointer',flexShrink:0,width:42,height:42,borderRadius:'50%',border:'2.5px solid #fff',background:'#FFEDE6',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 10px rgba(74,59,50,.16)'}}>
                  <div style={{width:11,height:11,borderRight:'3.5px solid #FF6F52',borderTop:'3.5px solid #FF6F52',transform:'rotate(45deg)',marginRight:4}}/>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginBottom:8}}>
                {CHARS.map((_, i) => <div key={i} style={{width:8,height:8,borderRadius:'50%',background:charIdx===i?'#FF6F52':'#E8D9CE'}}/>)}
              </div>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22}}>{T.homeGreeting}</div>
              <div style={{marginTop:20}}>
                <div onClick={startGame} style={{cursor:'pointer',animation:'bob 2.4s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'4px solid #fff',borderRadius:24,padding:'17px 0',boxShadow:'0 7px 0 #E2512F,0 14px 22px rgba(74,59,50,.26)'}}>
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
            {/* Language picker overlay */}
            {langOpen && (
              <div style={{position:'absolute',inset:0,background:'rgba(74,59,50,.45)',display:'flex',alignItems:'center',justifyContent:'center',padding:'0 30px',backdropFilter:'blur(2px)',zIndex:20}}>
                <div style={{width:'100%',background:'#fff',border:'5px solid #fff',borderRadius:28,boxShadow:'0 18px 40px rgba(74,59,50,.3)',padding:'24px 22px 22px'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:18}}>
                    <div style={{width:16,height:16,borderRadius:'50%',border:'3px solid #FF6F52'}}/>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:20}}>{T.chooseLang}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {[['zhHant','繁體中文',"'Noto Sans TC'"],['zhHans','简体中文',"'Noto Sans SC'"],['en','English',"'Nunito'"]].map(([code,label,font]) => {
                      const opt = optOf(code);
                      return (
                        <div key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',border:`3px solid ${opt.border}`,background:opt.bg,borderRadius:18,padding:'14px 18px'}}>
                          <span style={{fontFamily:font,fontWeight:800,fontSize:18}}>{label}</span>
                          <div style={{width:22,height:22,borderRadius:'50%',background:opt.dot,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            {opt.active && <div style={{width:8,height:5,borderLeft:'2.5px solid #fff',borderBottom:'2.5px solid #fff',transform:'rotate(-45deg)',marginBottom:2}}/>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div onClick={() => setLangOpen(false)} style={{cursor:'pointer',marginTop:16,textAlign:'center',fontWeight:800,fontSize:16,color:'#9a8a78',padding:'8px 0'}}>✕</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ MISSION ══════════ */}
        {screen === 'mission' && (
          <div style={{...card,background:'#FFF6E6'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:540,overflow:'hidden',background:'#fff'}}>
              <img src={u('Store%20Interior.png')} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 28%',filter:'blur(1.5px)'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(255,246,230,.05),rgba(255,246,230,.55))'}}/>
            </div>
            <Back to="home"/>
            <div style={{position:'absolute',left:0,right:0,bottom:0,background:'#fff',borderRadius:'34px 34px 0 0',boxShadow:'0 -10px 30px rgba(74,59,50,.16)',padding:'28px 26px 32px'}}>
              <div style={{display:'flex',alignItems:'center',gap:18}}>
                <div style={{flexShrink:0,width:96,height:96,borderRadius:'50%',border:'4px solid #fff',background:`#FDF3D8 url('${charImg}') center -2px/118% no-repeat`,boxShadow:'0 8px 16px rgba(74,59,50,.16)'}}/>
                <div>
                  <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:12,letterSpacing:2,color:'#FF6F52',textTransform:'uppercase'}}>{T.missionLabel}</div>
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,lineHeight:1.3,color:'#4A3B32',marginTop:6}}>{T.missionTitle}</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:16}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:16}}>{T.shoppingList}</span>
                <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:12,color:'#fff',background:'#FF8A52',borderRadius:999,padding:'2px 10px'}}>
                  {missionItems.length} {lang === 'en' ? 'items' : '樣'}
                </span>
              </div>
              <div style={{display:'flex',gap:6,marginTop:10}}>
                {missionItems.map(item => (
                  <div key={item.id} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5,background:item.bg,border:'2px solid #fff',borderRadius:14,padding:'9px 3px 8px',boxShadow:'0 3px 8px rgba(74,59,50,.1)'}}>
                    <div style={{width:42,height:42,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <img src={item.img} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} alt=""/>
                    </div>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:11,color:'#4A3B32',textAlign:'center',lineHeight:1.1}}>{item.name}</span>
                    <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:13,color:'#FF6F52'}}>${item.price}</span>
                  </div>
                ))}
              </div>
              <div onClick={() => { play('confirm'); go('nav'); }} style={{cursor:'pointer',marginTop:22,animation:'bob 2.6s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'4px solid #fff',borderRadius:26,padding:'18px 0',boxShadow:'0 8px 0 #E2512F,0 15px 22px rgba(74,59,50,.24)'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:24,letterSpacing:2}}>{T.go}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ STORE ══════════ */}
        {screen === 'nav' && (
          <div style={{...card,background:'linear-gradient(#EAF6FB,#FFF6E6 60%)'}}>
            {/* Top bar */}
            <div style={{position:'absolute',top:24,left:18,right:18,display:'flex',alignItems:'center',gap:10,zIndex:10}}>
              <div onClick={() => go('mission')} style={{flexShrink:0,width:44,height:44,borderRadius:'50%',border:'2.5px solid #c9bda8',background:'rgba(255,255,255,.7)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <div style={{width:12,height:12,borderLeft:'3px solid #6f6256',borderBottom:'3px solid #6f6256',transform:'rotate(45deg)',marginLeft:4}}/>
              </div>
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#fff',borderRadius:999,padding:'9px 14px',boxShadow:'0 5px 12px rgba(74,59,50,.14)'}}>
                <div style={{width:14,height:14,borderRadius:'50%',background:'#FF6F52'}}/>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:14,whiteSpace:'nowrap'}}>{T.shoppingList}</span>
              </div>
              <div style={{position:'relative',width:48,height:48,borderRadius:16,background:'#fff',border:'3px solid #fff',boxShadow:'0 5px 12px rgba(74,59,50,.14)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <div style={{width:22,height:16,borderRadius:'0 0 7px 7px',background:'#FF8A52',position:'relative'}}>
                  <div style={{position:'absolute',left:'50%',top:-7,transform:'translateX(-50%)',width:14,height:9,border:'3px solid #FF8A52',borderBottom:'none',borderRadius:'8px 8px 0 0'}}/>
                </div>
                {selectedItems.length > 0 && (
                  <div style={{position:'absolute',top:-7,right:-7,minWidth:24,height:24,borderRadius:12,background:'#FF6F52',border:'2.5px solid #fff',color:'#fff',fontFamily:"'Nunito'",fontWeight:900,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px'}}>{selectedItems.length}</div>
                )}
              </div>
            </div>

            {/* Mission checklist strip */}
            <div style={{position:'absolute',top:82,left:18,right:18,zIndex:5,background:'#fff',border:'2.5px solid #fff',borderRadius:18,padding:'7px 9px',boxShadow:'0 6px 16px rgba(74,59,50,.16)',display:'flex',alignItems:'center',gap:7}}>
              <span style={{flexShrink:0,fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:12,color:'#FF6F52',lineHeight:1.1,textAlign:'center',maxWidth:42}}>{T.listToBuy}</span>
              <div style={{flex:1,display:'flex',gap:5,minWidth:0}}>
                {missionItems.map(mi => {
                  const checked = selectedItems.some(si => si.id === mi.id);
                  return (
                    <div key={mi.id} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:3,background:checked?'#E3F9EC':mi.bg,borderRadius:11,padding:'5px 4px',minWidth:0,transition:'background .25s'}}>
                      <div style={{flexShrink:0,width:24,height:24,borderRadius:7,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                        <img src={mi.img} style={{width:20,height:20,objectFit:'contain'}} alt=""/>
                      </div>
                      <div style={{flexShrink:0,width:16,height:16,borderRadius:'50%',background:checked?'#7FE0A8':'transparent',border:checked?'none':'2px solid #ccc',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .25s'}}>
                        {checked && <div style={{width:6,height:3,borderLeft:'2px solid #fff',borderBottom:'2px solid #fff',transform:'rotate(-45deg)',marginBottom:1}}/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scrollable store zones */}
            <div style={{position:'absolute',top:154,left:0,right:0,bottom:92,overflowY:'auto',padding:'6px 16px 16px',display:'flex',flexDirection:'column',gap:14}}>
              {ZONES.map(zone => (
                <div key={zone.id} style={{background:zone.bg,border:'2.5px solid #fff',borderRadius:20,padding:'10px 12px 12px',boxShadow:'0 4px 12px rgba(74,59,50,.08)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
                    <div style={{width:36,height:36,borderRadius:10,background:'#fff',boxShadow:'0 2px 5px rgba(74,59,50,.12)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                      <img src={zone.icon} style={{width:32,height:32,objectFit:'contain'}} alt=""/>
                    </div>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:17,color:zone.color}}>{T[zone.zKey]}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                    {items.filter(it => it.zone === zone.id).map(item => {
                      const isMission  = missionItems.some(mi => mi.id === item.id);
                      const isSelected = selectedItems.some(si => si.id === item.id);
                      return (
                        <div key={item.id} onClick={() => toggleItem(item)} style={{
                          position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                          background: isSelected ? '#DFF7EC' : '#fff',
                          borderRadius:13,padding:'7px 3px 6px',
                          boxShadow:'0 3px 8px rgba(74,59,50,.1)',
                          cursor:'pointer',
                          border: isSelected ? '2px solid #7FE0A8' : '2px solid transparent',
                          animation: isMission && !isSelected ? 'glowpulse 2.2s ease-in-out infinite' : undefined,
                          transition:'background .2s,border .2s',
                          userSelect:'none',WebkitTapHighlightColor:'transparent',
                        }}>
                          {isSelected && <CheckBadge/>}
                          <div style={{width:50,height:50,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <img src={item.img} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} alt=""/>
                          </div>
                          <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:10,color:'#4A3B32',textAlign:'center',lineHeight:1.1}}>{item.name}</div>
                          <div style={{marginTop:'auto',background:'#FFC94D',color:'#4A3B32',fontFamily:"'Nunito'",fontWeight:900,fontSize:14,padding:'0 7px',borderRadius:999}}>${item.price}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom action bar */}
            <div style={{position:'absolute',left:0,right:0,bottom:0,height:92,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 22px',background:'rgba(255,255,255,.88)',backdropFilter:'blur(6px)',borderTop:'1px solid rgba(200,185,165,.3)',zIndex:10}}>
              <div onClick={() => go('home')} style={{width:54,height:54,borderRadius:'50%',background:'#fff',border:'3px solid #fff',boxShadow:'0 6px 14px rgba(74,59,50,.16)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <div style={{width:14,height:14,borderLeft:'4px solid #FF6F52',borderBottom:'4px solid #FF6F52',transform:'rotate(45deg)',marginLeft:4}}/>
              </div>
              <div
                onClick={() => { if (missionDone) { play('confirm'); go('cart'); } }}
                style={{
                  cursor: missionDone ? 'pointer' : 'default',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  background: missionDone ? 'linear-gradient(#7FE0A8,#5FCB8E)' : '#D4CDBF',
                  color: missionDone ? '#225c40' : '#a09080',
                  border:'4px solid #fff',borderRadius:22,padding:'13px 30px',
                  boxShadow: missionDone ? '0 6px 0 #3FA56E,0 12px 18px rgba(74,59,50,.2)' : '0 3px 0 #bbb',
                  animation: missionDone ? 'bob 2.6s ease-in-out infinite' : undefined,
                  transition:'all .3s',
                }}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:19}}>{T.checkout}</span>
              </div>
              <div onClick={() => go('parent')} style={{width:54,height:54,borderRadius:'50%',background:'#fff',border:'3px solid #fff',boxShadow:'0 6px 14px rgba(74,59,50,.16)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                <div style={{width:13,height:15,background:'#C9A6E0',borderRadius:'4px 4px 7px 7px'}}/>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CART / CALCULATOR ══════════ */}
        {screen === 'cart' && (
          <div style={{...card,background:'#FFF6E6'}}>
            {/* Header */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:108,background:'linear-gradient(#BFE6C5,#A8D9B2)',display:'flex',alignItems:'center',gap:14,padding:'0 22px'}}>
              <div style={{flexShrink:0,width:68,height:68,borderRadius:'50%',border:'3px solid #fff',background:`#E6F4EA url('${charImg}') center -2px/118% no-repeat`,boxShadow:'0 5px 12px rgba(74,59,50,.16)'}}/>
              <div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:20,color:'#2f5a3c'}}>{T.cartTitle}</div>
                <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontSize:12,color:'#4a8a60',marginTop:2}}>{T.calcHint}</div>
              </div>
            </div>

            {/* Selected items — horizontal scroll */}
            <div style={{position:'absolute',top:118,left:0,right:0,height:116,overflowX:'auto',overflowY:'hidden',display:'flex',gap:8,padding:'0 18px',alignItems:'center'}}>
              {selectedItems.map(item => (
                <div key={item.id} style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'#fff',border:'2.5px solid #fff',borderRadius:16,padding:'8px 8px 7px',boxShadow:'0 4px 10px rgba(74,59,50,.1)',width:68}}>
                  <div style={{width:42,height:42,borderRadius:11,background:item.bg,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    <img src={item.img} style={{width:34,height:34,objectFit:'contain'}} alt=""/>
                  </div>
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:9,color:'#4A3B32',textAlign:'center',lineHeight:1.1,width:'100%'}}>{item.name}</div>
                  <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:14,color:'#4A3B32'}}>${item.price}</div>
                </div>
              ))}
            </div>

            {/* Calculator */}
            <div style={{position:'absolute',bottom:18,left:22,right:22,background:'linear-gradient(#EFE9DD,#E2DBCB)',border:'4px solid #fff',borderRadius:26,padding:15,boxShadow:'0 14px 30px rgba(74,59,50,.22)',animation:calcShake?'shake .65s ease-in-out':undefined}}>
              {/* Display */}
              <div style={{background:calcGlow?'#1e3a28':'#3a4a3f',borderRadius:14,padding:'8px 16px 10px',marginBottom:12,boxShadow:'inset 0 2px 6px rgba(0,0,0,.3)',transition:'background .3s',border:`2px solid ${calcGlow?'#7FE0A8':'transparent'}`}}>
                {calcOp && (
                  <div style={{fontFamily:"'Nunito'",fontWeight:700,fontSize:13,color:'rgba(159,232,189,.65)',textAlign:'right',marginBottom:2}}>
                    {calcPrev} {calcOp}
                  </div>
                )}
                <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:36,color:calcGlow?'#7FE0A8':'#9fe8bd',letterSpacing:1,textAlign:'right',lineHeight:1}}>
                  {calcDisp}
                </div>
                {correctTotal > 0 && (
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontSize:11,color:'rgba(159,232,189,.5)',textAlign:'right',marginTop:2}}>
                    {lang === 'en' ? 'target' : '目標'}: ${correctTotal}
                  </div>
                )}
              </div>
              {/* Keys — 4×4 grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
                <Key label="7"/><Key label="8"/><Key label="9"/>
                <Key label="C"  bg="#FFC94D" fg="#7a5a14" sh="#E2A52F"/>
                <Key label="4"/><Key label="5"/><Key label="6"/>
                <Key label="−" bg="#C9A6E0" fg="#fff"    sh="#9F73C0"/>
                <Key label="1"/><Key label="2"/><Key label="3"/>
                <Key label="+" bg="#C9A6E0" fg="#fff"    sh="#9F73C0"/>
                <Key label="0" span={2}/>
                <Key label="."/>
                <Key label="=" bg="#7FE0A8" fg="#225c40" sh="#3FA56E"/>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ PAYMENT ══════════ */}
        {screen === 'payment' && (
          <div style={{...card,background:'#FFF6E6',display:'flex',flexDirection:'column'}}>
            {/* Receipt */}
            <div style={{background:'linear-gradient(#FF8468,#FF6F52)',padding:'14px 22px',flexShrink:0}}>
              {selectedItems.map(item => (
                <div key={item.id} style={{display:'flex',justifyContent:'space-between',fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:12,color:'rgba(255,255,255,.92)',marginTop:2}}>
                  <span>{item.name}</span><span>${item.price}</span>
                </div>
              ))}
              <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginTop:8,borderTop:'2px dashed rgba(255,255,255,.45)',paddingTop:8}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:17,color:'#fff'}}>{T.amountDue}</span>
                <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:34,color:'#fff',letterSpacing:1}}>${amountDue}</span>
              </div>
            </div>

            {/* Tray area */}
            <div style={{flex:1,overflowY:'auto',padding:'12px 22px'}}>
              <div style={{
                minHeight:88,borderRadius:22,
                background: payDone ? 'linear-gradient(#A8E8C0,#88D4A0)' : 'linear-gradient(#D9B98A,#C49B68)',
                border: `4px solid ${payDone ? '#7FE0A8' : '#E7CEA6'}`,
                boxShadow:'inset 0 4px 10px rgba(74,40,10,.15)',
                padding:'10px 14px',transition:'all .4s',
                animation: payDone ? 'glowTray 1.4s ease-in-out' : undefined,
              }}>
                <div style={{fontSize:10,fontWeight:700,color:'#fff8ec',opacity:.8,letterSpacing:1,marginBottom:8,fontFamily:"'Nunito'"}}>{T.trayLabel}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}}>
                  {DENOMS.map(d => (tray[d] || 0) > 0 && Array.from({length: tray[d]}).map((_, i) => (
                    <div key={`${d}-${i}`} onClick={() => untapDenom(d)} style={{cursor:'pointer',flexShrink:0}}>
                      <img src={DIMG[d]} style={{height: d >= 20 ? 42 : 32, width:'auto', filter:'drop-shadow(0 2px 5px rgba(74,59,50,.28))', display:'block'}} alt={`$${d}`}/>
                    </div>
                  )))}
                  {payTotal === 0 && (
                    <span style={{color:'rgba(255,248,236,.55)',fontSize:12,fontFamily:"'Noto Sans TC','Noto Sans SC'"}}>{T.payHint}</span>
                  )}
                </div>
              </div>

              {/* Paid + change row */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12}}>
                <div>
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:12,color:'#8a7c6c'}}>{T.paidIn}</div>
                  <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:28,color:'#4A3B32'}}>${payTotal}</div>
                </div>
                {payTotal >= amountDue && payTotal > 0 && change === 0 && (
                  <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#7FE0A8',border:'3px solid #fff',borderRadius:999,padding:'9px 18px',boxShadow:'0 5px 12px rgba(74,59,50,.16)'}}>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:15,color:'#225c40'}}>✓ {lang === 'en' ? 'Exact!' : '剛好！'}</span>
                  </div>
                )}
                {payTotal > amountDue && (
                  <div onClick={takeChange} style={{cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8,background:'#7FE0A8',border:'3px solid #fff',borderRadius:999,padding:'9px 18px',boxShadow:'0 5px 12px rgba(74,59,50,.16)',animation:'bob 2s ease-in-out infinite'}}>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:14,color:'#225c40'}}>{T.takeChange}</span>
                    <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:22,color:'#225c40'}}>${change}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Wallet */}
            <div style={{background:'linear-gradient(#F3ECDD,#E8E2D8)',borderRadius:'28px 28px 0 0',padding:'14px 22px 24px',flexShrink:0,boxShadow:'0 -8px 22px rgba(74,59,50,.12)'}}>
              <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:16,color:'#4A3B32',marginBottom:10}}>{T.wallet}</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px 14px',marginBottom:12}}>
                {[100,50,20,10].map(d => {
                  const qty = wallet[d] || 0;
                  const active = qty > 0 && !payDone;
                  return (
                    <div key={d} onClick={() => tapDenom(d)} style={{position:'relative',cursor:active?'pointer':'default',opacity:active?1:.38,transition:'opacity .2s',userSelect:'none'}}>
                      <img src={DIMG[d]} style={{width:'100%',height:'auto',display:'block',filter:'drop-shadow(0 4px 8px rgba(74,59,50,.18))'}} alt={`$${d}`}/>
                      <span style={{position:'absolute',top:-5,right:-5,fontFamily:"'Nunito'",fontWeight:900,fontSize:11,color:'#fff',background:'#4A3B32',border:'2px solid #fff',borderRadius:999,padding:'1px 7px'}}>×{qty}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{display:'flex',gap:16,justifyContent:'center'}}>
                {[5,2,1].map(d => {
                  const qty = wallet[d] || 0;
                  const active = qty > 0 && !payDone;
                  return (
                    <div key={d} onClick={() => tapDenom(d)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:active?'pointer':'default',opacity:active?1:.38,transition:'opacity .2s',userSelect:'none'}}>
                      <img src={DIMG[d]} style={{width:58,height:'auto',display:'block',filter:'drop-shadow(0 4px 8px rgba(74,59,50,.2))'}} alt={`$${d}`}/>
                      <span style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,color:'#9a8a78'}}>×{qty}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ SUCCESS ══════════ */}
        {screen === 'success' && (
          <div style={{...card,background:'linear-gradient(#BFE3F0 0%,#FFE9C2 55%,#BFE6C5 100%)'}}>
            <div style={{position:'absolute',top:40,left:46,width:80,height:80,borderRadius:'50%',background:'radial-gradient(circle at 40% 38%,#FFE9A8,#FFC94D)',boxShadow:'0 0 44px 14px rgba(255,201,77,.4)'}}/>
            {[{t:62,l:38,w:10,c:'#FF6F52',r:2},{t:105,r:58,w:9,c:'#C9A6E0',r2:'50%'},{t:155,l:88,w:8,c:'#7FE0A8',r:0},{t:120,r:118,w:10,c:'#5BB6E0',r:2}].map((s,i) => (
              <div key={i} style={{position:'absolute',top:s.t,left:s.l,right:s.r,width:s.w,height:s.w,background:s.c,borderRadius:s.r2||s.r,animation:`twinkle ${2.4+i*.3}s ease-in-out infinite`}}/>
            ))}
            <div style={{position:'absolute',top:70,left:0,right:0,display:'flex',justifyContent:'center'}}>
              <img src={u('Great%20Job.png')} alt="Great Job!" style={{width:285,height:'auto',filter:'drop-shadow(0 12px 20px rgba(74,59,50,.22))',animation:'bob 3s ease-in-out infinite'}}/>
            </div>
            <div style={{position:'absolute',top:370,left:24,right:24,background:'#fff',border:'5px solid #fff',borderRadius:24,padding:'16px 18px',boxShadow:'0 12px 26px rgba(74,59,50,.18)'}}>
              <div style={{display:'flex',gap:6,justifyContent:'center',flexWrap:'wrap',marginBottom:12}}>
                {selectedItems.map(item => (
                  <div key={item.id} style={{width:44,height:44,borderRadius:12,background:item.bg,border:'2.5px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                    <img src={item.img} style={{width:36,height:36,objectFit:'contain'}} alt=""/>
                  </div>
                ))}
              </div>
              {sessions[0] && (
                <>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'2px dashed #E8E2D8'}}>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:14,color:'#8a7c6c'}}>{T.amountDue}</span>
                    <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:18,color:'#4A3B32'}}>${sessions[0].total}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'2px dashed #E8E2D8'}}>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:14,color:'#8a7c6c'}}>{T.paid}</span>
                    <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:18,color:'#4A3B32'}}>${sessions[0].paid}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'2px dashed #E8E2D8'}}>
                    <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:14,color:'#8a7c6c'}}>{T.change}</span>
                    <span style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:18,color:'#3FA56E'}}>${sessions[0].change}</span>
                  </div>
                </>
              )}
            </div>
            <div style={{position:'absolute',bottom:28,left:24,right:24,display:'flex',flexDirection:'column',gap:12}}>
              <div onClick={startGame} style={{cursor:'pointer',animation:'bob 2.6s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(#FF8468,#FF6F52)',color:'#fff',border:'4px solid #fff',borderRadius:24,padding:'16px 0',boxShadow:'0 7px 0 #E2512F,0 14px 20px rgba(74,59,50,.24)'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22,letterSpacing:2}}>{T.playAgain}</span>
              </div>
              <div onClick={() => go('home')} style={{cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',border:'3px solid #c9bda8',borderRadius:22,padding:'12px 0'}}>
                <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:800,fontSize:18,color:'#6f6256'}}>{T.backHome}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ PARENT DASHBOARD ══════════ */}
        {screen === 'parent' && (() => {
          const sess    = sessions[0];
          const total   = sessions.length;
          const calcAcc = total > 0 ? Math.round(sessions.filter(s => s.calcTries === 1).length / total * 100) : null;
          const payAcc  = total > 0 ? Math.round(sessions.filter(s => s.payMistakes === 0).length / total * 100) : null;
          const allCD   = {};
          sessions.forEach(s => { if (s.confusedDenoms) Object.entries(s.confusedDenoms).forEach(([d,c]) => { allCD[d] = (allCD[d]||0)+c; }); });
          const topCD   = Object.entries(allCD).sort((a,b) => b[1]-a[1]).slice(0,3);
          const maxCD   = topCD[0]?.[1] || 1;
          const cdColors = ['#FF8A52','#FFC94D','#C9A6E0'];

          return (
            <div style={{...card,background:'#F5F2EC',overflowY:'auto'}}>
              <div style={{position:'sticky',top:0,padding:'24px 24px 18px',background:'#fff',borderBottom:'1px solid #ECE7DE',zIndex:5}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div onClick={() => go('home')} style={{cursor:'pointer',width:38,height:38,borderRadius:12,background:'#F0EDE6',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div style={{width:11,height:11,borderLeft:'3px solid #6f6256',borderBottom:'3px solid #6f6256',transform:'rotate(45deg)',marginLeft:3}}/>
                  </div>
                  <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:900,fontSize:22}}>{T.parentTitle}</div>
                </div>
              </div>

              <div style={{padding:'0 24px 32px'}}>
                {/* Latest session */}
                <div style={{marginTop:16,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
                  <div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:10,textTransform:'uppercase'}}>{T.latestSession}</div>
                  {sess ? (
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:14,color:'#4A3B32'}}>{sess.date}</div>
                        <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.pDate}</div>
                      </div>
                      <div>
                        <div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:14,color:'#4A3B32'}}>{sess.duration} min</div>
                        <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.pDuration}</div>
                      </div>
                      <div>
                        <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:800,fontSize:14,color:'#4A3B32'}}>{sess.level}</div>
                        <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:11,color:'#9a8a78'}}>{T.pLevel}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{color:'#bbb',fontSize:13,textAlign:'center',padding:'8px 0',fontFamily:"'Noto Sans TC','Noto Sans SC'"}}>{T.noSessions}</div>
                  )}
                </div>

                {/* Accuracy cards */}
                <div style={{display:'flex',gap:12,marginTop:12}}>
                  <div style={{flex:1,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16,textAlign:'center'}}>
                    <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:32,color:'#3FA56E',lineHeight:1}}>
                      {calcAcc !== null ? <>{calcAcc}<span style={{fontSize:18}}>%</span></> : '—'}
                    </div>
                    <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:12,color:'#6f6256',marginTop:6}}>{T.calcAccuracy}</div>
                  </div>
                  <div style={{flex:1,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16,textAlign:'center'}}>
                    <div style={{fontFamily:"'Nunito'",fontWeight:900,fontSize:32,color:'#E0992F',lineHeight:1}}>
                      {payAcc !== null ? <>{payAcc}<span style={{fontSize:18}}>%</span></> : '—'}
                    </div>
                    <div style={{fontFamily:"'Noto Sans TC','Noto Sans SC'",fontWeight:700,fontSize:13,color:'#6f6256',marginTop:6}}>{T.payAccuracy}</div>
                  </div>
                </div>

                {/* Confused denominations */}
                <div style={{marginTop:12,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
                  <div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:12,textTransform:'uppercase'}}>{T.confusedDenoms}</div>
                  {topCD.length > 0 ? (
                    <div style={{display:'flex',flexDirection:'column',gap:11}}>
                      {topCD.map(([denom, cnt], idx) => (
                        <div key={denom} style={{display:'flex',alignItems:'center',gap:10}}>
                          <span style={{width:42,fontFamily:"'Nunito'",fontWeight:900,fontSize:13,color:'#4A3B32'}}>${denom}</span>
                          <div style={{flex:1,height:10,borderRadius:999,background:'#F0EDE6',overflow:'hidden'}}>
                            <div style={{width:`${Math.round(cnt/maxCD*100)}%`,height:'100%',background:cdColors[idx]||'#ccc',borderRadius:999,transition:'width .5s'}}/>
                          </div>
                          <span style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,color:'#9a8a78'}}>{cnt}×</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{color:'#ccc',fontSize:12,textAlign:'center',fontFamily:"'Nunito'"}}>{total === 0 ? '—' : lang === 'en' ? 'No mistakes yet!' : '完美！沒有混淆'}</div>
                  )}
                </div>

                {/* Stamp history */}
                <div style={{marginTop:12,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
                  <div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:14,textTransform:'uppercase'}}>{T.stampHistory}</div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    {['W1','W2','W3','W4'].map((label,i) => (
                      <React.Fragment key={label}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                          <div style={{width:26,height:26,borderRadius:'50%',
                            background: total >= (i+1)*2 ? '#3FA56E' : total > i ? '#7FE0A8' : '#EFEAE0',
                            border: total <= i*2 && i > 0 ? '2px dashed #cfc6b4' : undefined,
                          }}/>
                          <span style={{fontFamily:"'Nunito'",fontWeight:700,fontSize:10,color:'#9a8a78'}}>{label}</span>
                        </div>
                        {i < 3 && <div style={{flex:1,height:3,background:'#E5E0D6'}}/>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Session history list */}
                {sessions.length > 0 && (
                  <div style={{marginTop:12,background:'#fff',border:'1px solid #ECE7DE',borderRadius:16,padding:16}}>
                    <div style={{fontFamily:"'Nunito'",fontWeight:800,fontSize:11,letterSpacing:1,color:'#a89a87',marginBottom:10,textTransform:'uppercase'}}>{lang==='en'?'History':'歷史記錄'}</div>
                    {sessions.slice(0,6).map((s,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:i<Math.min(sessions.length,6)-1?'1px solid #F0EDE6':undefined}}>
                        <span style={{fontFamily:"'Nunito'",fontSize:12,color:'#9a8a78',width:72}}>{s.date}</span>
                        <span style={{fontFamily:"'Noto Sans TC','Noto Sans SC','Nunito'",fontWeight:700,fontSize:12,color:'#4A3B32',flex:1,textAlign:'center'}}>{s.level}</span>
                        <span style={{fontFamily:"'Nunito'",fontWeight:700,fontSize:12,color:'#3FA56E',width:48,textAlign:'right'}}>${s.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
