import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, Brain, CheckCircle2, ChevronRight, CirclePlay,
  Cloud, Code2, Cpu, Gauge, Heart, Home, Info, LayoutDashboard, LineChart,
  LockKeyhole, Menu, Network, Play, RefreshCw, Save, Search, ShieldCheck,
  Sparkles, Target, TrendingUp, Trophy, Video, X, Zap
} from "lucide-react";
import { Line, LineChart as RLineChart, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { reels } from "./data";
import { applyInteraction, createInitialProfile, detectGap, detectInterest, hypeGuard, recommend, Recommendation } from "./engine";
import { Interaction, Reel, StudentProfile } from "./types";

type Page = "home"|"dashboard"|"feed"|"recommendations"|"learning"|"profile"|"analytics"|"architecture";

const STORAGE = "techscroll-ai-profile-v1";

function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE);
    return raw ? JSON.parse(raw) : createInitialProfile();
  } catch { return createInitialProfile(); }
}
function saveProfile(p: StudentProfile){ localStorage.setItem(STORAGE, JSON.stringify(p)); }

const nav = [
  ["dashboard","Dashboard",LayoutDashboard],["feed","Reel Feed",Video],["recommendations","AI Recommendations",Sparkles],
  ["learning","Learning Journey",Target],["profile","Interest Profile",Brain],["analytics","Analytics",BarChart3],["architecture","AI Architecture",Network]
] as const;

function App(){
  const [page,setPage] = useState<Page>("home");
  const [profile,setProfile] = useState<StudentProfile>(loadProfile);
  const [toast,setToast] = useState("");
  const [demo,setDemo] = useState(false);
  const [demoStep,setDemoStep] = useState(0);
  const [sidebar,setSidebar] = useState(false);

  useEffect(()=>saveProfile(profile),[profile]);
  useEffect(()=>{ if(toast){const t=setTimeout(()=>setToast(""),2400);return()=>clearTimeout(t)}},[toast]);

  const recs = useMemo(()=>recommend(profile,reels),[profile]);
  const interest = detectInterest(profile);
  const gap = detectGap(profile);

  function interact(reel:Reel, partial:Partial<Interaction>){
    const existing = profile.interactions.filter(i=>i.reelId===reel.id);
    const interaction:Interaction = {
      reelId:reel.id, watchPercentage: partial.watchPercentage ?? 0,
      watchDuration: partial.watchDuration ?? 0, liked:false,saved:false,replayed:false,skipped:false,notInterested:false,
      timestamp:Date.now(), ...partial
    };
    setProfile(p=>applyInteraction(p,reel,interaction));
    if(partial.liked) setToast("❤️ AI learned: stronger interest signal");
    else if(partial.saved) setToast("🔖 Saved — strong learning signal added");
    else if(partial.notInterested) setToast("AI updated: this topic will be reduced");
    else if(interaction.watchPercentage>=80) setToast("🧠 AI learned from your watch behavior");
    void existing;
  }

  function reset(){
    setProfile(createInitialProfile());
    setToast("Profile reset — the AI is learning from scratch");
  }

  function launchDemo(){
    setPage("dashboard"); setDemo(true); setDemoStep(0);
  }

  function runDemoStep(step:number){
    setDemoStep(step);
    const ids=["r1","r2","r3","r4","r5","r6","r9","r18","r10","r19"];
    const id=ids[Math.min(step,ids.length-1)];
    const reel=reels.find(r=>r.id===id);
    if(reel && step<4) interact(reel,{watchPercentage:[94,87,91,82][step],watchDuration:reel.duration*.8});
    if(reel && step===4) interact(reel,{watchPercentage:90,watchDuration:reel.duration});
    if(reel && step===5) interact(reel,{watchPercentage:96,watchDuration:reel.duration});
  }

  return <div className="app">
    <style>{`@keyframes pulseGlow{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}`}</style>
    {page!=="home" && <Sidebar page={page} setPage={setPage} open={sidebar} setOpen={setSidebar} onReset={reset}/>}
    <main className={page==="home"?"":"main"}>
      {page!=="home" && <Topbar page={page} setSidebar={setSidebar} interest={interest} onDemo={launchDemo}/>}
      {page==="home" && <Landing setPage={setPage} onDemo={launchDemo}/>}
      {page==="dashboard" && <Dashboard profile={profile} interest={interest} gap={gap} recs={recs} setPage={setPage} onInteract={interact} />}
      {page==="feed" && <Feed onInteract={interact} profile={profile}/>}
      {page==="recommendations" && <Recommendations recs={recs} profile={profile} onInteract={interact}/>}
      {page==="learning" && <Learning profile={profile} gap={gap} recs={recs}/>}
      {page==="profile" && <Profile profile={profile} interest={interest}/>}
      {page==="analytics" && <Analytics profile={profile}/>}
      {page==="architecture" && <Architecture/>}
    </main>
    {toast && <div className="toast"><Sparkles size={16}/>{toast}</div>}
    {demo && <DemoOverlay step={demoStep} setStep={(s)=>{runDemoStep(s)}} close={()=>setDemo(false)}/>}
  </div>
}

