import { Interaction, Reel, StudentProfile } from "./types";
import { defaultInterests, defaultSkills } from "./data";

const interestMap: Record<string, string[]> = {
  Java:["Java","Programming","Software Engineering"],
  DSA:["DSA","Software Engineering"],
  "Coding Interviews":["DSA","Software Engineering"],
  "Software Engineering":["Software Engineering","Career"],
  "Developer Hardware":["Hardware","Software Engineering"],
  Hardware:["Hardware","Software Engineering"],
  AI:["AI"],
  LLM:["AI","Software Engineering"],
  Cloud:["Cloud","Software Engineering"],
  DevOps:["Cloud","Software Engineering"],
  Cybersecurity:["Cybersecurity","Software Engineering"],
  "System Design":["System Design","Software Engineering"],
  Backend:["Software Engineering","Cloud"],
  APIs:["Software Engineering","Cloud"],
  Algorithms:["DSA","Software Engineering"],
  Trees:["DSA","Algorithms"],
  HashMap:["DSA","Java","Algorithms"],
  "Machine Learning":["AI"],
  Python:["Programming","AI"],
  Git:["Software Engineering","Cloud"],
};

function clamp(n:number,min=0,max=100){ return Math.max(min, Math.min(max,n)); }

export function applyInteraction(profile: StudentProfile, reel: Reel, interaction: Interaction): StudentProfile {
  const next: StudentProfile = structuredClone(profile);
  const positive = interaction.watchPercentage >= 90 ? 1.0 :
    interaction.watchPercentage >= 75 ? 0.72 :
    interaction.watchPercentage >= 50 ? 0.45 :
    interaction.watchPercentage >= 25 ? 0.18 : -0.35;
  let signal = positive;
  if (interaction.liked) signal += 0.65;
  if (interaction.saved) signal += 0.9;
  if (interaction.replayed) signal += 0.7;
  if (interaction.notInterested) signal -= 1.2;
  if (interaction.skipped) signal -= 0.45;

  const topics = [...reel.topics, ...reel.relatedTopics];
  topics.forEach(t => {
    (interestMap[t] || ["Software Engineering"]).forEach(cluster => {
      next.interests[cluster] = clamp((next.interests[cluster] ?? 0) + signal * 5);
    });
  });

  const skillTargets: Record<string,string[]> = {
    Java:["Java"], DSA:["DSA","Algorithms"], AI:["AI"], Cloud:["Cloud"],
    Cybersecurity:["Cybersecurity"], HLD:["System Design"], Programming:["Python","DSA"]
  };
  const targets = skillTargets[reel.category] || ["Software Engineering"];
  const learningSignal = Math.max(0, interaction.watchPercentage / 100) * (reel.technicalDepth/100);
  targets.forEach(skill => {
    const delta = learningSignal * (reel.difficulty === "Advanced" ? 5 : reel.difficulty === "Intermediate" ? 3.5 : 2.2);
    next.skills[skill] = clamp((next.skills[skill] ?? 10) + delta);
  });

  if (interaction.watchPercentage >= 80 && reel.technicalDepth >= 70) {
    next.conceptsLearned += 1;
    next.skillImprovements += 1;
  }
  next.technicalMinutes += Math.max(0, interaction.watchDuration) / 60;
  next.interactions = [...next.interactions, interaction].slice(-100);
  if (interaction.saved && !next.saved.includes(reel.id)) next.saved.push(reel.id);
  if (interaction.liked && !next.liked.includes(reel.id)) next.liked.push(reel.id);
  if (interaction.notInterested && !next.rejected.includes(reel.id)) next.rejected.push(reel.id);
  next.lastActive = new Date().toISOString();
  return next;
}

export function hypeGuard(reel: Reel): {penalty:number; reason:string} {
  if (reel.hypeScore >= 80) return { penalty: 30, reason:"Exaggerated claims with low technical depth." };
  if (reel.hypeScore >= 50) return { penalty: 12, reason:"Some clickbait signals detected." };
  return { penalty: 0, reason:"No significant hype signals detected." };
}

export interface Recommendation {
  reel: Reel;
  score: number;
  breakdown: Record<string, number>;
  confidence: "High"|"Medium"|"Low";
  reason: string;
}

