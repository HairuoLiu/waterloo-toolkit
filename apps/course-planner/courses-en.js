/* ============================================================
   course-planner · 112 门课程英文数据层（自动生成，请勿手改）
   ------------------------------------------------------------
   来源：i18n-work/course-a/…partA.js（56 门）+ course-b/…partB.js（56 门）
   合并后与源表 const C 的 112 个键一一对应，零重叠、零缺失。
   只提供 *_en 字段；中文模式回落到源表的原字段（无后缀）。
   ============================================================ */
window.UW_COURSE_EN = {
  "ECE 650":{
  desc_en:"Considered by many the most 'bootcamp-style' course in the whole MEng: four tracks run in parallel — systems programming (C/C++/Python, fork, pipe, IPC, concurrency and locks), math logic (propositional, predicate, SAT satisfiability), OS principles, and data-structures/algorithm complexity.",
  proj_en:"One large term-long project: solve minimum vertex cover with a SAT solver — write a multi-process C++ program, hook into MiniSat, do performance comparison. This project is solid interview material. Plus A0–A4 programming assignments + a final.",
  pre_en:"Knowing one programming language is enough, but lacking C/C++ experience will be tough. Review pointers, Makefile, and CMake before the term starts.",
  why_en:"Almost every follow-up ECE software course treats it as a prerequisite (ECE 653 explicitly lists prereq: ECE 650). What it teaches — multiprocessing, concurrency, Unix system calls — is exactly what big-tech interviews probe most. It appears in all four plans (four times), not by chance.",
  alt_en:"If a time conflict: it runs again in F2027 (taught by Ward). But the later you take it, the more it blocks follow-ups like 653; not advised to postpone."
 },
  "ECE 651":{
  desc_en:"Engineering practice and design: requirements analysis, UML modeling (class/sequence/state diagrams), modularity, cohesion and coupling, OO design principles, software architecture styles, sync/async communication, verification and validation, configuration management, software metrics, cost-estimation models, and agile development.",
  proj_en:"<b>The core is a full-term team project</b> with a free choice of topic, following the complete agile flow: requirements doc → architecture design → iterative dev → testing → demo. Prof. Czarnecki is a well-known scholar in model-driven development.",
  pre_en:"Having built a reasonably sized project is enough. Teamwork matters more than coding ability.",
  why_en:"<b>One of the few courses that feeds both the 'technical project' and the 'behavioral interview' at once.</b> Make the team project a real product tied to your interests — e.g., a clip assistant that auto-tags an asset library with vision-language models and picks shots by mood. Three birds with one stone: earn credit, build a GitHub portfolio, and have a real story for teamwork/tech-choice questions in interviews. <b>Practical note:</b> the only course whose project can be detailed on a resume to answer behavioral questions (BQ) — suggest a web project + integrated AI.",
  alt_en:"Offered only in Winter. If your Winter term is a work term, you must wait until the next Winter — a real cost in Plan 3."
 },
  "ECE 653":{
  desc_en:"The name sounds like 'writing test cases', but the content is far harder: coverage criteria (graph, data-flow, logic), symbolic execution (static/dynamic/concolic), SMT solving (Z3), inductive invariants, automated deductive verification, Dafny, software model checking, automated exploit generation.",
  proj_en:"Mostly Java/C/Python coding: build a symbolic-execution engine, solve constraints with Z3, write contract-based verifiable programs in Dafny. Two quizzes + final.",
  pre_en:"<b>Hard prerequisite: ECE 650</b> (or 750 Tpc 26, or instructor consent). Compiler and mathematical-logic background helps but is not required.",
  why_en:"The third required course for the Software stream certification. Its job-hunt value depends on your goal — for roles needing rigor (finance, infrastructure, security) it is high-value; for standard product-line SWE, ECE 751 or 656 give better ROI. <b>Practical note (from a graduated alumnus):</b> writing a compiler in Python, with huge assignment volume + huge exam scope + deep-dive content + project — the most painful ECE course; strongly advise against taking it alongside other hard courses.",
  alt_en:"Offered only in Spring. If S2027 is a work term, consider <b>ECE 654 Software Reliability Engineering</b> (same term, taught by Ward, slightly easier) or <b>CS 846 Topics in Software Testing and Debugging</b>."
 },
  "ECE 654":{
  desc_en:"Two parts: first, engineering methods for reliable software — reliability modeling, fault-tolerant design patterns, failure-recovery mechanisms; second, secure software development — major vulnerability types and exploits, secure dev process, threat modeling.",
  proj_en:"Analysis and design oriented; lighter coding load than ECE 653. Prof. Paul Ward has a good teaching reputation.",
  pre_en:"Software-development experience; no hard prerequisite.",
  why_en:"In the S2027 term, it is the lighter-load alternative to ECE 653. The 'reliability + security' combo is useful for backend/infrastructure interviews.",
  alt_en:"Same-term ECE 653 (harder), ECE 652 (embedded safety-critical software)."
 },
  "ECE 655":{
  desc_en:"Architecture, protocols, and software of mobile communication/computing systems: ad hoc networks, mobile network/transport layers, wireless application protocols, mobility support, service discovery, context-aware software, low-power protocols.",
  proj_en:"Concept and protocol analysis, little coding. <b>Known for open-book exams and student-friendly grading.</b>",
  pre_en:"None. Networking basics makes it easier.",
  why_en:"The lowest workload among ECE grad software courses. Its value is not the content but <b>the time it frees up</b> — when you need a term to focus on LeetCode, job applications, or your own projects, it is the most economical way to fill full-time credit requirements.",
  alt_en:"Another light option in F2026 is ECE 750 T45 Responsible AI (seminar)."
 },
  "ECE 656":{
  desc_en:"Data models, file organization and index structures, DBMS architecture, query languages and optimization, transactions and concurrency control, integrity and security, DB design normal forms.",
  proj_en:"Hands-on SQL and DB-design assignments; some terms have a larger final project.",
  pre_en:"No hard prerequisite; knowing SQL helps.",
  why_en:"Databases are a standard backend-SWE interview area (index principles, transaction isolation levels, query optimization, sharding). This course turns memorized trivia into real understanding.",
  alt_en:"Cross-department swap: <b>CS 848 SEM 002 Modern Database Systems</b> (seminar, F2026) or <b>CS 848 SEM 001 Relational, Vector, and Hybrid Indexing</b> (closer to AI infrastructure)."
 },
  "ECE 751":{
  desc_en:"Core theory and practice of distributed systems: consistency models, consensus algorithms, replication and fault tolerance, partition tolerance, distributed transactions, network-centric system architecture. Wojciech Golab is an active researcher in distributed computing.",
  proj_en:"System-implementation assignments; build distributed components by hand.",
  pre_en:"OS, networking, concurrency-programming basics. Having taken ECE 650 helps a lot.",
  why_en:"<b>The front line of big-tech system-design interviews.</b> Concepts like CAP, Raft/Paxos, eventual consistency — an interviewer tells in three follow-ups whether you learned them in class or memorized them from interview prep.",
  alt_en:"Cross-dept swap: <b>CS 654 Distributed Systems</b> (F2026, uses a non-ECE slot); in-dept swap: <b>ECE 750 T39 Scalable Computing System Design</b> (Fall, large-scale parallel system design)."
 },
  "ECE 606":{
  desc_en:"Standard grad algorithms course, largely following CLRS: divide-and-conquer, greedy, DP, graph algorithms, amortized analysis, NP-completeness proofs, approximation algorithms, randomized algorithms. Prof. Mahesh Tripunitara is known for rigor.",
  proj_en:"<b>No large project</b>; instead dense weekly assignments + midterm + final. Proof-heavy; you cannot pass by coding alone.",
  pre_en:"Solid discrete-math and data-structures foundation. This is the only course flagged difficulty 5 in the catalog.",
  why_en:"Two reasons: <b>first, it is on the AI &amp; ML stream certification's elective list</b>, doing two jobs at once; <b>second, it builds the same underlying muscle as LeetCode practice</b> — once DP/graph/greedy intuition is trained, on-the-spot derivation beats memorization in interviews. The cost: it genuinely eats a large chunk of your first term.",
  alt_en:"If you want a lighter first term: swap to <b>ECE 750 T39 Scalable Computing System Design</b> or <b>ECE 750 T41 LLM × Software Engineering</b>, pushing 606 to F2027 (it runs again). But F2027 is a work term in several plans — decide early."
 },
  "ECE 621":{
  desc_en:"Processor microarchitecture, instruction-level parallelism, pipelining and out-of-order execution, cache and memory hierarchy, multicore and coherence protocols, performance modeling.",
  proj_en:"Usually a simulator lab (e.g., gem5-style tools).",
  pre_en:"Undergraduate computer organization.",
  why_en:"Directly useful for roles in low-level systems, compilers, performance optimization, or AI inference acceleration. Lower priority for standard application-layer SWE.",
  alt_en:"ECE 750 T39 (system-design view) or ECE 720 T10 AI/ML Hardware (S2027, AI hardware)."
 },
  "ECE 750 T39":{
  desc_en:"System design for large-scale data and computing: parallel and distributed computing models, scalability-bottleneck analysis, large-scale graph/data processing systems, HPC and cloud system trade-offs.",
  proj_en:"Topics courses usually center on paper reading + a term project, with a high project weight.",
  pre_en:"System-programming and concurrency fundamentals.",
  why_en:"<b>One of the most SWE-useful systems courses available in F2026 first term.</b> Pairs well with ECE 650 (one teaches how to write, the other how to scale) for a strong first-term combo.",
  alt_en:"Similar in W2027: ECE 750 T29 (program verification); in S2027: ECE 751 (distributed).",
  warn_en:"Topics-course syllabi are set yearly by the professor; before enrolling, check outline.uwaterloo.ca or email directly to confirm that year's content and grading."
 },
  "ECE 750 T41":{
  desc_en:"New in Fall 2026 (Sep–Dec 2026). Applies LLMs across the software-engineering lifecycle: code generation and completion, defect detection, program understanding and summarization, auto-repair, test generation, and how to evaluate the reliability of such LLM systems.",
  proj_en:"Seminar-style: usually paper reading + in-class presentation + a high-weight term project.",
  pre_en:"Software-engineering basics and Python ability suffice; no deep-learning theory background needed.",
  why_en:"<b>Three advantages combine: newest, most SWE-relevant, and an ECE course that uses none of the 3 non-ECE slots.</b> In the 2026 job market, using LLMs to reshape dev workflows is what nearly every company is doing — this course's project is a direct resume booster.",
  alt_en:"Cross-dept equivalents: CS 846 SEM 002 LLM for Software Engineering (Winter), CS 886 SEM 001 Transformers &amp; LLMs (F2026).",
  warn_en:"A first-offering course with no track record — teaching quality and grading scale are unknown."
 },
  "ECE 750 T42":{
  desc_en:"Mining information from software repositories: code-evolution analysis, defect prediction, log analysis, developer-behavior modeling, empirical methods for large codebases.",
  proj_en:"Seminar + data-analysis project; moderate coding load.",
  pre_en:"Python + basic statistics.",
  why_en:"Relatively light, but yields tangible data-driven software engineering project experience. Good for a term when you need to free up time.",
  alt_en:"CS 846 SEM 002 Empirical Software Engineering (F2026, heavily overlapping content, but uses a non-ECE slot)."
 },
  "ECE 750 T29":{
  desc_en:"Automated proofs of program correctness: abstract interpretation, model checking, SMT solving, invariant generation, internals of software model checkers. Arie Gurfinkel is a known formal-verification scholar (co-author of SeaHorn).",
  proj_en:"Theory-dense, with tool-implementation assignments.",
  pre_en:"Mathematical-logic foundation; ideally taken ECE 650.",
  why_en:"One of the most academically weighty software courses. Limited direct job-hunt help, but if you target compilers, infrastructure, security, or AI code-generation verification, its depth is unavailable elsewhere.",
  alt_en:"ECE 653 (same area, slightly easier, Spring)."
 },
  "ECE 750 T45":{
  desc_en:"Fairness, interpretability, privacy, robustness, and governance of AI systems. Elliot Creager also teaches ECE 657D Deep Learning.",
  proj_en:"Seminar-style: paper reading + presentation + term project.",
  pre_en:"ML background helps but the bar is low.",
  why_en:"A rare AI-related + light load combo in F2026. A hidden bonus: <b>get to know Prof. Creager early</b> — you will likely take his 657D in W2027/W2028 and may approach him for an ECE 699 project.",
  alt_en:"Another light option in F2026: ECE 655 (mobile systems, open-book)."
 },
  "ECE 750 T37":{
  desc_en:"Software systems that self-monitor and self-adjust at runtime: MAPE-K control loop, runtime models, self-healing and self-optimizing architectures.",
  proj_en:"Seminar + project.",
  pre_en:"Software-architecture foundation.",
  why_en:"Same intellectual lineage as cloud-native, autoscaling, and SRE practices.",
  alt_en:"ECE 750 T39 (same term, F2027)."
 },
  "ECE 752":{
  desc_en:"Interaction and coordination among autonomous agents: game-theory basics, mechanism design, auction theory, social choice, distributed resource allocation, multi-agent learning.",
  proj_en:"Theory-led, with modeling and simulation assignments.",
  pre_en:"Probability, linear algebra.",
  why_en:"<b>It is on the AI &amp; ML stream certification's elective list</b>, and multi-agent is exactly the theoretical base of the 2026 LLM-Agent wave. For agent-system builders, it offers a theory perspective others lack.",
  alt_en:"ECE 657D (deep learning), ECE 757A Embodied Intelligence (W2028)."
 },
  "ECE 657":{
  desc_en:"A systematic ML intro: supervised learning (regression, classification, SVM, trees, ensembles), unsupervised (clustering, dimensionality reduction), model evaluation and tuning, overfitting and regularization. Prof. Amir-Hossein Karimi's research is causal and explainable AI.",
  proj_en:"Assignments + project; hands-on Python/sklearn.",
  pre_en:"Linear algebra, probability/statistics, Python.",
  why_en:"<b>One of the two required courses for the AI &amp; ML stream certification</b>; without it there is no certification. And it <b>is offered only in Spring</b> — this is the biggest source of the four plans' differences: whoever uses Spring for a work term loses this certification.",
  alt_en:"No true substitute (hard certification requirement). If you just want ML without certification: CS 680 / CS 685 (F2026, use non-ECE slots)."
 },
  "ECE 657A":{
  desc_en:"Note: <b>this course has been renamed</b>; the circulated old name 'Data and Knowledge Modeling and Analysis' is outdated. Current content covers data preprocessing and feature engineering, classification and clustering, dimensionality reduction, model selection and evaluation, and the overall landscape of AI methods. Prof. Mark Crowley also teaches ECE 650.",
  proj_en:"<b>About 30% is a group project</b>; the rest is dense assignments and a weighty final. Assignment volume is on the high side among AI courses.",
  pre_en:"Probability/statistics, linear algebra, Python.",
  why_en:"<b>The second required course for the AI &amp; ML stream certification.</b> Together with ECE 657 it forms the certification's foundation; both must be taken.",
  alt_en:"No substitute (hard certification requirement). If unavailable in W2027, W2028 is an option."
 },
  "ECE 657D":{
  desc_en:"From perceptrons and backpropagation to the modern era: CNNs, RNN/LSTM, attention and Transformers, generative and diffusion models, GNNs, large-scale training engineering. <b>First offered W2026; will also run in W2027 and W2028.</b>",
  proj_en:"Deep-learning courses usually have heavy coding assignments and an open-ended final project with a self-chosen topic.",
  pre_en:"ML foundation (one of 657 or 657A), Python + PyTorch.",
  why_en:"<b>The ECE course most aligned with modern AI (first offered W2026)</b>, and on the AI &amp; ML certification's elective list. Another layer for you: diffusion models and generative video are exactly where photography/imaging interests meet AI — the final project can go that direction.",
  alt_en:"CS 886 SEM 003 Generative Models or CS 679 Neural Networks (both use non-ECE slots)."
 },
  "ECE 613":{
  desc_en:"Digital image representation and sampling, color spaces, image transforms (DCT/wavelet), enhancement and restoration, compression coding (JPEG/video coding), and <b>image quality assessment</b>.",
  proj_en:"Image-processing implementation assignments (usually MATLAB/Python); some terms have a final project.",
  pre_en:"Signals and systems, linear-algebra basics. Photography experience actually makes many concepts more intuitive.",
  why_en:"<b>This is the course that simultaneously satisfies 'close to photography + counts toward the MEng degree + ECE course using no non-ECE slot'.</b> Even better, the instructor <b>Zhou Wang is the author of SSIM (Structural Similarity image-quality metric)</b> — unavoidable in image-quality assessment worldwide. Learning how to scientifically measure whether a photo looks good from him is a photographer's cheat code. It appears in all four plans.",
  alt_en:"If unavailable some term: SYDE 671 Advanced Image Processing / SYDE 672 Statistical Image Processing (Fall, non-ECE slots), CS 684 Computational Vision (F2026)."
 },
  "ECE 602":{
  desc_en:"Convex sets and functions, modeling and solving convex optimization, duality theory, KKT conditions, gradient and interior-point methods, applications in engineering and ML.",
  proj_en:"Proof-heavy, with programming assignments (CVX/Python).",
  pre_en:"Linear algebra, multivariable calculus.",
  why_en:"On the AI &amp; ML certification's elective list. Convex optimization is the math foundation of all ML algorithms; mastering it makes papers much easier to read. But its direct interview help is limited.",
  alt_en:"ECE 606 (also a certification elective, more interview-relevant), ECE 613 (also a certification elective, more interest-relevant)."
 },
  "ECE 659":{
  desc_en:"Sensor principles, data fusion, WSN networking and routing, energy management, edge intelligence.",
  proj_en:"Design and simulation assignments.",
  pre_en:"No strict prerequisite.",
  why_en:"On the AI &amp; ML certification elective list; a backup to fill the certification in W2027. Limited help for pure-software SWE jobs.",
  alt_en:"ECE 613, ECE 752 (same term, also on the certification list)."
 },
  "ECE 720 T10":{
  desc_en:"ML hardware acceleration: GPU/TPU/FPGA architectures, operator mapping and scheduling, quantization and sparsity, inference accelerator design.",
  proj_en:"Hardware-design or performance-modeling assignments.",
  pre_en:"Computer-architecture basics.",
  why_en:"If you want to do ML systems or inference optimization (one of the most in-demand directions), this course's perspective is rare. Pure application-layer SWE can skip it.",
  alt_en:"ECE 621 Computer Architecture, CS 854 Model Serving Systems for GenAI."
 },
  "ECE 699A":{
  desc_en:"Under one-on-one guidance from an ECE professor, complete a research/engineering project in one term; submit a Project Report at term end graded by the supervisor. Counts as 1 course credit.",
  proj_en:"The project itself. Recent topics include systems-oriented ones like Scalable Deep Learning (data/model parallelism, CUDA, DeepSpeed), high resume value.",
  pre_en:"<b>Hard gate: at least 3 courses completed with average ≥80%.</b> So your first two terms' grades directly decide your eligibility.",
  why_en:"An officially recognized for-credit side project, and one-on-one. If you find an AI/systems topic, the output is more complete than a typical course project.<br><b>Fall 2026 AI/SWE topics available (partial):</b> Zahedi (Fair GPU Scheduling for Multi-Tenant LLM Serving, Prompt Optimization for Agentic LLM Systems), Tahsin Reza (Scalable Deep Learning, vector-similarity search acceleration), Tahvildari (LLM + Digital Twin production intelligence), Firoozi (3D Vision for robot planning), En-Hui Yang (efficient/secure AI), Crowley (causal inference / RL ethics), Stephen L. Smith (robots adapting to user preferences). Full list on the ECE department's MEng Project Opportunities sub-pages by area.",
  alt_en:"Skip 699 and take one more regular course — lower risk and more controllable timing.",
  warn_en:"<b>You must do a professor-proposed project; you cannot convert your own personal project directly for credit.</b> The process: email ECE professors yourself to discuss a topic, get a permission number, then register in Quest — no one does this step for you, and earlier contact means more options.",
  t_en:"Offered every term (coordinated by Xie LL)"
 },
  "ECE 699B":{
  desc_en:"The B segment of ECE 699: under another (or the same) ECE professor, do a second research/engineering project over one term, submit a Project Report graded by the supervisor. Usually registered after 699A; for those wanting two different projects, or a stronger second piece if the first was unimpressive. Counts as 1 course credit.",
  proj_en:"Same as 699A — another independent project.",
  pre_en:"<b>Hard gate: at least 3 courses completed with average ≥80%.</b> Same as 699A.",
  why_en:"Same for-credit side project as 699A. Use the B segment if 699A's topic was not strong, or to add another piece in a new direction. Fall 2026 AI/SWE topics available are the same as 699A.",
  alt_en:"Skip 699B and take one more regular course.",
  warn_en:"Same as 699A: must do a professor-proposed project, cannot convert a personal project for credit; contact the professor yourself for a permission number to register in Quest.",
  t_en:"Offered every term (coordinated by Xie LL); usually taken after 699A"
 },
  "WIL 601":{
  desc_en:"Career-prep course for co-op students: resume and cover letter, interview skills, workplace communication, professional conduct and safety on the job.",
  proj_en:"Mostly online modules and assignments; very light load.",
  pre_en:"MEng Co-op program students.",
  why_en:"<b>Not optional — a hard milestone of the Co-op program.</b> Officially required in the term before your first work term (the work-search term). It <b>does not count against the 8-course quota</b>, but it takes some of your time — leave room for it when planning.",
  alt_en:"No substitute.",
  warn_en:"WIL 601 sits in different places across the four plans because it must follow the work term. This is the easiest to overlook and the most likely to jeopardize co-op eligibility. Before committing, email ece.masterscoop@uwaterloo.ca to confirm the registration method.",
  t_en:"The term before your first work term"
 },
  "ECE 652":{
  desc_en:"Software engineering for safety-critical systems: formal testing methods, structural and behavioral criteria for unit/integration/system testing, software design under real-time constraints.",
  proj_en:"Has an embedded-systems component.",
  pre_en:"Basic maturity in programming languages, compilers, operating systems.",
  why_en:"If your target is software roles in automotive, aviation, or medical devices, this course fits perfectly. Medium priority for regular internet SWE.",
  alt_en:"ECE 653 / ECE 654 (same term, same area)."
 },
  "ECE 750 T27":{
  desc_en:"Core topics in system security: authentication and access control, crypto applications, common attacks and defenses, security protocols.",
  proj_en:"Seminar + practical assignments.",
  pre_en:"OS and networking basics.",
  why_en:"Security is a common probe area in SWE interviews and a plus for many roles.",
  alt_en:"ECE 628 Computer Network Security (W2027), CS 653 Software and Systems Security (F2026)."
 },
  "ECE 628":{
  desc_en:"Network-level security mechanisms: crypto basics, authentication protocols, PKI, firewalls and intrusion detection, wireless and mobile network security. Guang Gong is a senior cryptology professor.",
  proj_en:"Theory + protocol analysis.",
  pre_en:"Computer-networking basics.",
  why_en:"One of the core courses for the Computer Networking and Security stream certification.",
  alt_en:"ECE 750 T27 / T38 (S2027)."
 },
  "CS 651":{
  desc_en:"Programming models and systems for big-data processing: the MapReduce idea, Spark, distributed data-processing pipelines, large-scale text and graph analytics, stream processing.",
  proj_en:"A substantial coding project that actually runs Spark jobs on a cluster.",
  pre_en:"Java/Scala or Python; distributed-systems concepts help.",
  why_en:"Among non-ECE electives, one of the best for SWE job hunting — big-data processing is a core skill for data-engineering and backend roles, and the project is very compelling to talk about.",
  alt_en:"ECE 751 (ECE course, no non-ECE slot used), CS 654 Distributed Systems.",
  t_en:"F2026 · W2026 (offered every term)"
 },
  "CS 654":{
  desc_en:"Principles of distributed systems: process communication, naming, synchronization, consistency and replication, fault tolerance, distributed file systems. Note: CS 653 is 'Software and Systems Security', not distributed — a common online mix-up.",
  proj_en:"System-implementation assignments.",
  pre_en:"Operating systems, networking.",
  why_en:"Canonical material for system design interviews.",
  alt_en:"ECE 751 (ECE course, offered S2027, no non-ECE slot used)."
 },
  "CS 684":{
  desc_en:"Computer-vision foundations: image formation and camera models, filtering and feature detection, stereo vision and depth estimation, motion and optical flow, object recognition.",
  proj_en:"Vision-algorithm implementation assignments.",
  pre_en:"Linear algebra, probability, programming.",
  why_en:"Directly tied to your photography interest — after learning camera models and imaging geometry, the way you see lenses and composition changes.",
  alt_en:"ECE 613 (ECE course, no non-ECE slot used, more image-processing/quality-leaning), SYDE 671."
 },
  "CS 688":{
  desc_en:"3D graphics foundations: geometric transformations, lighting and shading models, ray tracing, texture mapping, geometric modeling, the rendering pipeline.",
  proj_en:"Core task is writing a complete ray-tracing renderer from scratch in C++ — a visual artifact that goes straight into your portfolio.",
  pre_en:"C++ ability, linear algebra (matrix transforms).",
  why_en:"If your interest in imagery goes beyond shooting and you want to understand how light is computed, this is the most direct entry. The renderer is also a rare project with both technical depth and visual impact.",
  alt_en:"CS 888 Advanced Topics in Light Transport (deeper, seminar).",
  warn_en:"The CS course calendar for W2027 is not yet published; this course is inferred (推断) to run in Winter by past pattern. Confirm before enrolling.",
  t_en:"Winter (offered W2026; W2027 to be published)"
 },
  "CS 886 SEM 002":{
  desc_en:"Vision-language multimodal models: CLIP-style contrastive learning, image-text generation architectures, multimodal pretraining and fine-tuning, current frontier problems.",
  proj_en:"Seminar-style: paper reading + presentation + <b>a term project worth 40–50%</b>, usually no final exam.",
  pre_en:"Deep-learning basics; instructor consent required.",
  why_en:"<b>This is the exact cross point of your photography and AI interests.</b> Using VLMs for auto-tagging assets, retrieving shots by semantics, picking clips by mood — these are projects you can actually build, and a great technical base for the ECE 651 team project.",
  alt_en:"CS 886 SEM 003 Generative Models, ECE 657D (ECE course).",
  warn_en:"Instructor consent required; seats are limited. <b>Email now.</b>"
 },
  "CS 886 SEM 003":{
  desc_en:"A systematic treatment of generative models: VAEs, GANs, autoregressive models, diffusion models — principles and training — and applications to image/video/audio generation.",
  proj_en:"Seminar + large project.",
  pre_en:"Deep-learning and probability basics; consent required.",
  why_en:"Generative image and video is today's hottest direction and directly tied to your imaging creation.",
  alt_en:"CS 886 SEM 002, ECE 657D.",
  warn_en:"Instructor consent required."
 },
  "CS 886 SEM 001":{
  desc_en:"Understanding Transformers and LLMs from a theory view: expressivity, training dynamics, emergent abilities, scaling laws.",
  proj_en:"Seminar + project.",
  pre_en:"ML theory background; consent required.",
  why_en:"The most theoretically deep LLM course. If your goal is a research-oriented role or a PhD, this course carries real weight.",
  alt_en:"CS 886 SEM 004 Topics in Language Modelling (more applied), ECE 750 T41 (ECE course, software-engineering-leaning).",
  warn_en:"Instructor consent required."
 },
  "CS 854":{
  desc_en:"Systems engineering for LLM inference and serving: batching and scheduling, KV-cache management, quantization and parallel inference, latency/throughput trade-offs, serving architecture.",
  proj_en:"Seminar + systems-implementation project.",
  pre_en:"Systems and deep-learning basics; consent required.",
  why_en:"<b>This course sits at the intersection of AI and systems engineering, and is one of the most in-demand, highest-paid directions in today's market.</b> Many can train models; far fewer can deploy them efficiently to production.",
  alt_en:"ECE 750 T39 (ECE course, scalable system design), ECE 720 T10 AI/ML Hardware.",
  warn_en:"Instructor consent required, and systems-style seminars usually demand strong engineering background."
 },
  "CS 848 SEM 001":{
  desc_en:"The modern evolution of index structures: traditional relational indexes, vector indexes (HNSW, IVF and other approximate nearest-neighbor), and system design for relational+vector hybrid queries.",
  proj_en:"Seminar + project.",
  pre_en:"Database basics; consent required.",
  why_en:"<b>This is the layer underneath RAG systems.</b> Many AI-application companies build vector retrieval, but few truly understand index-structure trade-offs — a strongly differentiating skill.",
  alt_en:"ECE 656 Database Systems (ECE course, more foundational and comprehensive), CS 848 SEM 002 Modern Database Systems.",
  warn_en:"Instructor consent required."
 },
  "CS 846 SEM 003":{
  desc_en:"Using formal methods to verify AI systems, and using AI to assist formal verification — a cross of both directions.",
  proj_en:"Seminar + project.",
  pre_en:"Logic and ML fundamentals; consent required.",
  why_en:"An emerging cross-discipline, valuable for AI reliability and code-generation verification.",
  alt_en:"ECE 750 T29 Automated Program Verification (ECE course).",
  warn_en:"Instructor consent required."
 },
  "CS 846 SEM 002":{
  desc_en:"Studying software-engineering practice with data and experiments: experimental design, developer-behavior research, empirical analysis of codebases.",
  proj_en:"Seminar + data-analysis project; relatively light load.",
  pre_en:"Consent required.",
  why_en:"A lighter-load option among F2026 non-ECE electives.",
  alt_en:"ECE 750 T42 (ECE course, W2027, heavily overlapping content, no non-ECE slot used)."
 },
  "CS 680":{
  desc_en:"The CS department's intro ML course, slightly more theory-heavy than ECE 657: supervised/unsupervised learning, kernel methods, neural-network basics, generalization theory.",
  proj_en:"Assignments + project.",
  pre_en:"Linear algebra, probability, Python.",
  why_en:"If ECE 657 is unavailable due to term conflicts, this is the closest substitute — but note it cannot replace ECE 657 in the AI &amp; ML stream certification, which only accepts ECE courses.",
  alt_en:"CS 685 Machine Learning (more statistics-leaning), ECE 657 (ECE course)."
 },
  "CS 685":{
  desc_en:"The mathematical foundation of ML: statistical learning theory, generalization bounds, learning algorithms from an optimization view.",
  proj_en:"Largely theoretical assignments.",
  pre_en:"Strong math background.",
  why_en:"The most rigorous ML course. Good for those who want depth; indirect help for interviews.",
  alt_en:"CS 680, ECE 657."
 },
  "CS 679":{
  desc_en:"Principles and practice of neural networks: feedforward networks, convolution, recurrent structures, training tricks, modern architectures.",
  proj_en:"Coding assignments + project.",
  pre_en:"ML fundamentals.",
  why_en:"Non-ECE substitute for ECE 657D. If your Winter term is a work term and you cannot take 657D, take this in the Fall instead.",
  alt_en:"ECE 657D (ECE course, no non-ECE slot used, more up to date)."
 },
  "CS 649":{
  desc_en:"Interaction design principles, usability evaluation methods, user research, interface design and prototyping.",
  proj_en:"Design + user-research project; light coding load.",
  pre_en:"None.",
  why_en:"Light workload, and if you want to build creator-facing tool products (editing assistants, asset managers), HCI methodology makes products genuinely usable rather than merely functional.",
  alt_en:"CS 889 Research Methods in HCI (seminar)."
 },
  "CS 656":{
  desc_en:"Network protocol stack, routing and congestion control, transport layer, application-layer protocols, network performance.",
  proj_en:"Lab assignments.",
  pre_en:"None.",
  why_en:"Networking is a standard area in backend interviews. But ECE also offers similar courses — prefer using an ECE slot.",
  alt_en:"ECE 655 (ECE course, lighter), ECE 628 (ECE course, security-leaning)."
 },
  "SYDE 671":{
  desc_en:"Advanced image-processing topics: multi-scale analysis, image segmentation, feature representation, learning-based image processing.",
  proj_en:"Implementation assignments and a project.",
  pre_en:"Signal-processing or image basics.",
  why_en:"ECE 613 runs only in Winter while SYDE 671 runs in Fall — <b>the two are staggered, forming a combo where most terms can fit a vision course.</b>",
  alt_en:"SYDE 672 Statistical Image Processing (same term), ECE 613 (ECE course, Winter)."
 },
  "SYDE 672":{
  desc_en:"Image processing from a statistical-inference view: Bayesian image restoration, Markov random fields, statistical modeling and estimation.",
  proj_en:"Math-dense.",
  pre_en:"Solid probability/statistics foundation.",
  why_en:"More theory-leaning than SYDE 671. For those who want to go deep into image modeling.",
  alt_en:"SYDE 671 (same term, more practical)."
 },
  "SYDE 675":{
  desc_en:"Classical pattern-recognition framework: Bayesian decision, parametric and non-parametric estimation, feature selection and dimensionality reduction, clustering, classifier design and evaluation.",
  proj_en:"Implementation assignments.",
  pre_en:"Probability/statistics, linear algebra.",
  why_en:"A different take on classical ML; SYDE's teaching style leans engineering practice.",
  alt_en:"ECE 657 / ECE 657A (ECE courses, and certification required).",
  warn_en:"Not in SYDE's Fall calendar; likely offered in Winter — inference (推断), confirm with the SYDE graduate office.",
  t_en:"Winter (to be confirmed)"
 },
  "SYDE 631":{
  desc_en:"Statistical modeling of time series: ARIMA-type models, stationarity, forecasting and diagnostics.",
  proj_en:"Data-analysis assignments.",
  pre_en:"Statistics basics.",
  why_en:"Useful if you build quant, monitoring, or forecasting systems. Limited help for general SWE.",
  alt_en:"ECE 657 (ECE course, ML)."
 },
  "MSCI 641":{
  desc_en:"Practical NLP methods: text preprocessing, vector representations, classification and sentiment analysis, topic models, modern neural methods.",
  proj_en:"Mostly hands-on Python, with a project.",
  pre_en:"Python + basic ML.",
  why_en:"A hands-on NLP entry point with a relatively gentle load.",
  alt_en:"CS 886 SEM 004 Topics in Language Modelling, ECE 750 T41.",
  warn_en:"MSCI's 2026–2027 course calendar was not verified in this research; before enrolling, confirm with the Management Science &amp; Engineering department website whether it is offered.",
  t_en:"To be confirmed"
 },
  "BE 645":{
  desc_en:"Understand AI from a business perspective: what business problems AI can solve, how to evaluate ROI, and paths for adoption and organizational change.",
  proj_en:"Mostly case studies + group work.",
  pre_en:"No technical background required.",
  why_en:"If you genuinely want to turn a CNC creation or imaging tool into a product, this kind of course teaches how to judge whether it is worth building — exactly what pure engineering courses never cover.",
  alt_en:"BE 650 Digital Transformations.",
  warn_en:"BE courses are open to all grad students, but confirm with the ECE Graduate Office whether they are on the ECE approved list.",
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 605":{
  desc_en:"Full project-management methodology: scope and schedule management, resources and risk, agile-vs-traditional trade-offs, stakeholder communication.",
  proj_en:"Case studies + team assignments.",
  pre_en:"None.",
  why_en:"Light workload and practical. Complements the ECE 651 team project — one teaches how to build, the other how to manage. Practical note: an easy course, the most comfortable one, but since Fall 2024 its difficulty and workload have risen noticeably.",
  alt_en:"BE 680 Consulting.",
  warn_en:"Confirm it is on the ECE approved list.",
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 650":{
  desc_en:"Technology-driven organizational change: digital strategy, platform business models, technology adoption and diffusion.",
  proj_en:"Case studies.",
  pre_en:"None.",
  why_en:"A common component course for the Business Leadership stream.",
  alt_en:"BE 645.",
  warn_en:"Confirm it is on the ECE approved list.",
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 680":{
  desc_en:"Management consulting methods and practice: problem definition, structured analysis, solution design and presentation.",
  proj_en:"Hands-on case project.",
  pre_en:"None.",
  why_en:"Structured communication and problem-decomposition skills are useful in technical interviews and product discussions.",
  alt_en:"BE 660 Negotiations, BE 630 Sales.",
  warn_en:"Confirm it is on the ECE approved list.",
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 602":{
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 630":{
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 660":{
  t_en:"To be confirmed (Conrad School)"
 },
  "BE 603":{
  why_en:"<b>Student review:</b> A writing-heavy course — good for your final term when you want to grind LeetCode and prep for interviews while still earning credits.",
  t_en:"To be confirmed (Conrad School)"
 },
  "ECE 757A":{
  desc_en:"Agents learn through body-environment interaction: perception-action loops, robot cognition, and imitation learning. Kerstin Dautenhahn is an authority on social robotics.",
  proj_en:"Seminar plus a term project, usually on a robot platform.",
  pre_en:"ML fundamentals.",
  why_en:"The frontier where AI moves from 'looking at data' to 'acting in the physical world' — exactly the theory base of the 2026 agent/robotics wave.",
  alt_en:"ECE 752 (multi-agent systems) or ECE 657D (deep learning).",
  warn_en:"Only offered in W2028; a relatively new topics course whose syllabus changes yearly by instructor — confirm the outline before enrolling."
 },
  "CS 886 SEM 004":{
  desc_en:"A topics seminar on large language models: frontier language-modeling methods and the latest advances in training and inference. Instructor consent required.",
  proj_en:"Seminar plus a term project, usually no final exam.",
  pre_en:"Deep-learning and NLP fundamentals; instructor consent required.",
  why_en:"The course closest to LLM applications, directly tied to your text/imaging creation interests.",
  alt_en:"CS 886 SEM 001 (theory-leaning) or ECE 750 T41 (in-department, software-engineering-application leaning).",
  warn_en:"Instructor consent required; seats are limited — email early."
 },
  "CS 848 SEM 002":{
  desc_en:"The evolution of modern database systems: NewSQL, cloud-native databases, HTAP, and vector and AI workloads. Instructor consent required.",
  proj_en:"Seminar plus a project.",
  pre_en:"Database fundamentals; instructor consent required.",
  why_en:"Closer to today's industry database landscape than ECE 656, and the backend foundation for AI applications.",
  alt_en:"ECE 656 Database Systems (in-department), or CS 848 SEM 001 on vector indexing.",
  warn_en:"Instructor consent required."
 },
  "CS 698":{
  desc_en:"How organizations adopt AI: strategy, process reengineering, people, and governance. Instructor consent required.",
  proj_en:"Seminar plus case analysis, light workload.",
  pre_en:"No technical prerequisites; instructor consent required.",
  why_en:"One of the few courses that clearly explains how AI lands inside a company — useful for your product or startup track.",
  alt_en:"BE 645 AI Business Applications (out-of-department business course).",
  warn_en:"Instructor consent required; management-leaning with low technical depth."
 },
  "ECE 603":{
  desc_en:"Wiener filtering, spectral estimation, ML/MAP/MMSE parameter estimation, LMS/RLS adaptive filtering, and discrete Kalman filtering.",
  proj_en:"Mostly theoretical assignments, including estimation and filtering derivations.",
  pre_en:"Stochastic processes or equivalent probability background.",
  why_en:"The math foundation for vision/imaging, and on the AI&ML certification elective list; essential for anyone doing sensor fusion or time-series estimation.",
  builds_en:"Leads to ECE 686 (stochastic filtering), the statistics portion of ECE 613, and time-series estimation work.",
  needs_en:"ECE 604 (stochastic processes) or equivalent probability background.",
  for_en:"Vision, sensing, and robot state estimation; a lesser-known option for padding the certification."
 },
  "ECE 604":{
  desc_en:"Random variables and stochastic-process theory, Markov chains, Poisson processes, renewal processes, stationary processes, and power spectra.",
  proj_en:"Assignments plus midterm/final, theory-leaning.",
  pre_en:"Probability theory and random-signal fundamentals.",
  why_en:"The upstream of all probability courses (612, 686, the theory part of 657); build it firmly if you plan to do a PhD or quant/communications work.",
  builds_en:"Underpins the probability portions of ECE 603, ECE 612, ECE 686, and CS 885.",
  needs_en:"Solid probability and linear algebra.",
  for_en:"Research-oriented ML, communications, quant, and robot state estimation."
 },
  "ECE 608":{
  desc_en:"Statistical modeling and analysis of bioengineering data using R.",
  proj_en:"Data-modeling assignments, light programming load.",
  pre_en:"None.",
  why_en:"A low-load credit-filler by student reputation; a good option for the Spring term when you need time to grind LeetCode and send applications.",
  for_en:"Terms when you need to free up time for co-op hunting or job search."
 },
  "ECE 610":{
  desc_en:"Network architecture, switching fabrics, traffic management, CAC/UPC, congestion control, and queueing analysis.",
  proj_en:"Assignments plus a final exam.",
  pre_en:"Computer-networking fundamentals.",
  why_en:"One of the three required courses for the Computer Networking & Security certification — to get the networking cert you must catch its offering window.",
  alt_en:"Not listed for W2027/W2028; if you miss it you wait for the next round."
 },
  "ECE 612":{
  desc_en:"Entropy, mutual information, information divergence, the noiseless coding theorem, channel capacity, the noisy coding theorem, and error-exponent bounds.",
  proj_en:"Derivation-style assignments plus a final exam.",
  pre_en:"Probability theory.",
  why_en:"The theoretical root of compression/coding; genuinely helpful for video coding, model compression, and understanding metrics like perplexity in LLMs.",
  builds_en:"Leads to model compression, video coding, and rate-distortion trade-offs in generative imaging."
 },
  "ECE 614":{
  desc_en:"Mobile-channel modeling, fading, and diversity techniques.",
  proj_en:"Assignments plus a final exam.",
  pre_en:"Stochastic processes and communications principles.",
  why_en:"A communications-track specialty course, basically useless for the SWE/ML path; listed only for completeness."
 },
  "ECE 627":{
  desc_en:"Verilog/SystemVerilog RTL design, synthesis, and FPGA implementation flow.",
  proj_en:"RTL design lab plus synthesis experiments.",
  pre_en:"Digital-logic fundamentals.",
  why_en:"For those aiming at hardware acceleration, FPGA, or AI inference chips; skippable on a pure-software path.",
  for_en:"Helpful for the hands-on CNC / build-your-own-hardware crowd."
 },
  "ECE 642":{
  desc_en:"RF transceiver circuit design.",
  proj_en:"Design assignments.",
  pre_en:"Circuit fundamentals.",
  why_en:"Specific to the analog/RF hardware track."
 },
  "ECE 663":{
  desc_en:"Converter topologies, modulation, and control.",
  proj_en:"Simulation plus design assignments.",
  pre_en:"Circuit fundamentals.",
  why_en:"The Sustainable Energy certification track; useful if you build power/energy products hands-on."
 },
  "ECE 669":{
  desc_en:"Properties of dielectrics and insulating materials.",
  proj_en:"Experiments and reports.",
  pre_en:"Materials or physics background.",
  why_en:"High-voltage and energy directions."
 },
  "ECE 672":{
  desc_en:"Photodetectors, LEDs, and laser principles.",
  proj_en:"Device assignments.",
  pre_en:"Semiconductor physics.",
  why_en:"A fun elective for photography enthusiasts curious about how imaging sensors work."
 },
  "ECE 676":{
  desc_en:"Quantum device implementation (experiment-oriented).",
  proj_en:"Experiments and reports.",
  pre_en:"Quantum-mechanics fundamentals.",
  why_en:"The Quantum Engineering certification track."
 },
  "ECE 688":{
  desc_en:"Lyapunov stability and nonlinear control design.",
  proj_en:"Derivation-style assignments plus a final exam.",
  pre_en:"Control-theory fundamentals.",
  why_en:"Advanced control track; offering year to be verified.",
  t_en:"To be verified (W2027?)"
 },
  "ECE 601":{
  desc_en:"Biology from an engineering perspective.",
  proj_en:"Assignments.",
  pre_en:"None.",
  why_en:"One of the required courses for the Biomedical Engineering certification."
 },
  "ECE 609":{
  desc_en:"Engineering analysis methods for living cells.",
  proj_en:"Assignments.",
  pre_en:"None.",
  why_en:"One of the required courses for the Biomedical Engineering certification."
 },
  "ECE 682":{
  desc_en:"State space, controllability/observability, and multi-input multi-output system design.",
  proj_en:"Assignments plus a final exam.",
  pre_en:"Control-theory fundamentals.",
  why_en:"Core of the Control and Autonomy certification; the foundation for robotics and autonomous driving.",
  builds_en:"Leads to ECE 686 (stochastic filtering) and ECE 687 (robot dynamics).",
  needs_en:"Linear algebra plus basic control.",
  for_en:"Robotics, autonomous driving, and unmanned systems."
 },
  "ECE 686":{
  desc_en:"Kalman filtering, LQG, and stochastic optimal control.",
  proj_en:"Assignments plus a project.",
  pre_en:"ECE 682 or equivalent control background, plus probability.",
  why_en:"The canonical source for robot state estimation, SLAM, and sensor fusion.",
  builds_en:"Leads to SLAM, sensor fusion, and ECE 787 (social robots).",
  needs_en:"ECE 682 plus stochastic processes.",
  for_en:"Robot and autonomous-driving state estimation."
 },
  "ECE 687":{
  desc_en:"Manipulator kinematics/dynamics, trajectory planning, and control-law design.",
  proj_en:"Hands-on robotics project.",
  pre_en:"ECE 682 or equivalent.",
  why_en:"The hard foundation of the embodied-AI/robotics track — more hands-on than ECE 757A.",
  builds_en:"Leads to ECE 780 T13 (robot learning) and ECE 757A (embodied intelligence).",
  needs_en:"ECE 682 or dynamics background.",
  for_en:"Robotics and embodied intelligence; those who want hardware plus AI.",
  warn_en:"Offered by Notomista in S2026/S2027; exact term per Quest."
 },
  "ECE 780 T13":{
  desc_en:"Applying reinforcement learning, imitation learning, and foundation models to robot policies, including 3D scene representation and vision-language fields.",
  proj_en:"Hands-on project, robotics-policy leaning.",
  pre_en:"ML fundamentals plus PyTorch; ECE 687 or 682 preferred.",
  why_en:"ECE's closest hands-on course to 'embodied AI + LLM Agent', and an in-department course using no non-ECE slot; also a natural entry to doing ECE 699 with Firoozi.",
  builds_en:"Directly connects to ECE 699 (Firoozi has robot-planning topics); leads to embodied-AI roles.",
  needs_en:"ECE 657 or equivalent ML fundamentals plus PyTorch.",
  for_en:"Robotics, embodied intelligence, spatial AI; those who want to join a professor's lab project.",
  warn_en:"Special topics; the exact T13 number per Quest that year — email early to confirm."
 },
  "ECE 750 T-CX":{
  desc_en:"Causal inference, counterfactual explanations, and interpretability methods. Karimi is also the instructor of ECE 657.",
  proj_en:"Seminar plus a term project.",
  pre_en:"ECE 657 or equivalent ML fundamentals (smoothest if you take his course first).",
  why_en:"Responsible-AI / model-audit capability; pairs with ECE 750 T45 into a full 'trustworthy AI' chain, and the best on-ramp to doing ECE 699 with Karimi.",
  builds_en:"Leads to medical, financial, and compliance-oriented ML roles.",
  needs_en:"ECE 657 or equivalent ML fundamentals.",
  for_en:"Those who want trustworthy/interpretable ML and model auditing.",
  warn_en:"New in F2027; syllabus to be published; topic number per Quest."
 },
  "ECE 733":{
  desc_en:"The intersection of quantum computing and ML: variational quantum circuits and quantum kernel methods.",
  proj_en:"Assignments plus a project.",
  pre_en:"ML fundamentals plus linear algebra.",
  why_en:"A highly differentiating resume tag; but a narrow job market — best for those with ML grounding who want a distinct angle."
 },
  "ECE 750 T32":{
  desc_en:"Computational models of biological systems, artificial life, and evolutionary computation.",
  proj_en:"Seminar plus a project.",
  pre_en:"No hard prerequisite.",
  why_en:"On the AI&ML certification elective list (historical version); a Spring-term option for padding the certification."
 },
  "ECE 750 T38":{
  desc_en:"Studying security from the human-behavior angle: why users click phishing links, and how to design security mechanisms users won't bypass.",
  proj_en:"Seminar plus case analysis.",
  pre_en:"None.",
  why_en:"A security × HCI crossover with a light load; useful for user-facing products."
 },
  "ECE 716":{
  desc_en:"Application of cryptography in communication systems, authentication, and key management.",
  proj_en:"Assignments.",
  pre_en:"Network or security fundamentals.",
  why_en:"An elective for the Computer Networking & Security certification."
 },
  "ECE 720 T08":{
  desc_en:"Using ML for placement and routing, timing prediction, and EDA flow optimization.",
  proj_en:"A project.",
  pre_en:"ML fundamentals plus digital-systems fundamentals.",
  why_en:"AI for EDA is one of the chip industry's most understaffed roles; an in-department course that uses no non-ECE slot."
 },
  "ECE 700 T10":{
  desc_en:"Consensus optimization, distributed gradients, and optimization under federated settings.",
  proj_en:"Assignments.",
  pre_en:"Optimization and probability.",
  why_en:"The theoretical foundation for federated learning and multi-machine training.",
  t_en:"W2026 (Fisher) · to be verified"
 },
  "ECE 700 T11":{
  desc_en:"Imaging physics and reconstruction algorithms for MRI/CT/ultrasound.",
  proj_en:"Assignments plus a project.",
  pre_en:"Signals and systems.",
  why_en:"Medical-imaging track; a vision enthusiast interested in image reconstruction can treat it as an extension of ECE 613."
 },
  "ECE 750 T-MENG":{
  desc_en:"Meng Ruijie's new topics course on fuzzing and program analysis (topic pending official announcement).",
  proj_en:"To be determined.",
  pre_en:"Software engineering fundamentals.",
  why_en:"A new professor's first course tends to be small, graded kindly, and the professor is keen to supervise projects — worth watching.",
  warn_en:"Topic undecided; email the instructor before enrolling to confirm syllabus and course number."
 },
  "CS 885":{
  desc_en:"MDPs, value/policy iteration, DQN, policy gradients, deep RL, and multi-agent RL. Taught by Pascal Poupart, a flagship CS course.",
  proj_en:"Assignments plus a term project (often a paper reproduction).",
  pre_en:"ML fundamentals, probability, and some tolerance for math.",
  why_en:"ECE offers no RL course, yet RL is core to LLM post-training (RLHF/GRPO) and agent decision-making — a must if you aim for agent or alignment roles.",
  builds_en:"With ECE 752 (multi-agent) it forms a complete agent theory stack; leads to LLM post-training, alignment, and robot policies.",
  needs_en:"ECE 657 or equivalent ML fundamentals.",
  for_en:"LLM post-training, alignment, robot policies; uses one non-ECE slot.",
  warn_en:"Out-of-department course; instructor consent required and seats are limited; ML fundamentals prerequisite.",
  t_en:"Winter (Poupart) · 2026-27 to be verified"
 },
  "CS 666":{
  desc_en:"The CS-version graduate algorithms course, heavily overlapping with ECE 606.",
  proj_en:"Weekly assignments plus a final exam.",
  pre_en:"Discrete math and data structures.",
  why_en:"If ECE 606 is too heavy that term or you cannot get in, this is the only equivalent substitute — but it uses a non-ECE slot and does not count toward the AI&ML certification."
 },
  "CS 645":{
  desc_en:"Requirements elicitation, formal specification, and consistency checking.",
  proj_en:"Assignments plus a group project.",
  pre_en:"Software engineering fundamentals.",
  why_en:"An upstream complement to ECE 651; useful for product-oriented engineers."
 },
  "CS 646":{
  desc_en:"Design patterns, architectural styles, and architecture evaluation.",
  proj_en:"Assignments plus a project.",
  pre_en:"Software design fundamentals.",
  why_en:"The software side of system-design interviews, complementing the distributed-systems side of ECE 751."
 },
  "CS 644":{
  desc_en:"Lexical and syntax analysis, intermediate representation (IR), optimization, and code generation — you build a complete compiler from scratch.",
  proj_en:"A large compiler implementation project.",
  pre_en:"Systems programming and algorithms.",
  why_en:"A hardcore project course with strong portfolio impact; ideal if you want to work on languages, runtimes, or performance optimization."
 },
  "CS 653":{
  desc_en:"Memory-safety vulnerabilities, exploitation and defenses, and system-level security mechanisms.",
  proj_en:"Assignments plus a project.",
  pre_en:"Systems programming.",
  why_en:"A solid foundation for security roles."
 },
  "CS 659":{
  desc_en:"Privacy-enhancing technologies, differential privacy, and encrypted data processing.",
  proj_en:"Assignments plus a project.",
  pre_en:"Algorithms and probability.",
  why_en:"A compliance must-have in the AI era (differential privacy, federated learning)."
 },
  "CS 686":{
  desc_en:"Search, constraint satisfaction, probabilistic reasoning, and planning.",
  proj_en:"Assignments plus a project.",
  pre_en:"Python and discrete math.",
  why_en:"The non-ECE counterpart to ECE 657A, with content leaning more toward classical AI."
 },
  "CS 794":{
  desc_en:"First-order methods: gradient descent, proximal gradient, Nesterov, Frank-Wolfe, ADMM, SGD.",
  proj_en:"Assignments.",
  pre_en:"Linear algebra, calculus, Python.",
  why_en:"More aligned with modern ML training than ECE 602; the right entry point to understand papers on Adam/AdamW/LoRA.",
  t_en:"Fall (Vavasis / Yu) · 2026 to be verified"
 },
  "CS 858":{
  desc_en:"Adversarial examples, model stealing, poisoning, and the security boundary of ML systems.",
  proj_en:"Seminar plus a project.",
  pre_en:"ML fundamentals.",
  why_en:"AI safety is one of the fastest-growing job categories in 2026.",
  warn_en:"Out-of-department course plus instructor consent."
 },
  "CS 798":{
  desc_en:"Lock-free data structures, memory models, and concurrent algorithms.",
  proj_en:"A concurrency project.",
  pre_en:"Systems programming.",
  why_en:"The deep end of ECE 650's concurrency material; relevant for high-frequency trading, database kernels, and runtimes."
 },
  "CS 856":{
  desc_en:"Modeling and performance analysis of congestion-control algorithms.",
  proj_en:"Assignments plus simulation.",
  pre_en:"Networking fundamentals.",
  why_en:"For network infrastructure, CDN, and transport optimization work."
 },
  "STAT 841":{
  desc_en:"Discriminant analysis, kernel methods, boosting, and classification theory.",
  proj_en:"Assignments plus a project.",
  pre_en:"Statistics fundamentals.",
  why_en:"ML from the math department's perspective; more theoretically rigorous than ECE 657.",
  t_en:"To be verified"
 },
  "STAT 940":{
  desc_en:"A math-department take on deep learning, including a paper-presentation component.",
  proj_en:"Paper presentation plus a project.",
  pre_en:"ML fundamentals.",
  why_en:"An out-of-department alternative to ECE 657D; take only one of the two.",
  t_en:"To be verified (recently offered in Winter)"
 },
  "STAT 946":{
  desc_en:"A statistical view of large models and generative models (topic changes yearly).",
  proj_en:"Seminar plus a presentation.",
  pre_en:"Statistics plus ML.",
  why_en:"Topic changes yearly — confirm the current year's topic before enrolling.",
  warn_en:"Out-of-department plus instructor consent; topic varies by year.",
  t_en:"To be verified"
 },
  "SYDE 674":{
  desc_en:"Multi-view geometry, SfM, point clouds, and 3D reconstruction.",
  proj_en:"A vision project.",
  pre_en:"Linear algebra plus image fundamentals (smoothest after ECE 613 or SYDE 671).",
  why_en:"The most direct course for the photography/imaging interest line — from taking photos to reconstructing space from them; offered in Spring, it fills the gap between ECE 613 (W) and SYDE 671 (F), the three forming a year-round vision chain."
 },
  "SYDE 677":{
  desc_en:"Medical-imaging modalities and reconstruction.",
  proj_en:"Assignments.",
  pre_en:"Signals and systems.",
  why_en:"The medical-imaging track."
 },
  "SYDE 621":{
  desc_en:"Numerical methods and computational-mathematics fundamentals.",
  proj_en:"Assignments.",
  pre_en:"Math fundamentals.",
  why_en:"Fills math gaps."
 },
  "SYDE 770":{
  desc_en:"Bayesian methods, graphical models, and a probabilistic view of deep learning.",
  proj_en:"Seminar plus a project.",
  pre_en:"Probability plus ML.",
  why_en:"A Spring-term ML option beyond ECE 657."
 },
  "MSCI 718":{
  desc_en:"Practical statistical modeling and hypothesis testing.",
  proj_en:"Assignments.",
  pre_en:"None.",
  why_en:"The only non-ECE elective explicitly on the ECE AI&ML certification elective list — a hidden solution when you want the cert without hard courses.",
  warn_en:"Certification eligibility must be confirmed in writing with the ECE Grad Office.",
  t_en:"To be verified"
 },
  "MSCI 630":{
  desc_en:"Interaction design and information-systems methodology.",
  proj_en:"A design project.",
  pre_en:"None.",
  why_en:"Product-oriented; more management-science perspective than CS 649.",
  t_en:"To be verified"
 },
  "OVGS":{
  desc_en:"Take one graduate course at an Ontario university such as Toronto, McMaster, Queen's, or Guelph, and count it toward your Waterloo degree.",
  proj_en:"Per the host course's requirements.",
  pre_en:"≥75% average; the host school must accept you.",
  why_en:"When Waterloo doesn't offer the course you need some term (classic case: ECE 657 only in Spring, 657A only in Winter, colliding with work terms), OVGS is one of the few structural solutions.",
  builds_en:"Unlocks certification courses blocked by term conflicts.",
  needs_en:"Average ≥75%; you may not register for OVGS in your final term, and approval stops after week 2.",
  for_en:"Those whose schedule is locked by term windows but must take a specific course.",
  warn_en:"Hard ECE rule: no OVGS registration in your final term, and no approval after week 2; apply early.",
  t_en:"Apply each term"
 }
};
(function () {
  var C = window.C || {};
  var E = window.UW_COURSE_EN || {};
  for (var k in E) { if (!C[k]) continue; for (var f in E[k]) C[k][f] = E[k][f]; }
})();