function Sidebar({page,setPage,open,setOpen,onReset}:{page:Page;setPage:(p:Page)=>void;open:boolean;setOpen:(x:boolean)=>void;onReset:()=>void}){
  return <aside className={`sidebar ${open?"mobileOpen":""}`}>
    <div className="brand"><div className="logo"><Sparkles size={19}/></div><div><b>TechScroll</b><span>AI</span></div></div>
    <div className="agent"><i></i><span>AI Agent Active</span><small>Learning from your scroll</small></div>
    <nav>{nav.map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>{setPage(id);setOpen(false)}}><Icon size={18}/><span>{label}</span>{page===id&&<ChevronRight size={15}/>}</button>)}</nav>
    <div className="sideBottom">
      <div className="privacy"><LockKeyhole size={15}/><span>Local-first demo<br/><small>Your profile stays in this browser</small></span></div>
      <button className="reset" onClick={onReset}><RefreshCw size={15}/> Reset learning profile</button>
    </div>
  </aside>
}

function Topbar({page,setSidebar,interest,onDemo}:{page:Page;setSidebar:(x:boolean)=>void;interest:{name:string;confidence:number};onDemo:()=>void}){
  const label=nav.find(n=>n[0]===page)?.[1] || "Dashboard";
  return <header className="topbar"><button className="mobileMenu" onClick={()=>setSidebar(true)}><Menu/></button><div><div className="crumb">TechScroll AI <span>/</span> {label}</div><h2>{label}</h2></div><div className="topActions"><div className="miniInterest"><span>AI understands</span><b>{interest.name}</b><em>{interest.confidence}%</em></div><button className="demoBtn" onClick={onDemo}><Play size={15} fill="currentColor"/> Live Demo</button></div></header>
}