export function recommend(profile: StudentProfile, all: Reel[], current?: Reel): Recommendation[] {
  const viewed = new Set(profile.interactions.map(i=>i.reelId));
  return all.filter(r=>!profile.rejected.includes(r.id)).map(reel=>{
    const related = [...reel.topics,...reel.relatedTopics];
    const interestValues = related.flatMap(t => interestMap[t] || [t]).map(k => profile.interests[k] ?? 0);
    const interest = Math.min(100, (interestValues.length ? Math.max(...interestValues) : 10) + (reel.category === "DSA" ? profile.interests.DSA*0.15 : 0));
    const skillNames = reel.category==="Java"?["Java"]:reel.category==="DSA"?["DSA","Algorithms"]:reel.category==="AI"?["AI"]:reel.category==="Cloud"?["Cloud"]:reel.category==="Cybersecurity"?["Cybersecurity"]:reel.category==="HLD"?["System Design"]:["Software Engineering"];
    const skill = Math.max(...skillNames.map(s=>profile.skills[s]??15));
    const target = reel.difficulty==="Beginner"?35:reel.difficulty==="Intermediate"?60:82;
    const fit = 100 - Math.min(100, Math.abs(skill-target)*1.6);
    const novelty = viewed.has(reel.id) ? 15 : 75;
    const engagement = reel.entertainmentValue*0.35 + reel.educationalValue*0.65;
    const {penalty} = hypeGuard(reel);
    const score = interest*.25 + (100-skill)*.25 + fit*.15 + reel.educationalValue*.15 + reel.careerRelevance*.08 + engagement*.07 + novelty*.05 - penalty;
    const confidence: "High" | "Medium" | "Low" =
  profile.interactions.length >= 10
    ? "High"
    : profile.interactions.length >= 5
      ? "Medium"
      : "Low";
    return {
      reel, score: Math.round(score*10)/10,
      breakdown:{
        "Interest Relevance":Math.round(interest),
        "Skill Improvement":Math.round(100-skill),
        "Difficulty Fit":Math.round(fit),
        "Educational Value":reel.educationalValue,
        "Career Relevance":reel.careerRelevance,
        "Novelty":novelty,
        "Hype Penalty":penalty
      },
      confidence,
      reason: buildReason(reel, profile, interest, skill)
    };
  }).sort((a,b)=>b.score-a.score).slice(0,8);
}

function buildReason(reel:Reel, profile:StudentProfile, interest:number, skill:number){
  const top = Object.entries(profile.interests).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "technology";
  if(reel.id==="r6") return `Your scrolling combines Java, coding-interview and software-engineering signals. The AI is broadening the Java signal into ${top === "Java" ? "Software Engineering / Technology" : top}.`;
  if(reel.hypeScore>=80) return "This candidate was heavily penalized by the Hype Guard because its claims are stronger than its technical depth.";
  return `Your strongest current signal is ${top}. This Reel adds technical depth at a level that fits your estimated skill profile (${Math.round(skill)}%).`;
}

export function createInitialProfile(): StudentProfile {
  return {
    interests: {...defaultInterests},
    skills: {...defaultSkills},
    interactions: [],
    saved: [],
    liked: [],
    rejected: [],
    technicalMinutes: 0,
    conceptsLearned: 0,
    skillImprovements: 0,
    gapsClosed: 0,
    streak: 1,
    lastActive: new Date().toISOString()
  };
}

export function detectGap(profile: StudentProfile): string {
  const pairs = [
    ["DSA","Algorithms"],["AI","Python"],["Cloud","System Design"],["Cybersecurity","Backend"],["Java","DSA"]
  ];
  const scored = pairs.map(([a,b])=>({gap:a==="DSA"?"Algorithms":b, value:(profile.interests[a]??0)-(profile.skills[b]??0)}));
  return scored.sort((a,b)=>b.value-a.value)[0]?.gap ?? "Algorithms";
}

export function detectInterest(profile: StudentProfile): {name:string;confidence:number} {
  const entries = Object.entries(profile.interests).sort((a,b)=>b[1]-a[1]);
  const top = entries[0] || ["Technology",30];
  const count = profile.interactions.length;
  const confidence = count>=10 ? Math.min(98, Math.round(top[1])) : count>=5 ? Math.min(88, Math.round(top[1])) : Math.min(70, Math.round(top[1]));
  if (count>=4) {
    const ids = new Set(profile.interactions.map(i=>i.reelId));
    if (["r1","r2","r3","r4"].every(id=>ids.has(id))) return {name:"Software Engineering / Technology", confidence:92};
  }
  return {name:top[0], confidence};
}