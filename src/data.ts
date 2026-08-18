import { Reel } from "./types";

export const reels: Reel[] = [
  {
    id:"r1", title:"POV: Your Java code works on the first try", creator:"@bytehumor",
    category:"Java", topics:["Java","Programming"], relatedTopics:["Software Engineering","Developer Culture"],
    context:"Programming humor", difficulty:"Beginner", technicalDepth:18, educationalValue:22,
    careerRelevance:35, entertainmentValue:94, hypeScore:8, duration:18,
    description:"A developer meme about the rare moment when a Java program compiles first try.",
    gradient:"linear-gradient(135deg,#ff7a18,#af002d 70%,#319197)"
  },
  {
    id:"r2", title:"A Day in the Life of a Software Engineer", creator:"@devdiary",
    category:"Career", topics:["Software Engineering","Career"], relatedTopics:["Programming","Backend"],
    context:"Developer lifestyle and career", difficulty:"Beginner", technicalDepth:38, educationalValue:58,
    careerRelevance:91, entertainmentValue:76, hypeScore:12, duration:32,
    description:"A realistic look at planning, coding, code review, debugging and team collaboration.",
    gradient:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
  },
  {
    id:"r3", title:"Coding Interview Be Like...", creator:"@algomeme",
    category:"DSA", topics:["DSA","Coding Interviews"], relatedTopics:["Software Engineering","Algorithms"],
    context:"Coding interview humor", difficulty:"Beginner", technicalDepth:28, educationalValue:34,
    careerRelevance:84, entertainmentValue:91, hypeScore:10, duration:21,
    description:"A relatable short about debugging under interview pressure.",
    gradient:"linear-gradient(135deg,#232526,#414345)"
  },
  {
    id:"r4", title:"MacBook vs Gaming Laptop — Which Developer Should Buy?", creator:"@devgear",
    category:"Hardware", topics:["Hardware","Developer Setup"], relatedTopics:["Technology","Software Engineering"],
    context:"Developer hardware comparison", difficulty:"Beginner", technicalDepth:55, educationalValue:63,
    careerRelevance:62, entertainmentValue:74, hypeScore:18, duration:38,
    description:"CPU, RAM, battery, thermals and portability from a developer perspective.",
    gradient:"linear-gradient(135deg,#141e30,#243b55)"
  },
  {
    id:"r5", title:"10 AI Tools That Will Get You a Job", creator:"@futurehacks",
    category:"AI", topics:["AI","Career"], relatedTopics:["Productivity","Career"],
    context:"Career hype listicle", difficulty:"Beginner", technicalDepth:21, educationalValue:28,
    careerRelevance:77, entertainmentValue:80, hypeScore:92, duration:29,
    description:"A click-heavy list of AI tools with exaggerated employment claims.",
    gradient:"linear-gradient(135deg,#4b134f,#c94b4b)"
  },
  {
    id:"r6", title:"How HashMaps Actually Work", creator:"@understandcode",
    category:"DSA", topics:["HashMap","DSA","Java"], relatedTopics:["Algorithms","Java","Data Structures"],
    context:"Technical deep dive", difficulty:"Intermediate", technicalDepth:94, educationalValue:94,
    careerRelevance:89, entertainmentValue:48, hypeScore:4, duration:54,
    description:"Buckets, hashing, collisions, resizing and why HashMaps matter in real systems.",
    gradient:"linear-gradient(135deg,#0b486b,#f56217)"
  },
  {
    id:"r7", title:"How LLMs Actually Generate Code", creator:"@mlinside",
    category:"AI", topics:["AI","LLM","Programming"], relatedTopics:["Machine Learning","Software Engineering"],
    context:"Technical AI explainer", difficulty:"Intermediate", technicalDepth:91, educationalValue:95,
    careerRelevance:88, entertainmentValue:58, hypeScore:5, duration:59,
    description:"A visual explanation of tokens, context, next-token prediction and code generation.",
    gradient:"linear-gradient(135deg,#200122,#6f0000,#200122)"
  },
  {
    id:"r8", title:"What Happens After You Push Code?", creator:"@cloudnative",
    category:"Cloud", topics:["Cloud","DevOps","Git"], relatedTopics:["CI/CD","Backend"],
    context:"Cloud engineering explainer", difficulty:"Beginner", technicalDepth:76, educationalValue:88,
    careerRelevance:87, entertainmentValue:55, hypeScore:6, duration:46,
    description:"From git push to CI, tests, containers and deployment.",
    gradient:"linear-gradient(135deg,#1e3c72,#2a5298)"
  },
  {
    id:"r9", title:"Binary Trees Explained in 60 Seconds", creator:"@dsashorts",
    category:"DSA", topics:["Trees","DSA"], relatedTopics:["Algorithms","Graphs"],
    context:"Data structures lesson", difficulty:"Intermediate", technicalDepth:88, educationalValue:92,
    careerRelevance:86, entertainmentValue:46, hypeScore:3, duration:60,
    description:"Nodes, roots, leaves, traversals and why trees appear in interviews.",
    gradient:"linear-gradient(135deg,#134e5e,#71b280)"
  },
  {
    id:"r10", title:"System Design Explained for Beginners", creator:"@backendbits",
    category:"HLD", topics:["System Design","HLD"], relatedTopics:["Backend","Cloud"],
    context:"Architecture fundamentals", difficulty:"Beginner", technicalDepth:79, educationalValue:91,
    careerRelevance:92, entertainmentValue:44, hypeScore:5, duration:57,
    description:"Servers, databases, caches and load balancers using a simple mental model.",
    gradient:"linear-gradient(135deg,#16222a,#3a6073)"
  },
  {
    id:"r11", title:"Git Commands Every Developer Should Know", creator:"@terminaltips",
    category:"Programming", topics:["Git","Programming"], relatedTopics:["DevOps","Software Engineering"],
    context:"Developer productivity", difficulty:"Beginner", technicalDepth:72, educationalValue:84,
    careerRelevance:86, entertainmentValue:50, hypeScore:4, duration:42,
    description:"Practical commands for branches, logs, diffs, stash and recovery.",
    gradient:"linear-gradient(135deg,#42275a,#734b6d)"
  },
  {
    id:"r12", title:"How APIs Actually Work", creator:"@backendin60",
    category:"Programming", topics:["APIs","Backend"], relatedTopics:["Software Engineering","Cloud"],
    context:"Backend fundamentals", difficulty:"Beginner", technicalDepth:82, educationalValue:93,
    careerRelevance:90, entertainmentValue:50, hypeScore:3, duration:55,
    description:"Requests, responses, endpoints, status codes and authentication.",
    gradient:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"
  },
  {
    id:"r13", title:"Java Collections Explained", creator:"@javadeep",
    category:"Java", topics:["Java","Collections"], relatedTopics:["DSA","Programming"],
    context:"Java technical lesson", difficulty:"Intermediate", technicalDepth:86, educationalValue:91,
    careerRelevance:90, entertainmentValue:45, hypeScore:4, duration:52,
    description:"Lists, sets, maps and choosing the right collection.",
    gradient:"linear-gradient(135deg,#1a2a6c,#b21f1f,#fdbb2d)"
  },
  {
    id:"r14", title:"REST API vs GraphQL", creator:"@webdecoded",
    category:"Programming", topics:["REST","GraphQL","Backend"], relatedTopics:["APIs","System Design"],
    context:"Backend comparison", difficulty:"Intermediate", technicalDepth:83, educationalValue:88,
    careerRelevance:84, entertainmentValue:49, hypeScore:6, duration:49,
    description:"When each API style makes sense and the tradeoffs to remember.",
    gradient:"linear-gradient(135deg,#355c7d,#6c5b7b,#c06c84)"
  },
  {
    id:"r15", title:"Cloud Engineer Day in the Life", creator:"@cloudjourney",
    category:"Cloud", topics:["Cloud","Career"], relatedTopics:["DevOps","Software Engineering"],
    context:"Cloud career", difficulty:"Beginner", technicalDepth:45, educationalValue:61,
    careerRelevance:92, entertainmentValue:73, hypeScore:9, duration:35,
    description:"Tickets, deployments, monitoring and incident response in a cloud role.",
    gradient:"linear-gradient(135deg,#00c6ff,#0072ff)"
  },
  {
    id:"r16", title:"How Authentication Works", creator:"@securebytes",
    category:"Cybersecurity", topics:["Cybersecurity","Authentication"], relatedTopics:["Backend","Web Security"],
    context:"Security explainer", difficulty:"Intermediate", technicalDepth:90, educationalValue:93,
    careerRelevance:88, entertainmentValue:47, hypeScore:3, duration:53,
    description:"Sessions, tokens, passwords and why authentication is different from authorization.",
    gradient:"linear-gradient(135deg,#000428,#004e92)"
  },
  {
    id:"r17", title:"SQL Joins in 60 Seconds", creator:"@databites",
    category:"Programming", topics:["SQL","Databases"], relatedTopics:["Backend","DSA"],
    context:"Database lesson", difficulty:"Beginner", technicalDepth:82, educationalValue:91,
    careerRelevance:88, entertainmentValue:52, hypeScore:3, duration:60,
    description:"Inner, left and right joins with a simple visual.",
    gradient:"linear-gradient(135deg,#1d4350,#a43931)"
  },
  {
    id:"r18", title:"Why Big O Matters", creator:"@algolab",
    category:"DSA", topics:["Big O","Algorithms","DSA"], relatedTopics:["Coding Interviews","Programming"],
    context:"Algorithm fundamentals", difficulty:"Beginner", technicalDepth:85, educationalValue:93,
    careerRelevance:91, entertainmentValue:44, hypeScore:3, duration:48,
    description:"How complexity changes the performance of real programs.",
    gradient:"linear-gradient(135deg,#232526,#414345,#0f2027)"
  },
  {
    id:"r19", title:"Docker Explained", creator:"@devopsdaily",
    category:"Cloud", topics:["Docker","DevOps"], relatedTopics:["Cloud","Backend"],
    context:"DevOps explainer", difficulty:"Intermediate", technicalDepth:89, educationalValue:93,
    careerRelevance:91, entertainmentValue:48, hypeScore:4, duration:56,
    description:"Images, containers and why Docker changed software delivery.",
    gradient:"linear-gradient(135deg,#00b4db,#0083b0)"
  },
  {
    id:"r20", title:"How Neural Networks Learn", creator:"@aifundamentals",
    category:"AI", topics:["AI","Machine Learning"], relatedTopics:["Algorithms","Python"],
    context:"Machine learning explainer", difficulty:"Beginner", technicalDepth:88, educationalValue:94,
    careerRelevance:82, entertainmentValue:54, hypeScore:4, duration:58,
    description:"Weights, loss and gradient descent in a visual beginner-friendly explanation.",
    gradient:"linear-gradient(135deg,#41295a,#2f0743)"
  },
];

export const defaultInterests: Record<string, number> = {
  "Software Engineering": 18, AI: 18, DSA: 18, Java: 18,
  Hardware: 16, Cloud: 12, Cybersecurity: 10, "System Design": 8
};

export const defaultSkills: Record<string, number> = {
  Java: 42, DSA: 32, Algorithms: 24, AI: 20, Cloud: 15,
  Cybersecurity: 12, "System Design": 10, Python: 22
};