function Landing({setPage,onDemo}:{setPage:(p:Page)=>void;onDemo:()=>void}){
  return <div className="landing">
    <div className="heroGlow"></div>
    <nav className="landingNav"><div className="brand"><div className="logo"><Sparkles size={19}/></div><b>TechScroll <span>AI</span></b></div><div className="landingLinks"><a href="#how">How it works</a><a href="#why">Why TechScroll</a><a href="#demo">Demo</a></div><button className="outlineBtn" onClick={()=>setPage("dashboard")}>Open App <ArrowRight size={15}/></button></nav>
    <section className="hero">
      <div className="heroCopy"><div className="eyebrow"><i></i> ADAPTIVE TECH DISCOVERY</div><h1>Make your<br/><span>scroll smarter.</span></h1><p>TechScroll AI watches how you interact with short-form content, understands your deeper interests, and recommends what you should learn next.</p><div className="heroButtons"><button className="primaryBtn" onClick={()=>setPage("feed")}><CirclePlay size={18}/> Start Scrolling</button><button className="ghostBtn" onClick={onDemo}><Zap size={17}/> Launch AI Demo</button></div><div className="heroStats"><div><b>Passive</b><span>No manual history</span></div><div><b>Semantic</b><span>Beyond keywords</span></div><div><b>Adaptive</b><span>Improves over time</span></div></div></div>
      <HeroVisual/>
    </section>
    <section className="problemSection" id="why"><div className="sectionHead"><div><span className="eyebrow">THE PROBLEM</span><h2>Students don't need less scrolling.<br/><span>They need better scrolling.</span></h2></div><p>Traditional recommendation systems optimize for similarity and engagement. TechScroll optimizes for technical growth.</p></div><div className="compare"><div className="compareCard muted"><span>TRADITIONAL RECOMMENDATION</span><div className="chain"><b>Watch Java</b><ArrowRight/><b>Keyword = Java</b><ArrowRight/><strong>More Java</strong></div><small>Optimizes for repetition.</small></div><div className="compareCard active"><span>TECHSCROLL AI</span><div className="chain"><b>Scroll</b><ArrowRight/><b>Understand</b><ArrowRight/><b>Infer</b><ArrowRight/><strong>Learn</strong></div><small>Optimizes for the next useful learning step.</small></div></div></section>
    <section className="javaSection" id="demo"><div className="sectionHead"><div><span className="eyebrow">THE BUILT-IN TRAP</span><h2>Don't confuse a topic<br/><span>with an interest.</span></h2></div><p>Four different signals can point to one broader interest. That's where semantic reasoning beats keyword matching.</p></div><div className="trapGrid"><div className="signalStack">{["Java meme","Software Engineer lifestyle","Coding interview","Developer laptop"].map((x,i)=><div className="signal" key={x}><span>0{i+1}</span><b>{x}</b><em>{[94,87,91,82][i]}% watched</em></div>)}</div><div className="reasoningCard"><div className="reasoningLine"></div><div className="brainCircle"><Brain/></div><div className="reasoningContent"><span>AI SYNTHESIS</span><h3>Software Engineering / Technology</h3><div className="confidence"><b>92%</b><span>confidence</span><div><i style={{width:"92%"}}/></div></div><div className="reject"><X size={15}/> More Java — rejected as too narrow</div><div className="recommend"><CheckCircle2 size={16}/><div><b>How HashMaps Actually Work</b><small>DSA · Intermediate · 92% match</small></div><ArrowRight size={16}/></div></div></div></div></section>
    <section className="featureSection" id="how"><div className="sectionHead center"><span className="eyebrow">THE AGENT</span><h2>From scrolling behavior<br/><span>to technical growth.</span></h2></div><div className="featureGrid">{[
      [Brain,"Passive interest discovery","The student never enters their history. Their behavior becomes the signal."],
      [Network,"Semantic understanding","Connect Java, interviews, software engineering and hardware into broader concepts."],
      [Target,"Skill-aware recommendations","Separate what a student likes from what they actually know."],
      [ShieldCheck,"Hype guard","Penalize exaggerated career claims and low-depth clickbait."],
      [TrendingUp,"Knowledge gaps","Find what is missing in a learning path and recommend the next step."],
      [Gauge,"Continuous adaptation","Every watch, save and skip changes the next recommendation."]
    ].map(([I,t,d])=>{const Icon=I as any;return <div className="featureCard" key={String(t)}><div className="featureIcon"><Icon size={20}/></div><h3>{t as string}</h3><p>{d as string}</p></div>})}</div></section>
    <footer><div className="brand"><div className="logo"><Sparkles size={17}/></div><b>TechScroll <span>AI</span></b></div><p>Turn your scrolling habits into smarter tech discovery.</p><button onClick={()=>setPage("dashboard")}>Enter Dashboard <ArrowRight size={15}/></button></footer>
  </div>
}

function HeroVisual(){
  return <div className="heroVisual"><div className="orbit one"></div><div className="orbit two"></div><div className="aiCore"><div className="coreIcon"><Sparkles size={28}/></div><span>AI AGENT</span><b>Learning from<br/>your scrolling</b></div><div className="floatCard c1"><span>WATCH SIGNAL</span><b>94%</b><small>Java meme</small></div><div className="floatCard c2"><span>INTEREST</span><b>92%</b><small>Software Engineering</small></div><div className="floatCard c3"><span>NEXT BEST REEL</span><b>DSA</b><small>How HashMaps Work</small></div></div>
}

function Dashboard({profile,interest,gap,recs,setPage,onInteract}:{profile:StudentProfile;interest:{name:string;confidence:number};gap:string;recs:Recommendation[];setPage:(p:Page)=>void;onInteract:(r:Reel,p:Partial<Interaction>)=>void}){
  const top=recs[0]?.reel ?? reels[5];
  const watched=profile.interactions.length;
  return <div className="content">
    <div className="welcome"><div><span className="eyebrow">AI LEARNING PROFILE</span><h1>Your scroll is <span>teaching the AI.</span></h1><p>{watched?`${watched} interaction${watched>1?"s":""} analyzed. Your recommendations are adapting in real time.`:"Start scrolling and TechScroll will learn your interests without asking you to fill out a profile."}</p></div><div className="activePill"><i/> AI ENGINE ACTIVE</div></div>
    <div className="dashboardGrid">
      <section className="card bestReel"><div className="cardHeader"><div><span className="label">TODAY'S BEST REEL</span><h2>{top.title}</h2></div><span className="match">{Math.round(recs[0]?.score ?? 92)}% MATCH</span></div><div className="reelHero" style={{background:top.gradient}}><div className="playOrb"><Play fill="currentColor"/></div><div className="heroReelMeta"><b>{top.category}</b><span>{top.difficulty}</span><span>{top.duration}s</span></div></div><div className="metrics"><Metric label="Interest Match" value={Math.round(recs[0]?.breakdown["Interest Relevance"] ?? 92)}/><Metric label="Learning Value" value={top.educationalValue}/><Metric label="Skill Fit" value={Math.round(recs[0]?.breakdown["Difficulty Fit"] ?? 89)}/><Metric label="Skill Gain" value={8} suffix="%"/></div><div className="buttonRow"><button className="primaryBtn small" onClick={()=>setPage("feed")}>Watch Now <ArrowRight size={15}/></button><button className="ghostBtn small" onClick={()=>setPage("recommendations")}>Why this Reel?</button></div></section>
      <section className="card profileCard"><div className="cardHeader"><div><span className="label">AI UNDERSTANDING YOU</span><h3>{interest.name}</h3></div><div className="bigConfidence">{interest.confidence}%<small>confidence</small></div></div><p className="mutedText">The AI combines semantic content signals with how you actually behave while scrolling.</p>{Object.entries(profile.interests).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=><Progress key={k} label={k} value={Math.round(v)}/>)}</section>
    </div>
    <div className="dashboardGrid lower">
      <section className="card"><div className="cardHeader"><div><span className="label">TECHNICAL SKILLS</span><h3>What you know</h3></div><button className="linkBtn" onClick={()=>setPage("profile")}>View profile <ArrowRight size={14}/></button></div><div className="skillList">{Object.entries(profile.skills).slice(0,6).map(([k,v])=><div className="skillRow" key={k}><div><b>{k}</b><span>{v<40?"Beginner":v<70?"Intermediate":"Advanced"}</span></div><strong>{Math.round(v)}%</strong><div className="bar"><i style={{width:`${v}%`}}/></div></div>)}</div></section>
      <section className="card reasoning"><div className="cardHeader"><div><span className="label">AI REASONING</span><h3>Why you're seeing this</h3></div><Sparkles className="spark" size={19}/></div><div className="reasonBlock"><CheckCircle2/><div><b>Interest detected</b><p>{interest.name} · {interest.confidence}% confidence</p></div></div><div className="reasonBlock"><Target/><div><b>Knowledge gap</b><p>{gap} is the next high-value learning area.</p></div></div><div className="reasonBlock"><TrendingUp/><div><b>Adaptive step</b><p>The next Reel is chosen to improve skill, not just repeat a topic.</p></div></div></section>
    </div>
    <section className="card activityCard"><div className="cardHeader"><div><span className="label">LIVE AGENT ACTIVITY</span><h3>What the AI is doing now</h3></div><div className="liveDot"><i/> LIVE</div></div><div className="activityList">{[
      ["Analyzed scrolling behavior",watched?`${watched} interactions processed`:"Waiting for first interaction"],
      ["Interest cluster",interest.name],
      ["Knowledge gap",gap],
      ["Top recommendation",top.title],
      ["Recommendation confidence",`${interest.confidence}%`]
    ].map(([a,b],i)=><div key={a as string}><span className="activityTime">0{i+1}</span><b>{a}</b><em>{b}</em></div>)}</div></section>
  </div>
}

function Metric({label,value,suffix=""}:{label:string;value:number;suffix?:string}){return <div><span>{label}</span><b>{value}{suffix||"%"}</b></div>}
function Progress({label,value}:{label:string;value:number}){return <div className="progress"><div><span>{label}</span><b>{value}%</b></div><div className="bar"><i style={{width:`${value}%`}}/></div></div>}

function Feed({onInteract,profile}:{onInteract:(r:Reel,p:Partial<Interaction>)=>void;profile:StudentProfile}){
  const [active,setActive]=useState(0);
  const [progress,setProgress]=useState<Record<string,number>>({});
  const timers=useRef<Record<string,number>>({});
  function watch(r:Reel){
    timers.current[r.id]=Date.now();
  }
  function leave(r:Reel){
    const duration=timers.current[r.id]?Math.max(0,(Date.now()-timers.current[r.id])/1000):r.duration*.7;
    const pct=Math.min(100,Math.round(duration/r.duration*100));
    setProgress(p=>({...p,[r.id]:Math.max(p[r.id]??0,pct)}));
    onInteract(r,{watchPercentage:pct,watchDuration:Math.min(duration,r.duration),skipped:pct<25});
  }
  return <div className="feedPage"><div className="feedIntro"><span className="eyebrow">PASSIVE LEARNING FEED</span><h1>Just scroll. <span>We'll learn.</span></h1><p>No forms. No history upload. Your behavior is the input.</p></div><div className="feedViewport">{reels.map((r,i)=><div className={`reelSlide ${active===i?"current":""}`} key={r.id} style={{background:r.gradient}} onMouseEnter={()=>{setActive(i);watch(r)}} onMouseLeave={()=>leave(r)}><div className="reelShade"/><div className="reelContent"><div className="reelTop"><span className="categoryPill">{r.category}</span><span className="aiTag"><Sparkles size={13}/> AI analyzing</span></div><div className="reelCenter"><button className="bigPlay"><Play fill="white" size={27}/></button><div><span className="reelCreator">{r.creator}</span><h2>{r.title}</h2><p>{r.description}</p></div></div><div className="reelBottom"><div className="reelProgress"><i style={{width:`${progress[r.id]??0}%`}}/></div><div className="reelActions"><button onClick={()=>onInteract(r,{liked:true,watchPercentage:progress[r.id]??70})}><Heart size={22} fill={profile.liked.includes(r.id)?"currentColor":"none"}/><span>Like</span></button><button onClick={()=>onInteract(r,{saved:true,watchPercentage:progress[r.id]??70})}><Save size={22} fill={profile.saved.includes(r.id)?"currentColor":"none"}/><span>Save</span></button><button onClick={()=>onInteract(r,{notInterested:true,watchPercentage:progress[r.id]??15})}><X size={22}/><span>Not interested</span></button></div></div></div></div>)}</div><div className="feedHint">Scroll vertically to explore <ChevronRight size={15}/></div></div>
}

function Recommendations({recs,profile,onInteract}:{recs:Recommendation[];profile:StudentProfile;onInteract:(r:Reel,p:Partial<Interaction>)=>void}){
  const [selected,setSelected]=useState<Recommendation|null>(null);
  return <div className="content"><div className="pageIntro"><span className="eyebrow">NEXT BEST REEL ENGINE</span><h1>What should you <span>learn next?</span></h1><p>Recommendations balance interest, skill improvement, difficulty, educational value, novelty and content quality.</p></div><div className="recommendGrid">{recs.map((r,i)=><div className="recommendCard" key={r.reel.id}><div className="rank">#{i+1}</div><div className="recommendVisual" style={{background:r.reel.gradient}}><span>{r.reel.category}</span><b>{Math.round(r.score)}%</b></div><div className="recommendBody"><div className="cardHeader"><div><h3>{r.reel.title}</h3><small>{r.reel.creator}</small></div><span className={`difficulty ${r.reel.difficulty.toLowerCase()}`}>{r.reel.difficulty}</span></div><p>{r.reason}</p><div className="recStats"><span><TrendingUp size={13}/> {r.reel.educationalValue}% learning</span><span><Target size={13}/> {Math.round(r.breakdown["Difficulty Fit"])}% fit</span><span><ShieldCheck size={13}/> {r.confidence}</span></div><div className="buttonRow"><button className="primaryBtn tiny" onClick={()=>onInteract(r.reel,{watchPercentage:95,watchDuration:r.reel.duration})}>Mark watched <CheckCircle2 size={14}/></button><button className="ghostBtn tiny" onClick={()=>setSelected(r)}>Score math</button></div></div></div>)}</div>{selected&&<ScoreModal rec={selected} close={()=>setSelected(null)}/>}</div>
}

function ScoreModal({rec,close}:{rec:Recommendation;close:()=>void}){
  return <div className="modalBackdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={close}><X/></button><span className="eyebrow">EXPLAINABLE AI</span><h2>{rec.reel.title}</h2><div className="scoreHero"><b>{Math.round(rec.score)}%</b><span>recommendation match</span></div><div className="scoreRows">{Object.entries(rec.breakdown).map(([k,v])=><div key={k}><span>{k}</span><b className={k==="Hype Penalty"&&v>0?"danger":""}>{k==="Hype Penalty"?"-":""}{v}%</b></div>)}</div><div className="modalReason"><Sparkles size={17}/><p>{rec.reason}</p></div></div></div>
}

function Learning({profile,gap,recs}:{profile:StudentProfile;gap:string;recs:Recommendation[]}){
  const path=["Programming Fundamentals","Java","Collections","HashMaps","Stacks & Queues","Trees","Graphs","Algorithms","System Design"];
  const skill=Math.round(profile.skills.DSA??32);
  const current=skill<35?3:skill<55?4:skill<70?5:6;
  return <div className="content"><div className="pageIntro"><span className="eyebrow">ADAPTIVE LEARNING JOURNEY</span><h1>Your technical path <span>keeps moving.</span></h1><p>The agent uses your scrolling behavior to decide which concept should come next.</p></div><div className="learningHero card"><div><span className="label">CURRENT FOCUS</span><h2>{gap}</h2><p>Your interest is ahead of your current skill here, so TechScroll is nudging you toward the next prerequisite.</p></div><div className="growthCircle"><b>{skill}%</b><span>DSA skill</span></div></div><div className="path">{path.map((x,i)=><div className={`pathNode ${i<current?"done":i===current?"now":""}`} key={x}><div className="node"><span>{i<current?<CheckCircle2 size={17}/>:i+1}</span></div><div><b>{x}</b><small>{i<current?"Learned":i===current?"Current focus":"Next step"}</small></div>{i<path.length-1&&<div className="connector"/>}</div>)}</div><div className="card nextLearning"><div><span className="label">NEXT BEST REEL</span><h2>{recs[0]?.reel.title}</h2><p>{recs[0]?.reason}</p></div><div className="nextBadge">+8%<small>estimated skill gain</small></div></div></div>
}

function Profile({profile,interest}:{profile:StudentProfile;interest:{name:string;confidence:number}}){
  return <div className="content"><div className="pageIntro"><span className="eyebrow">AI-GENERATED PROFILE</span><h1>What the AI <span>thinks you like.</span></h1><p>This profile is inferred from scrolling behavior — not a questionnaire.</p></div><div className="profileGrid"><section className="card"><div className="cardHeader"><div><span className="label">INTERESTS</span><h3>{interest.name}</h3></div><span className="statusBadge">{interest.confidence}% confidence</span></div>{Object.entries(profile.interests).sort((a,b)=>b[1]-a[1]).map(([k,v])=><Progress key={k} label={k} value={Math.round(v)}/>)}</section><section className="card"><div className="cardHeader"><div><span className="label">SKILLS</span><h3>What you know</h3></div></div>{Object.entries(profile.skills).sort((a,b)=>b[1]-a[1]).map(([k,v])=><Progress key={k} label={`${k} · ${v<40?"Beginner":v<70?"Intermediate":"Advanced"}`} value={Math.round(v)}/>)}</section></div><section className="card insightBox"><div className="featureIcon"><Brain/></div><div><span className="label">AI INTERPRETATION</span><h2>Your interest is not a keyword.</h2><p>The agent connects related behavioral signals into broader clusters. A Java meme, an interview joke and a developer laptop review can collectively indicate Software Engineering / Technology rather than a demand for more Java memes.</p></div></section></div>
}

function Analytics({profile}:{profile:StudentProfile}){
  const interestData=Object.entries(profile.interests).map(([name,value])=>({name,value:Math.round(value)}));
  const skillData=Object.entries(profile.skills).slice(0,7).map(([name,value])=>({name,value:Math.round(value)}));
  const growth=[{day:"Mon",value:22},{day:"Tue",value:31},{day:"Wed",value:38},{day:"Thu",value:46},{day:"Fri",value:55},{day:"Sat",value:63},{day:"Today",value:Math.round(63+profile.conceptsLearned*3)}];
  return <div className="content"><div className="pageIntro"><span className="eyebrow">LEARNING ANALYTICS</span><h1>Is your scrolling <span>getting better?</span></h1><p>Track how passive behavior is turning into technical progress.</p></div><div className="analyticsStats"><Stat icon={Video} value={profile.interactions.length} label="Reels analyzed"/><Stat icon={TrendingUp} value={`${Math.round(profile.technicalMinutes)}m`} label="Technical time"/><Stat icon={Brain} value={profile.conceptsLearned} label="Concepts learned"/><Stat icon={Trophy} value={`+${profile.skillImprovements*2}%`} label="Growth signal"/></div><div className="chartGrid"><section className="card chartCard"><div className="cardHeader"><div><span className="label">INTEREST DISTRIBUTION</span><h3>What pulls your attention</h3></div></div><ResponsiveContainer width="100%" height={310}><RadarChart data={interestData}><PolarGrid stroke="#253044"/><PolarAngleAxis dataKey="name" tick={{fill:"#8d9ab2",fontSize:11}}/><PolarRadiusAxis tick={false} axisLine={false}/><Radar dataKey="value" stroke="#8b7cff" fill="#8b7cff" fillOpacity={0.22}/></RadarChart></ResponsiveContainer></section><section className="card chartCard"><div className="cardHeader"><div><span className="label">TECHNICAL GROWTH</span><h3>Skill progress over time</h3></div></div><ResponsiveContainer width="100%" height={310}><RLineChart data={growth}><XAxis dataKey="day" stroke="#69758c" fontSize={11}/><YAxis stroke="#69758c" fontSize={11}/><Tooltip contentStyle={{background:"#101624",border:"1px solid #27324a",borderRadius:10}}/><Line type="monotone" dataKey="value" stroke="#6f8cff" strokeWidth={3} dot={{r:3}}/></RLineChart></ResponsiveContainer></section><section className="card chartCard"><div className="cardHeader"><div><span className="label">SKILL PROFILE</span><h3>Current technical depth</h3></div></div><ResponsiveContainer width="100%" height={310}><BarChart data={skillData} layout="vertical"><XAxis type="number" domain={[0,100]} stroke="#69758c"/><YAxis dataKey="name" type="category" width={90} stroke="#69758c" fontSize={11}/><Tooltip contentStyle={{background:"#101624",border:"1px solid #27324a",borderRadius:10}}/><Bar dataKey="value" fill="#6f8cff" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></section><section className="card growthCard"><span className="label">SCROLLING QUALITY</span><h3>Before vs. after</h3><div className="quality"><div><span>Entertainment-heavy</span><b>72%</b><i style={{width:"72%"}}/></div><div><span>Educational / career value</span><b>{Math.min(94,38+profile.conceptsLearned*4)}%</b><i style={{width:`${Math.min(94,38+profile.conceptsLearned*4)}%`}}/></div></div><div className="qualityFoot"><Sparkles size={16}/> The goal isn't less scrolling. It's more valuable scrolling.</div></section></div></div>
}

function Stat({icon:Icon,value,label}:{icon:any;value:any;label:string}){return <div className="statCard"><div className="statIcon"><Icon size={18}/></div><b>{value}</b><span>{label}</span></div>}

function Architecture(){
  const nodes=[
    ["01","Student Scrolling","Behavior is the raw signal.",Video],
    ["02","Interaction Tracking","Watch, save, like, skip and replay.",Activity],
    ["03","Content Understanding","Topic, context, depth and hype.",Brain],
    ["04","Interest Clustering","Connect related signals semantically.",Network],
    ["05","Skill Estimation","Separate interest from knowledge.",Gauge],
    ["06","Knowledge Gaps","Find missing prerequisites.",Target],
    ["07","Recommendation Scoring","Rank the next best Reel.",Sparkles],
    ["08","Hype Guard","Reduce low-value clickbait.",ShieldCheck],
    ["09","Feedback Loop","Every scroll updates the model.",RefreshCw]
  ];
  return <div className="content"><div className="pageIntro"><span className="eyebrow">SYSTEM ARCHITECTURE</span><h1>From a scroll <span>to a learning decision.</span></h1><p>The recommendation loop is explainable, modular and reliable without an external API.</p></div><div className="architectureFlow">{nodes.map(([n,t,d,I],i)=>{const Icon=I as any;return <div className="archNode" key={n as string}><div className="archNum">{n as string}</div><div className="archIcon"><Icon size={19}/></div><div><h3>{t as string}</h3><p>{d as string}</p></div>{i<nodes.length-1&&<ArrowRight className="archArrow"/>}</div>})}</div><div className="card formula"><span className="label">RECOMMENDATION FORMULA</span><h2>Score = Interest + Skill Improvement + Fit + Learning Value + Career + Novelty − Hype</h2><p>The weights are configurable so the judge can see that engagement alone does not decide the result.</p></div></div>
}

function DemoOverlay({step,setStep,close}:{step:number;setStep:(s:number)=>void;close:()=>void}){
  const steps=[
    ["01","Java meme","94% watched","Programming signal detected"],
    ["02","Software Engineer lifestyle","87% watched","Career + Software Engineering signal"],
    ["03","Coding interview joke","91% watched","DSA signal increasing"],
    ["04","Developer laptop","82% watched","Technology / Hardware signal"],
    ["05","AI synthesis","92% confidence","Software Engineering / Technology"],
    ["06","Keyword trap rejected","Too narrow","More Java recommendation rejected"],
    ["07","Hype Guard","92 hype score","Low-depth career hype penalized"],
    ["08","Next Best Reel","92% match","How HashMaps Actually Work"],
    ["09","Skill update","48% → 56%","DSA skill increased"],
    ["10","Next learning step","Recommended","Stacks & Queues Explained"]
  ];
  const s=steps[step];
  return <div className="demoOverlay"><div className="demoPanel"><div className="demoHead"><div><span className="eyebrow">LIVE HACKATHON DEMO</span><h2>TechScroll reasoning replay</h2></div><button onClick={close}><X/></button></div><div className="demoProgress"><i style={{width:`${((step+1)/steps.length)*100}%`}}/></div><div className="demoBody"><div className="demoNumber">{s[0]}</div><div className="demoMain"><span className="label">STEP {step+1} / {steps.length}</span><h1>{s[1]}</h1><div className="demoMetric">{s[2]}</div><p><Sparkles size={16}/>{s[3]}</p>{step===4&&<div className="demoResult"><Brain size={24}/><div><span>INTEREST DETECTED</span><b>Software Engineering / Technology</b></div><strong>92%</strong></div>}{step===7&&<div className="demoResult good"><CheckCircle2 size={24}/><div><span>RECOMMENDED</span><b>How HashMaps Actually Work</b></div><strong>92%</strong></div>}</div></div><div className="demoControls"><button onClick={()=>setStep(Math.max(0,step-1))}>Previous</button><div className="stepDots">{steps.map((_,i)=><i key={i} className={i<=step?"on":""}/>)}</div>{step<steps.length-1?<button className="primaryBtn small" onClick={()=>setStep(step+1)}>Next step <ArrowRight size={15}/></button>:<button className="primaryBtn small" onClick={close}>Finish demo <CheckCircle2 size={15}/></button>}</div></div></div>
}

export default App;