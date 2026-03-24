import { useState, useRef, useEffect } from "react";

const LOGO_SRC = "/logo.png";

/* ═══ PLATFORM CONFIG ═══ */
const P = {
  linkedin: {
    name: "LinkedIn", color: "#0A66C2", max: 3000, tags: "3–5",
    tips: [
      "Hook in first 2 lines (before 'see more')",
      "White space / line breaks boost readability and dwell time",
      "Personal stories outperform corporate speak 3:1",
      "End with a question or soft CTA to drive comments",
      "External links in post body kill reach ~40% — use first comment",
      "Carousel docs get 3x more reach than text-only",
      "Post 7–8am or 12–1pm weekdays",
    ],
    algo: "Algorithm rewards dwell time, comments in the first hour, and keeping users ON LinkedIn. Posts shown to ~8% of connections first, then expand based on engagement velocity. External links suppressed.",
  },
  instagram: {
    name: "Instagram", color: "#E1306C", max: 2200, tags: "3–5 in caption",
    tips: [
      "First line truncates at ~125 chars — it IS the hook",
      "Saves are the #1 reach signal (3-4x more impactful than likes)",
      "Carousel posts get 1.4x more reach and get re-served by algorithm",
      "Hashtags in caption now outperform hashtags in comments",
      "Share-to-DM is the #2 distribution signal",
      "Reels under 30s pushed to Explore; carousels pushed to followers",
      "Post 11am–1pm or 7–9pm",
    ],
    algo: "Prioritizes saves and shares over likes. Evaluates interest, timeliness, relationship, session frequency. Reels get Explore; Carousels get followers. Posts can get significant reach DAYS later via Explore long tail.",
  },
  facebook: {
    name: "Facebook", color: "#1877F2", max: 63206, tags: "1–2 max",
    tips: [
      "Conversational tone wins — write to one person, not an audience",
      "Comment LENGTH matters more than count — 5 long > 50 short",
      "Share-to-Messenger is weighted extremely heavily",
      "Native video gets 10x more reach than YouTube links",
      "Personal profiles get 3-5x more organic reach than Pages",
      "Algorithm penalizes engagement bait ('like if you agree')",
      "Post 1–4pm weekdays",
    ],
    algo: "Built around 'meaningful interactions' — long comments, replies, Messenger shares. AI classifier pre-scores posts. Consistent posters get reliability bonus. Engagement bait and external links demoted.",
  },
  twitter: {
    name: "X (Twitter)", color: "#000000", max: 280, tags: "0–1 max",
    tips: [
      "First 5 words determine if the rest gets read",
      "Bookmarks are a sleeper metric — weighted heavily for For You",
      "Threads outperform single tweets for topic content",
      "Images increase impressions ~1.5x when relevant",
      "Quote tweets with added insight distribute to both audiences",
      "Content half-life 18-30min in Following, but For You resurfaces days later",
      "Post 7–9am or 6–9pm EST",
    ],
    algo: "Two feeds: Following (chronological, low ceiling) and For You (algorithmic, 10-100x). Engagement-to-impression RATIO > raw numbers. Controversy in replies amplifies. High performers resurface days later.",
  },
};

/* ═══ DEEP SKILLS ═══ */
const SKILLS = {
linkedin: {
impressions: `LINKEDIN IMPRESSIONS SKILL:

DISTRIBUTION PHASES: Phase 1 (60-90min) shown to 8-12% of connections, measuring dwell time, "see more" clicks, engagement velocity. 5 comments in first hour > 20 over 24hrs. Phase 2 (hrs 2-8) expands to 2nd-degree via comment depth and shares. Phase 3 (hrs 8-48) pushes to topic feeds.

HOOK PATTERNS (ranked): 1) Pattern Interrupt — contradict conventional wisdom ("I stopped posting for 3 months. Business grew 40%.") 2) Specificity Hook — concrete numbers ("I analyzed 2,847 posts from Fortune 500 CEOs") 3) Tension Opener — open loop demanding resolution ("My biggest client fired me Tuesday. Best thing that happened.") 4) Counter-Narrative — flip a belief, both sides engage 5) Insider Reveal — signal exclusive access

HOOK KILLERS: "I'm excited to announce..." / "I'm thrilled/honored/humbled..." / Starting with hashtag / "In today's..." / Any generic opening

DWELL TIME STRUCTURE: Single-sentence paragraphs with line breaks. Optimal 800-1300 chars. Nested open loops — tension in para 2, resolution in para 5+. Place "the turn" AFTER the fold. Never front-load the conclusion.

SHAREABILITY: Posts shared when they make the SHARER look good. Triggers: "I wish I knew this earlier" / "This is so true" / "My team needs to see this." Killers: self-promotional, requires context about poster, inside jokes.

HASHTAGS: 3-5 at END. Mix: 1 broad (>1M), 2 medium (100k-1M), 1-2 niche (<100k).`,

likes: `LINKEDIN LIKES SKILL:

PSYCHOLOGY: A like is a micro-endorsement. People like posts that validate beliefs they haven't articulated, make them feel smart for agreeing, are emotionally resonant without manipulation.

LIKE TRIGGERS: 1) Truth Bomb — sharp observation crystallizing common experience ("The best managers never mentioned their open-door policy. They just had one.") 2) Earned Story — vulnerability through real experience, not manufactured 3) Reframe — frustration shown in new light 4) Quiet Flex — demonstrating competence by SHOWING not telling 5) Communal Nod — shared professional experience with wit

STRUCTURE: Optimal 400-900 chars. One idea per post. Last line matters enormously — end with strongest line, not CTA. End with resonance, not questions. Best closers recontextualize everything before them.

SINCERITY FILTER: Authentic = specific mistake with consequences, praising someone revealing your values, describing a moment not just a lesson. Cringe = weaponized vulnerability, poverty porn, children's wisdom, humble-brags as gratitude.

FORMAT: White space for emphasis. No bullet points or numbered lists — they signal "information" not "emotion."`,

followers: `LINKEDIN FOLLOWER GROWTH SKILL:

FOLLOW REQUIREMENTS (all 3 simultaneous): 1) Authority — "knows things I don't" (demonstrated not claimed) 2) Consistency Promise — "other posts probably this good" 3) Identity Alignment — "following says something about who I want to be"

DEMONSTRATE DON'T CLAIM: Never "As a 15-year veteran..." Instead: insider knowledge only experienced people have, predictions with visible reasoning, patterns others haven't named, specific technical detail used casually, frameworks you ACTUALLY use.

ARCHETYPES: 1) Framework Post — name a concept, break it down, implies MORE frameworks 2) Behind-the-Curtain — reveal how things actually work vs public narrative 3) Prediction Post — connect dots before others 4) Methodology Post — your exact process and tools 5) Contrarian Analysis — dismantle popular opinion with evidence

SIGNALS: "Series" — imply part of larger body ("Third pattern I've noticed..."). "Depth" — tip of iceberg, answer one question raising two only YOU can answer. "Voice" — distinctive, readers want more specifically from YOU.

IMPLICIT TRIGGERS (never say "follow me"): "Full breakdown next week" / "I track this monthly." Optimal 1000-1800 chars. Every claim should carry fingerprint of specific experience.`,

engagement: `LINKEDIN ENGAGEMENT SKILL (COMMENTS, SHARES, SAVES):

PSYCHOLOGY: Comments are the HIGHEST-VALUE engagement on LinkedIn. The algorithm treats a comment as 5-10x more valuable than a like. But not all comments are equal — long, thoughtful comments signal "meaningful interaction" and trigger exponential distribution. Shares extend your content to entirely new networks. Your goal is to make it IMPOSSIBLE for someone to read your post and not have an opinion they need to share.

WHY PEOPLE COMMENT: 1) They disagree and need to say so 2) They have a personal story that relates 3) They want to answer a question you asked 4) They want to look smart/knowledgeable in front of YOUR audience 5) They feel emotionally compelled to add something. Design every post to trigger at least TWO of these.

COMMENT-DRIVING PATTERNS (ranked by effectiveness):
1) THE OPEN QUESTION: End with a genuine question that has NO single right answer. "What's the one thing you'd tell your first-year-in-industry self?" — Everyone has an answer. Everyone's is different. Comment goldmine.
2) THE POLARIZING OBSERVATION: State something where reasonable people disagree. "Cold outreach is dead." — Half the audience agrees, half has counterexamples. Both comment.
3) THE FILL-IN-THE-BLANK: "The hardest lesson I learned about [industry] was ___." — Low friction to respond, high personal investment.
4) THE EXPERIENCE PROMPT: Share a specific experience and ask "Has anyone else dealt with this?" — Triggers "me too" responses which are long and detailed.
5) THE RANKED LIST WITH A MISSING ENTRY: "My top 3 tools for [task]: [list]. What am I missing?" — People LOVE correcting or adding to lists.
6) THE CONTRARIAN INVITE: "Unpopular opinion: [take]. Change my mind." — Frames disagreement as welcome, which removes the social friction of commenting.

COMMENT-KILLING MISTAKES:
- Ending with "Thoughts?" (too vague — nobody knows what to say)
- Ending with "Agree?" (yes/no questions kill comment depth)
- Posts that are so complete there's nothing to add
- Posts that are controversial in a way that makes commenting feel RISKY (political, personal attacks)
- Asking a question you've already answered in the post

SHARE-DRIVING TACTICS:
- Posts get shared when the SHARER looks good for sharing. Useful frameworks, counterintuitive data, and "my team needs this" content.
- Content that solves a specific problem gets shared more than content that inspires. Tactical > motivational.
- Lists of resources, tools, or methods are the most shared format on LinkedIn.
- Contrarian takes get shared with "This 👆" — people share to endorse without writing their own post.

STRUCTURE FOR ENGAGEMENT: Optimal 900-1500 chars. Long enough to establish a strong position, short enough to leave room for disagreement. Use line breaks to create pacing. Place the question or engagement hook in the FINAL line — it should be the last thing they read before deciding to comment. First comment from the poster primes the thread — suggest they add context or an alternative take as the first comment.

REPLY STRATEGY: Suggest the poster reply to EVERY comment in the first 2 hours. Each reply counts as additional engagement, and reply threads are weighted heavily. Pose follow-up questions in replies to keep the thread going.`
},

instagram: {
impressions: `INSTAGRAM IMPRESSIONS SKILL:

DISTRIBUTION: Phase 1 (30-60min) ~10% of followers. Saves = #1 signal (3-4x > likes). Share-to-DM = #2. Caption expansion taps tracked. Phase 2 (hrs 1-12) hashtag top posts + Explore. Carousels re-served. Phase 3 (days 2-14) long tail via Explore/Suggested. Saves compound over 14 days.

FIRST LINE (truncated ~125 chars): Tap to expand is tracked signal. 1) Incomplete Reveal — "The one thing I stopped doing that changed everything →" 2) Specific Claim — concrete numbers 3) Visual Bridge — "What you're looking at took me 3 years" 4) Quiet Hook — "Nobody talks about this part." 5) Direct Address — "If you're still doing [practice], read this."

SAVE-WORTHY: Step-by-step processes, specific recommendations, frameworks simplifying complex topics, before/after with methodology. Aggressive line breaks, numbered points, specific actionable details.

HASHTAGS: 5-8 max. 1-2 large (500k+), 3-4 medium (50k-500k), 1-2 niche (<50k). At END. Topic-specific not vanity. Don't repeat sets.

LENGTH: Static 400-800. Carousels 300-500. Reels 100-250. Write like texting a smart friend — conversational, fragments OK, dashes/ellipses for pacing.`,

likes: `INSTAGRAM LIKES SKILL:

PSYCHOLOGY: Likes are personal — taste, vibe, resonance. Driven by aesthetic approval, identity signaling, instant recognition.

PATTERNS: 1) One-Liner — image does heavy lifting ("The meeting that should have been a nap.") 2) Micro-Story — 2-4 sentences, complete arc 3) Relatable Confession — specific thing many feel but don't say 4) Caption-Visual Tension — unexpected caption relative to image 5) Earned Flex — specific enough to be likeable not annoying

STRUCTURE: Optimal 50-300 chars. 1-2 lines best. Never describe what's in image — add context/emotion/angle. For carousels: "Slide 3 changed how I think about pricing."

EMOJI: 0-2. As PUNCTUATION only. Never bullets. Never open with emoji. Zero for serious tone. One at end for playful.

TONE: Dry wit > sarcasm. Vulnerability > confidence IF specific. Sounds written in 30 seconds. Observation not presentation. Leave space for reader to project.`,

followers: `INSTAGRAM FOLLOWER GROWTH SKILL:

PILLARS: 1) Niche Clarity — "I know what this account is about" 2) Value Density — "Every post delivers" 3) Voice Magnetism — "I like how they communicate." All three from single post.

ARCHETYPES: 1) Signature Framework — named concept that's YOURS 2) Transformation — before/after with METHOD visible 3) Curated Authority — be the filter in your niche 4) Series — edition numbers signal consistency 5) Process Reveal — show HOW you do it

SIGNALS: "There's more" via numbering, referencing past/future content. Niche signal — territory clear from one post. Consistency signal — distinctive repeatable voice.

LENGTH: 500-1200 chars. First 125 must be strongest hook. CTA: "I share one weekly" / "Part 2 Wednesday." Never "Follow for more!"

VOICE: Pick ONE texture and commit. Better polarizing to 30% and magnetic to 10% than forgettable to 100%.`,

engagement: `INSTAGRAM ENGAGEMENT SKILL (COMMENTS, SHARES, SAVES):

PSYCHOLOGY: Instagram engagement is split into THREE distinct actions, each with different algorithmic weight. SAVES (highest weight — "I want to come back to this") > SHARES/DM (second — "someone specific needs to see this") > COMMENTS (third — "I have something to say"). Optimize for ALL THREE, not just comments.

SAVE-DRIVING MECHANICS:
- Saves happen when content is REFERENCE-WORTHY. Tutorials, step-by-step processes, checklists, tool lists, templates.
- The reader must think "I'll need this later" — future utility is the save trigger.
- Numbered/structured content gets saved more than narrative content.
- "Save this for when you [specific situation]" works as an explicit CTA for saves because it's genuinely helpful, not engagement-bait.
- Carousel posts get 2-3x more saves because each slide adds reference value.

SHARE/DM-DRIVING MECHANICS:
- DM shares happen when content feels PERSONAL — "this is so you" or "we were just talking about this."
- Relatable observations about specific experiences drive DM shares: niche humor, industry-specific frustrations, lifestyle moments.
- Content that's useful to a SPECIFIC person ("Send this to your cofounder") gets shared more than generally useful content.
- Spicy or contrarian takes get shared for reaction: "Wait, read this" energy.
- Memes and humor get the highest share rate, but for business accounts, "actionable + relatable" is the sweet spot.

COMMENT-DRIVING MECHANICS:
- Instagram comments are harder to earn than other platforms because the feed moves fast and commenting requires more effort on mobile.
- Questions work, but SPECIFIC questions work 3x better. "What's your go-to?" > "What do you think?"
- "This or that" prompts are native to Instagram culture and drive high comment volume.
- Hot takes that people feel compelled to agree or disagree with.
- Personal stories that invite "same" or "me too" responses.
- Asking for recommendations ("What's one tool you can't live without for [task]?")

ENGAGEMENT-KILLING MISTAKES:
- "Double tap if you agree" — Instagram penalizes engagement bait
- "Tag someone who needs this" — flagged as engagement bait since 2019
- Asking a question that's too broad ("What are your goals?")
- Posts that are visually strong but have no caption hook — the image gets liked but the caption gets ignored
- CTAs that feel desperate or templated

STRUCTURE: Caption 400-1000 chars. Hook in first 125 chars (before truncation). Body delivers value that's save-worthy. Close with a specific question or prompt. For carousels: last slide should be the engagement CTA ("Which one resonated? Drop a number in the comments.").

HASHTAG STRATEGY FOR ENGAGEMENT: 5-8 hashtags. Weight toward niche communities (smaller hashtags = more engaged audiences). Community hashtags (#smallbusinessowner, #womenintech) attract commenters who participate in those communities.`
},

facebook: {
impressions: `FACEBOOK IMPRESSIONS SKILL:

DISTRIBUTION: Phase 1 (30-60min) AI classifier pre-scores, predicts comments/shares/hides. Links and engagement bait pre-penalized. Profiles get 3-5x more reach than Pages. Phase 2 (hrs 1-4) comment LENGTH > count, reply depth, Messenger shares weighted EXTREMELY heavily. Phase 3 (hrs 4-48) Suggested feeds with social proof, back-and-forth comments get exponential distribution. Phase 4 (days 2-7) reshare cascade.

HOOKS (~480 chars before truncation): 1) Conversational Provocation — "Can we talk about something bugging me?" 2) Personal Admission — "I've been lying to myself about [topic]" 3) Opinion Stake — debatable industry topic 4) "What Would You Do?" — story paused at decision point 5) Community Callout — "Everyone in [role] needs to hear this"

ANTI-ENGAGEMENT-BAIT: Actively penalized — "like if you agree" / "share if you care" / tag-a-friend / clickbait.

LENGTH: 600-1500 chars. Narrative format. Personal stories highest-performing. Conversational paragraphs, not bullets. No external links in body — first comment.`,

likes: `FACEBOOK LIKES & REACTIONS SKILL:

REACTIONS: Like (approve), Love (deeply moved), Haha (funny), Wow (surprised), Sad (empathy), Angry (outrage). Diverse reactions get MORE reach than only Likes.

PATTERNS: 1) Story Arc — emotional journey hitting Love+Wow+Like 2) Warm Flex — achievement with humanity 3) Relatable Rant — shared frustration with humor, Haha+Like 4) Unexpected Lesson — surprising outcome + new insight, Wow+Love 5) Communal Moment — in-group bonding

STRUCTURE: 500-1200 chars. Stories in scenes not summaries. Opening sets emotional TONE. End on highest emotional note, not CTA.

CALIBRATION: Facebook is WARMEST platform. Sincerity > cleverness. Personal stories with named people/places > abstract insights. First-person narratives dramatically outperform instructional content.`,

followers: `FACEBOOK FOLLOWER GROWTH SKILL:

PROFILE vs PAGE: Profile follow = strongest signal ("I want this alongside friends/family"), usually takes 2-3 exposures. Page follow = utility-driven, consistent niche value.

THREE SIGNALS: 1) Niche Authority — show THINKING not just conclusions ("Here's WHY and what I tried first that didn't") 2) Consistency Promise — reference past/future content, series numbering 3) Community Value — create belonging

FACEBOOK-SPECIFIC DRIVERS: Group-to-Profile pipeline. Local authority — strongest local platform. Shareable value exposing you to new networks.

FORMATS: Long-form personal stories with professional lessons. How-I-did-it with real numbers. Series content. Behind-the-scenes.

TRIGGERS: "I document this monthly" / Reference series / "More next week." Never "Follow my page!" Profile optimization: cover photo, bio answering "what will I get?", featured content.`,

engagement: `FACEBOOK ENGAGEMENT SKILL (COMMENTS, SHARES, SAVES):

PSYCHOLOGY: Facebook's ENTIRE algorithm is built around engagement — specifically "meaningful interactions." The 2018 algorithm overhaul made comment depth and share quality the primary distribution signals. Facebook is the BEST platform for comment-driven content because the platform actively rewards it.

COMMENT MECHANICS ON FACEBOOK:
- Long comments (3+ sentences) are weighted 5-10x more than short comments for distribution.
- Comment REPLIES (conversations within comments) are the strongest signal — a post with 10 comments that have 3 replies each outperforms a post with 50 standalone comments.
- Comments from people who don't usually interact with you signal BROAD appeal and trigger expanded distribution.
- First-hour comment velocity is critical — 5 meaningful comments in 60 minutes > 20 over 24 hours.

COMMENT-DRIVING PATTERNS:
1) THE STORY WITH A QUESTION: Tell a personal/professional story, then ask the reader about THEIR experience. "This happened to me last week at a client meeting. I'm curious — have you ever had to handle this?" — The story creates emotional investment, the question gives permission to respond.
2) THE DEBATE STARTER: Pose a professional dilemma with genuinely valid arguments on both sides. "I've been going back and forth: is it better to raise prices and lose some clients, or keep them low and stay overworked? I keep landing on different answers." — Both sides comment, and they reply to each other.
3) THE ADVICE REQUEST: Genuine questions get genuine responses on Facebook more than any other platform. "I'm trying to figure out [specific problem]. Here's what I've tried: [details]. What would you do?" — Specificity makes people feel qualified to help.
4) THE RECOMMENDATION THREAD: "What's one [book/tool/resource/habit] that actually changed how you [specific outcome]? I'll go first: [yours]." — "I'll go first" removes the friction of being the first commenter.
5) THE VULNERABLE CHECK-IN: "Honest question for anyone running a business: does anyone else feel like [specific struggle]? I keep thinking I'm the only one." — Creates safe space for long, personal responses.

SHARE MECHANICS ON FACEBOOK:
- Public shares create new distribution nodes — the post appears in the sharer's friends' feeds.
- Messenger shares (private) are weighted EXTREMELY heavily by the algorithm — they signal "this is worth a personal conversation."
- People share content that makes them look: helpful ("my friend needs this"), smart ("interesting perspective"), caring ("this matters"), or funny ("you'll love this").
- How-to content and resource lists are the most shared formats.
- Emotional stories with universal themes get shared with personal endorsements ("This is exactly right").

SHARE-KILLING MISTAKES:
- Content that's too personal to the poster to reshare (inside jokes, very specific contexts)
- Anything that could make the sharer look bad by association
- Engagement bait — Facebook actively penalizes "share if you agree" and similar phrases
- External links (suppressed 30-50% — if you must link, first comment)

STRUCTURE: 600-1500 chars. Conversational tone — write to ONE person. Build emotional momentum through the body. End with an open-ended question that ANYONE can answer from their own experience. Suggest the poster reply to comments with follow-up questions to build thread depth.

FACEBOOK-SPECIFIC ADVANTAGE: Groups. If the poster is active in relevant Facebook Groups, suggest cross-posting or referencing Group discussions. Group posts get 3-5x more engagement than feed posts because the audience is pre-qualified and the culture is participatory.`
},

twitter: {
impressions: `X IMPRESSIONS SKILL:

DISTRIBUTION: Following (chronological, low ceiling) vs For You (algorithmic, 10-100x). Phase 1 (15-30min) velocity test — engagement-to-impression RATIO > raw numbers (15 likes from 100 > 50 from 1000). Bookmarks weighted heavily. Phase 2 (30-120min) For You gate — topic relevance, social graph proximity. Phase 3 (hrs 2-24) viral loop, high-follower engagements create nodes, threads re-served. Phase 4 (days 2-7) resurfaces in For You.

280 CHARS = COMPRESSION ENGINE: Every word carries weight. Concrete > abstract. Active > passive. Numbers > adjectives. Names > categories.

PATTERNS: 1) Compressed Insight — one reframing observation, 1-2 sentences 2) Contrarian Spike — provoke both sides 3) Thread Hook — tweet #1 is the AD ("I spent 6 months reverse-engineering the algorithm. Everything I found:") 4) Observation Bomb — articulate what everyone experiences but nobody names 5) Data Drop — surprising stat + counterintuitive result 6) Quotable One-Liner — under 100 chars, screenshot-worthy

THREADS: Each tweet standalone valuable. 5-8 optimal. No numbering. Never "Thread: 🧵"

HASHTAGS: 0-1. Use keywords naturally instead — X reads full text for topic matching.`,

likes: `X LIKES SKILL:

PSYCHOLOGY: Likes are PUBLIC — selective endorsement. Agreement signal, bookmark-lite, social positioning.

PATTERNS: 1) Perfect Compression — "Execution is just taste applied repeatedly." 2) Relatable Specific — so specific it's mind-reading 3) Well-Earned Hot Take — edgy but defensible 4) Status Observation — name dynamics nobody articulates 5) Industry Truth — what everyone knows but doesn't say 6) Witty Reframe — mundane made funny/profound

STRUCTURE: Highest-liked 60-180 chars. Remove every hedge ("I think," "probably"). Remove fillers ("really," "very," "actually"). First 5 words determine everything.

TONE: Wit > wisdom. Compression above all. Shower thought energy. Lowercase OK. Drop final period. Contractions mandatory.

SCREENSHOT TEST: Would someone screenshot and send to a friend? If yes, it's likeable.`,

followers: `X FOLLOWER GROWTH SKILL:

FOLLOW TYPES: 1) Authority — "smartest take on [topic]" 2) Voice — "laugh/think every time" 3) Insider — "has info I don't" 4) Narrative — "building something I want to watch"

X follows are about VOICE. Reader must hear a PERSON, not a content calendar.

ARCHETYPES: 1) Thought Thread — original analysis (not summarizing) 2) Contrarian That's Right — demolish beliefs with evidence 3) Build-in-Public — real metrics, transparency 4) Recurring Format — own and repeat 5) Reply-Thread Showcase — sharp reply to big account 6) Vulnerable Precision — failure with specific details

PROFILE-CLICK BRIDGE: Tweet curiosity about PERSON → profile scan → pattern in recent tweets → follow. Bio = "Why add this voice?" Pinned = best work. Recent 5-6 tweets must show pattern.

SIGNALS: "Iceberg" — casual deeper knowledge references. "Series" — creates FOMO. "Voice" — recognizable without avatar.

CTA: Never "Follow for more!" Never 🤝. Instead: undeniable quality, or soft tease. Best strategy: being undeniably good, repeatedly.

VOICE CONSTRUCTION: Pick SPEED + REGISTER + SUBJECT POSITION = your X voice.`,

engagement: `X ENGAGEMENT SKILL (REPLIES, RETWEETS, BOOKMARKS):

PSYCHOLOGY: Engagement on X is FAST and PUBLIC. Every reply, retweet, and quote tweet is visible to both networks. This makes X engagement inherently viral — each interaction is a distribution event, not just a metric. The goal is to create tweets that people feel compelled to RESPOND TO, not just consume.

X-SPECIFIC ENGAGEMENT HIERARCHY:
- Quote tweets with commentary (HIGHEST value — creates new content + distribution to both audiences)
- Replies/threads that generate conversation (HIGH — back-and-forth visible to both followers)
- Retweets (MEDIUM — distributes to new network but no new content signal)
- Bookmarks (MEDIUM — strong algorithmic signal for For You, but private)
- Likes (LOWEST — counted but least impactful for distribution)

REPLY-DRIVING PATTERNS:
1) THE HOT TAKE WITH AN ESCAPE HATCH: State a strong opinion, then add "but I might be wrong about this." — The opinion attracts agreement AND disagreement, the escape hatch makes disagreeing feel safe. Both sides reply.
2) THE UNFINISHED THOUGHT: Tweet 80% of an insight and let the audience complete it. "The difference between a $50k and $500k business is usually just..." — People reply with THEIR answer, creating a thread of perspectives.
3) THE RANKING CHALLENGE: "Top 3 [things in your field], go." — Extremely low friction, high reply volume. Everyone has a ranking and everyone thinks theirs is right.
4) THE BINARY CHOICE: "Would you rather: [option A] or [option B]?" — Forces a choice, people justify their answer. Works best when both options have genuine trade-offs.
5) THE THREAD CLIFFHANGER: In a thread, end one tweet with a hook for the next. "But that's not the interesting part. The interesting part is what happened next →" — Drives replies from people who are impatient AND engagement on the thread itself.
6) THE QUOTE-TWEET BAIT: Share an observation so sharp that people want to add their own context. Tweets that start with "Underrated:" or "Overrated:" or "Nobody talks about:" — People quote-tweet to add their take, which is the highest-value engagement on X.

RETWEET-DRIVING TACTICS:
- Insight density: if a tweet packs more value per character than anything else in the feed, it gets retweeted.
- "I wish someone told me this" energy — content that makes the retweeter look generous for sharing.
- Data or stats that are surprising and shareable without additional context.
- One-liners that capture a feeling so precisely that the retweet IS the commentary.

BOOKMARK-DRIVING TACTICS:
- Tactical content: specific tools, frameworks, templates, step-by-step processes.
- Threads that serve as reference material — "everything I know about [topic]" threads get bookmarked heavily.
- Content people want to revisit but don't want to publicly endorse (contrarian takes, sensitive topics).

ENGAGEMENT-KILLING MISTAKES:
- Tweets that are too polished/complete — no room for the audience to add anything
- Asking "What do you think?" without giving them something specific to react to
- Threads that are purely informational with no opinion — they get bookmarked but not replied to
- Being preachy or moralistic — X culture punishes sanctimony hard
- Overusing the same engagement format — the audience catches on fast

STRUCTURE: Single tweets 100-280 chars. Threads 5-8 tweets. For engagement, the LAST LINE of a single tweet or the LAST TWEET of a thread is where the engagement hook lives. Build to it. Don't front-load the question.

REPLY STRATEGY: The poster's own replies are engagement multipliers. Suggest replying to early comments with genuine follow-ups, additional context, or "great point — I'd add..." to keep threads growing. Each reply is visible to both networks and counts as fresh engagement.`
}
};

/* ═══ SHARED VOICE RULES ═══ */
const VOICE = `YOUR WRITING PHILOSOPHY — NON-NEGOTIABLE:

NEVER USE (AI tells that get content ignored/mocked):
- Numbered lists as "1. [Bold word]: explanation" — #1 AI tell
- Corporate buzzwords: "leverage," "synergy," "unlock," "game-changer," "ecosystem," "deep dive," "unpack"
- AI clichés: "In today's fast-paced world," "Here's the thing," "Let me be honest," "It's not about X, it's about Y"
- Emoji bullets (🔥📈💡) or emoji as decoration
- "And that's [noun]." closers / "Most people don't realize..." / "[Claim]. And it's not even close."
- Motivational poster energy / Performative wisdom / Moral grandstanding
- Essay transitions (furthermore, additionally, moreover)
- Describing own content as "valuable" / "impactful" / "powerful"
- Perfect parallel structure — vary rhythm

INSTEAD:
- Sharpest person at dinner — casual authority, not performative
- Real opinions without hedging
- Own speech patterns, not templates
- Incomplete sentences sometimes. For emphasis. Like that.
- Trust the reader's intelligence — no over-explaining
- Contractions naturally (I'm, don't, it's)
- Mix sentence lengths
- White space is a weapon
- Every line earns its place
- Must pass "would I say this out loud?" test`;

/* ═══ GENERIC FALLBACK ═══ */
const GENERIC = {
  impressions: "Maximize reach via hooks, shareability, and algorithmic signals.",
  engagement: "Maximize engagement (comments, shares, saves) via conversation starters and interaction-compelling structures.",
  likes: "Maximize likes via relatability, emotional resonance, and instant recognition.",
  followers: "Maximize follower growth via authority, unique value, and compelling voice.",
};

/* ═══ SYSTEM PROMPT BUILDER ═══ */
const buildPrompt = (platform, goal) => {
  const c = P[platform];
  const skill = SKILLS[platform]?.[goal];
  const goalCtx = skill || `Optimization goal: ${GENERIC[goal]}`;

  return `You are an elite social media strategist specializing in ${c.name}.

${VOICE}

Platform: ${c.name}
Algorithm: ${c.algo}
Best practices: ${c.tips.join("; ")}
Character limit: ${c.max}
Hashtag guidance: ${c.tags}

${goalCtx}

OUTPUT: Return a JSON array of optimization suggestions. Each object:
- "section": "Hook/Opening"|"Body"|"Call to Action"|"Structure/Formatting"|"Hashtags/Tags"|"Overall Tone"|"Dwell Time & Pacing"|"Shareability"|"Voice & Authenticity"|"Authority Signal"|"Follow Trigger"|"Missing Element"
- "severity": "critical"|"important"|"polish"
- "current": specific text/element addressed
- "suggestion": exact recommended change
- "reasoning": 1-2 sentences on WHY referencing algorithm mechanics

Final object: "section":"Rewritten Post", "severity":"final", "current":"", "suggestion": full optimized post, "reasoning": brief priority note.

Return ONLY JSON array. No markdown, no backticks, no preamble.

RULES: 5-8 suggestions + rewrite. Be SPECIFIC — write exact changes. Order by impact. Reference platform mechanics. Rewrite must sound like a specific human with real experience.`;
};

/* ═══ SEVERITY STYLES ═══ */
const SEV = {
  critical: { label: "Critical", bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", dot: "#EF4444" },
  important: { label: "Important", bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412", dot: "#F97316" },
  polish: { label: "Polish", bg: "#F0FDF4", border: "#86EFAC", text: "#166534", dot: "#22C55E" },
  final: { label: "Optimized", bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF", dot: "#3B82F6" },
};

const LOADING_SUB = {
  "linkedin-impressions": "Analyzing hook strength, dwell time, shareability, and Phase 1 distribution",
  "linkedin-likes": "Evaluating emotional resonance, sincerity signals, and reaction triggers",
  "linkedin-followers": "Assessing authority signals, consistency promise, and depth indicators",
  "instagram-impressions": "Analyzing first-line hooks, save triggers, share-to-DM potential, and Explore signals",
  "instagram-likes": "Evaluating visual-caption harmony, emotional resonance, and vibe calibration",
  "instagram-followers": "Assessing niche clarity, value density, voice magnetism, and follow triggers",
  "facebook-impressions": "Analyzing meaningful interaction signals, comment depth, and Messenger share triggers",
  "facebook-likes": "Evaluating communal resonance, reaction diversity, and emotional authenticity",
  "facebook-followers": "Assessing local authority signals, community value, and trust-building patterns",
  "twitter-impressions": "Analyzing compression density, For You eligibility, velocity, and bookmark triggers",
  "twitter-likes": "Evaluating first-5-word impact, conviction, compression, and screenshot-worthiness",
  "twitter-followers": "Assessing voice distinctiveness, iceberg signals, and profile-click triggers",
  "linkedin-engagement": "Analyzing comment triggers, share mechanics, reply depth signals, and conversation architecture",
  "instagram-engagement": "Evaluating save triggers, DM share potential, comment prompts, and carousel engagement patterns",
  "facebook-engagement": "Analyzing meaningful interaction signals, comment depth predictors, Messenger share triggers, and Group synergy",
  "twitter-engagement": "Evaluating reply triggers, quote-tweet bait, bookmark signals, and thread engagement architecture",
};

const GOAL_LABELS = { impressions: "Impressions & Reach", likes: "Likes & Reactions", followers: "Follower Growth", engagement: "Engagement (Comments, Shares)" };

/* ═══ HISTORY CARD ═══ */
function HistoryCard({ post, index }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const platColors = { linkedin: "#0A66C2", instagram: "#E1306C", facebook: "#1877F2", twitter: "#000" };
  const platNames = { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", twitter: "X" };
  const goalNames = { impressions: "Impressions", likes: "Likes", followers: "Followers", engagement: "Engagement" };

  const copyPost = () => { navigator.clipboard.writeText(post.optimized); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const preview = expanded ? post.optimized : (post.optimized.slice(0, 200) + (post.optimized.length > 200 ? "…" : ""));

  return (
    <div className="hist-card" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="hist-card-top">
        <div className="hist-card-meta">
          <span className="hist-plat" style={{ background: platColors[post.platform] }}>{platNames[post.platform]}</span>
          <span className="hist-goal">{goalNames[post.goal]}</span>
        </div>
        <span className="hist-date">{post.date} · {post.time}</span>
      </div>
      <div className="hist-orig-label">Original draft</div>
      <div className="hist-orig">{post.original}</div>
      <div className="hist-orig-label">Optimized version</div>
      <div className="hist-optimized">{preview}</div>
      {post.optimized.length > 200 && (
        <button className="hist-expand" onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Show full post"}</button>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <span className="hist-stats">{post.suggestionCount} suggestion{post.suggestionCount !== 1 ? "s" : ""} applied</span>
        <button className="hist-copy" onClick={copyPost}>{copied ? "Copied ✓" : "Copy optimized post"}</button>
      </div>
    </div>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function Home() {
  // Auth state
  const [authView, setAuthView] = useState("login"); // "login" | "signup" | "app"
  const [signupStep, setSignupStep] = useState(1); // 1 = info, 2 = credentials
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ fullName: "", email: "", phone: "", industry: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // App state
  const [page, setPage] = useState("optimizer"); // "optimizer" | "history"
  const [postHistory, setPostHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [goal, setGoal] = useState("impressions");
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const resultsRef = useRef(null);
  const fileRef = useRef(null);

  const cfg = P[platform];
  const charCount = draft.length;
  const overLimit = charCount > cfg.max;
  const hasSkill = !!SKILLS[platform]?.[goal];
  const loadKey = `${platform}-${goal}`;

  useEffect(() => {
    if (suggestions && resultsRef.current) resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [suggestions]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const pending = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        pending.push({
          name: file.name, type: file.type, size: file.size,
          base64: ev.target.result.split(",")[1],
          isImage: file.type.startsWith("image/"),
          isPdf: file.type === "application/pdf",
          preview: file.type.startsWith("image/") ? ev.target.result : null,
        });
        if (pending.length === files.length) setAttachments((prev) => [...prev, ...pending]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const fmtSize = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

  const analyze = async () => {
    if (!draft.trim()) return;
    setLoading(true); setError(null); setSuggestions(null);
    try {
      const content = [];
      attachments.forEach((a) => {
        if (a.isImage) content.push({ type: "image", source: { type: "base64", media_type: a.type, data: a.base64 } });
        else if (a.isPdf) content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: a.base64 } });
      });
      const attCtx = attachments.length > 0
        ? `\n\n[ATTACHMENTS: ${attachments.length} file(s): ${attachments.map(a => a.isImage ? `image (${a.name})` : a.isPdf ? `PDF/carousel (${a.name})` : `file (${a.name})`).join(", ")}. Analyze visual content and optimize caption to complement it.]`
        : "";
      content.push({ type: "text", text: draft + attCtx });

      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-5-20251101",
          max_tokens: 4000,
          system: buildPrompt(platform, goal),
          messages: [{ role: "user", content: content.length === 1 ? draft + attCtx : content }],
        }),
      });
      const data = await res.json();
      const text = data.content.map((b) => b.type === "text" ? b.text : "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setSuggestions(parsed);
      // Save to history
      const rw = parsed.find((s) => s.severity === "final");
      setPostHistory((prev) => [{
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        platform,
        goal,
        original: draft.slice(0, 120) + (draft.length > 120 ? "…" : ""),
        optimized: rw?.suggestion || "",
        suggestionCount: parsed.filter((s) => s.severity !== "final").length,
      }, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Analysis failed — check your connection and try again.");
    } finally { setLoading(false); }
  };

  const copy = (t) => { navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const rewrite = suggestions?.find((s) => s.severity === "final");
  const items = suggestions?.filter((s) => s.severity !== "final") || [];

  // ── Auth handlers ──
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    if (!loginForm.email || !loginForm.password) { setAuthError("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(loginForm.email)) { setAuthError("Please enter a valid email address."); return; }
    setAuthView("app");
  };

  const handleSignupNext = (e) => {
    e.preventDefault();
    setAuthError("");
    if (!signupForm.fullName.trim()) { setAuthError("Please enter your full name."); return; }
    if (!signupForm.email.trim() || !/\S+@\S+\.\S+/.test(signupForm.email)) { setAuthError("Please enter a valid email address."); return; }
    if (!signupForm.industry.trim()) { setAuthError("Please enter your industry or job title."); return; }
    setSignupStep(2);
  };

  const handleSignupComplete = (e) => {
    e.preventDefault();
    setAuthError("");
    if (!signupForm.password) { setAuthError("Please create a password."); return; }
    if (signupForm.password.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
    if (signupForm.password !== signupForm.confirmPassword) { setAuthError("Passwords do not match."); return; }
    setAuthView("app");
  };

  const eyeIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const eyeOffIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  // ── Auth pages ──
  if (authView !== "app") {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.auth-root{font-family:'DM Sans',sans-serif;min-height:100vh;background:#FAFAF9;display:flex;align-items:center;justify-content:center;padding:24px}
.auth-card{width:100%;max-width:440px;background:#fff;border:1px solid #E7E5E4;border-radius:16px;padding:40px 36px;box-shadow:0 4px 24px rgba(28,25,23,0.06)}
.auth-logo-row{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:8px}
.auth-logo{height:100px;width:auto}
.auth-brand{font-family:'Instrument Serif',serif;font-size:30px;font-weight:400;color:#1C1917;margin-left:-24px}
.auth-subtitle{text-align:center;font-size:15px;color:#78716C;margin-bottom:32px;line-height:1.5}
.auth-field{margin-bottom:18px}
.auth-label{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.auth-input-wrap{position:relative}
.auth-input{width:100%;padding:12px 14px;border:1.5px solid #E7E5E4;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;color:#1C1917;outline:none;transition:border-color .15s;background:#FAFAF9}
.auth-input:focus{border-color:#A8A29E;background:#fff}
.auth-input::placeholder{color:#D6D3D1}
.auth-input.has-eye{padding-right:44px}
.auth-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#A8A29E;cursor:pointer;padding:2px;display:flex}
.auth-eye:hover{color:#78716C}
.auth-optional{font-size:11px;color:#D6D3D1;font-weight:400;text-transform:none;letter-spacing:0;margin-left:6px;font-family:'DM Sans',sans-serif}
.auth-btn{width:100%;padding:14px;border:none;border-radius:10px;background:#1C1917;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;margin-top:8px}
.auth-btn:hover{background:#292524;transform:translateY(-1px);box-shadow:0 4px 12px rgba(28,25,23,0.15)}
.auth-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
.auth-switch{text-align:center;margin-top:20px;font-size:13px;color:#78716C}
.auth-switch a{color:#1C1917;font-weight:600;text-decoration:none;cursor:pointer}
.auth-switch a:hover{text-decoration:underline}
.auth-err{padding:10px 14px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;color:#991B1B;font-size:13px;margin-bottom:18px;animation:fu .2s ease}
.auth-step-row{display:flex;gap:8px;margin-bottom:28px}
.auth-step{flex:1;height:4px;border-radius:2px;background:#E7E5E4;transition:background .3s}
.auth-step.active{background:#1C1917}
.auth-back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:13px;color:#78716C;cursor:pointer;margin-bottom:16px;padding:0}
.auth-back:hover{color:#1C1917}
.auth-divider{display:flex;align-items:center;gap:12px;margin:20px 0}
.auth-divider-line{flex:1;height:1px;background:#E7E5E4}
.auth-divider-text{font-size:11px;color:#A8A29E;text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace}
.auth-info-note{font-size:12px;color:#A8A29E;text-align:center;margin-top:12px;line-height:1.5}
.auth-username-display{padding:12px 14px;border:1.5px solid #E7E5E4;border-radius:10px;background:#F5F5F4;font-size:14px;color:#78716C;font-family:'DM Sans',sans-serif;width:100%}
@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:480px){.auth-card{padding:28px 24px}.auth-logo{height:72px}.auth-brand{font-size:24px;margin-left:-18px}}
        `}</style>

        <div className="auth-root">
          <div className="auth-card">
            <div className="auth-logo-row">
              <img src={LOGO_SRC} alt="Postyn.ai" className="auth-logo" />
              <span className="auth-brand">Postyn.ai</span>
            </div>

            {authView === "login" && (
              <>
                <p className="auth-subtitle">Sign in to optimize your posts.</p>
                {authError && <div className="auth-err">{authError}</div>}
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input has-eye" type={showLoginPass ? "text" : "password"} placeholder="Enter your password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                    <button className="auth-eye" onClick={() => setShowLoginPass(!showLoginPass)} type="button">{showLoginPass ? eyeOffIcon : eyeIcon}</button>
                  </div>
                </div>
                <button className="auth-btn" onClick={handleLogin}>Sign In</button>
                <p className="auth-switch">Don't have an account? <a onClick={() => { setAuthView("signup"); setSignupStep(1); setAuthError(""); }}>Create one</a></p>
              </>
            )}

            {authView === "signup" && signupStep === 1 && (
              <>
                <p className="auth-subtitle">Let's get to know you first.</p>
                <div className="auth-step-row">
                  <div className="auth-step active" />
                  <div className="auth-step" />
                </div>
                {authError && <div className="auth-err">{authError}</div>}
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <input className="auth-input" type="text" placeholder="Jane Smith" value={signupForm.fullName} onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Phone Number <span className="auth-optional">Optional</span></label>
                  <input className="auth-input" type="tel" placeholder="(555) 123-4567" value={signupForm.phone} onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Industry or Job Title</label>
                  <input className="auth-input" type="text" placeholder="e.g. Marketing, Real Estate, SaaS Founder" value={signupForm.industry} onChange={(e) => setSignupForm({ ...signupForm, industry: e.target.value })} />
                </div>
                <button className="auth-btn" onClick={handleSignupNext}>Continue</button>
                <p className="auth-switch">Already have an account? <a onClick={() => { setAuthView("login"); setAuthError(""); }}>Sign in</a></p>
              </>
            )}

            {authView === "signup" && signupStep === 2 && (
              <>
                <button className="auth-back" onClick={() => { setSignupStep(1); setAuthError(""); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4"/></svg>
                  Back
                </button>
                <p className="auth-subtitle">Create your account credentials.</p>
                <div className="auth-step-row">
                  <div className="auth-step active" />
                  <div className="auth-step active" />
                </div>
                {authError && <div className="auth-err">{authError}</div>}
                <div className="auth-field">
                  <label className="auth-label">Username</label>
                  <div className="auth-username-display">{signupForm.email}</div>
                  <p className="auth-info-note">Your email is your username</p>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input has-eye" type={showSignupPass ? "text" : "password"} placeholder="At least 8 characters" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
                    <button className="auth-eye" onClick={() => setShowSignupPass(!showSignupPass)} type="button">{showSignupPass ? eyeOffIcon : eyeIcon}</button>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input has-eye" type={showConfirmPass ? "text" : "password"} placeholder="Re-enter your password" value={signupForm.confirmPassword} onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      style={signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword ? { borderColor: "#FCA5A5" } : signupForm.confirmPassword && signupForm.password === signupForm.confirmPassword ? { borderColor: "#86EFAC" } : {}} />
                    <button className="auth-eye" onClick={() => setShowConfirmPass(!showConfirmPass)} type="button">{showConfirmPass ? eyeOffIcon : eyeIcon}</button>
                  </div>
                  {signupForm.confirmPassword && signupForm.password === signupForm.confirmPassword && (
                    <p style={{ fontSize: 12, color: "#22C55E", marginTop: 4 }}>Passwords match</p>
                  )}
                  {signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword && (
                    <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>Passwords do not match</p>
                  )}
                </div>
                <button className="auth-btn" onClick={handleSignupComplete}>Create Account</button>
                <p className="auth-switch">Already have an account? <a onClick={() => { setAuthView("login"); setAuthError(""); }}>Sign in</a></p>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Main app ──
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.app-layout{font-family:'DM Sans',sans-serif;display:flex;min-height:100vh;background:#FAFAF9;color:#1C1917}

/* ── Sidebar ── */
.sidebar{width:240px;background:#fff;border-right:1px solid #E7E5E4;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;transition:transform .25s ease}
.sidebar.closed{transform:translateX(-240px)}
.sb-header{padding:20px 20px 16px;border-bottom:1px solid #E7E5E4;display:flex;align-items:center;gap:0}
.sb-logo{height:52px;width:auto}
.sb-brand{font-family:'Instrument Serif',serif;font-size:18px;font-weight:400;color:#1C1917;margin-left:-12px}
.sb-nav{flex:1;padding:12px;display:flex;flex-direction:column;gap:4px}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#78716C;cursor:pointer;transition:all .15s;text-align:left;width:100%}
.sb-item:hover{background:#F5F5F4;color:#57534E}
.sb-item.active{background:#F5F5F4;color:#1C1917;font-weight:600}
.sb-item svg{flex-shrink:0}
.sb-footer{padding:12px;border-top:1px solid #E7E5E4}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 12px;margin-bottom:8px}
.sb-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#E1306C,#0A66C2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#fff}
.sb-user-info{flex:1;min-width:0}
.sb-user-name{font-size:13px;font-weight:600;color:#1C1917;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-user-email{font-size:11px;color:#A8A29E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-signout{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#A8A29E;cursor:pointer;transition:all .15s;width:100%;text-align:left}
.sb-signout:hover{background:#FEF2F2;color:#991B1B}

/* ── Main content ── */
.main-wrap{flex:1;margin-left:240px;transition:margin-left .25s ease}
.main-wrap.expanded{margin-left:0}
.sb-toggle{position:fixed;top:16px;left:16px;z-index:51;width:36px;height:36px;border-radius:8px;border:1px solid #E7E5E4;background:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.sb-toggle:hover{background:#F5F5F4}
.sb-toggle.show{display:flex}

.root{min-height:100vh;background:#FAFAF9;color:#1C1917}
.hdr{padding:0;border-bottom:1px solid #E7E5E4;background:#FAFAF9}
.hdr-inner{max-width:800px;margin:0 auto;padding:20px 32px 32px;text-align:center}
.hdr-bar{display:inline-flex;align-items:center;gap:0;margin-bottom:4px}
.hdr-logo{height:160px;width:auto;display:block}
.hdr-brand{font-family:'Instrument Serif',serif;font-size:38px;font-weight:400;color:#1C1917;letter-spacing:-0.01em;margin-left:-40px}
.hdr-t{font-family:'Instrument Serif',serif;font-size:40px;font-weight:400;line-height:1.1;color:#1C1917;margin-bottom:8px}
.hdr-s{font-size:15px;color:#78716C;line-height:1.5;max-width:560px;margin:0 auto}
.main{max-width:800px;margin:0 auto;padding:32px}
.row{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.grp{flex:1;min-width:180px}
.lbl{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.pbtn-row{display:flex;gap:6px}
.pbtn{flex:1;padding:10px 8px;border:1.5px solid #E7E5E4;border-radius:8px;background:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:center;color:#57534E}
.pbtn:hover{border-color:#D6D3D1;background:#F5F5F4}
.pbtn.on{border-color:var(--pc);background:var(--pc);color:#fff;box-shadow:0 2px 8px color-mix(in srgb,var(--pc) 30%,transparent)}
.sel{width:100%;padding:10px 12px;border:1.5px solid #E7E5E4;border-radius:8px;background:#fff url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2378716C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#1C1917;cursor:pointer;appearance:none}
.skill-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:linear-gradient(135deg,#F0FDF4,#ECFDF5);border:1px solid #86EFAC;border-radius:8px;margin-bottom:16px}
.skill-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{opacity:.8;box-shadow:0 0 0 6px rgba(34,197,94,0)}}
.skill-txt{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#166534}
.info-tog{display:inline-flex;align-items:center;gap:6px;margin-bottom:20px;padding:6px 12px;background:transparent;border:1px solid #E7E5E4;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:#78716C;cursor:pointer;transition:all .15s}
.info-tog:hover{background:#F5F5F4;color:#57534E}
.info-panel{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:20px;margin-bottom:24px;animation:slideD .2s ease}
@keyframes slideD{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.info-panel h4{font-size:14px;font-weight:600;margin-bottom:12px}
.info-panel li{font-size:13px;color:#57534E;line-height:1.6;margin-bottom:4px;list-style:none;padding-left:16px;position:relative}
.info-panel li::before{content:'→';position:absolute;left:0;color:#A8A29E}
.algo-note{margin-top:14px;padding:12px;background:#FAFAF9;border-radius:6px;font-size:12px;color:#78716C;line-height:1.5;font-style:italic}
.ta-wrap{position:relative;margin-bottom:16px}
.ta{width:100%;min-height:200px;padding:20px;border:1.5px solid #E7E5E4;border-radius:10px;background:#fff;font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.65;color:#1C1917;resize:vertical;transition:border-color .15s;outline:none}
.ta:focus{border-color:#A8A29E}
.ta::placeholder{color:#D6D3D1}
.cc{position:absolute;bottom:12px;right:16px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#A8A29E}
.cc.over{color:#EF4444;font-weight:600}
.att-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.att-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:#fff;border:1.5px dashed #D6D3D1;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#57534E;cursor:pointer;transition:all .15s}
.att-btn:hover{border-color:#A8A29E;background:#F5F5F4;color:#1C1917}
.att-hint{font-size:11px;color:#A8A29E;font-style:italic}
.att-prev{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.att-chip{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;background:#fff;border:1px solid #E7E5E4;border-radius:8px}
.att-thumb{width:36px;height:36px;border-radius:5px;object-fit:cover}
.att-icon{width:36px;height:36px;border-radius:5px;background:#F5F5F4;display:flex;align-items:center;justify-content:center}
.att-info{display:flex;flex-direction:column;gap:1px}
.att-name{font-size:12px;font-weight:500;color:#1C1917}
.att-size{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E}
.att-rm{margin-left:4px;padding:4px;background:none;border:none;color:#A8A29E;cursor:pointer;border-radius:4px;transition:all .15s;display:flex}
.att-rm:hover{background:#FEF2F2;color:#EF4444}
.go{width:100%;padding:14px 24px;border:none;border-radius:10px;background:#1C1917;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;margin-bottom:32px}
.go:hover:not(:disabled){background:#292524;transform:translateY(-1px);box-shadow:0 4px 12px rgba(28,25,23,.15)}
.go:disabled{opacity:.4;cursor:not-allowed}
.ld{text-align:center;padding:48px 24px}
.spin{width:32px;height:32px;border:2.5px solid #E7E5E4;border-top-color:#1C1917;border-radius:50%;animation:sp .8s linear infinite;margin:0 auto 16px}
@keyframes sp{to{transform:rotate(360deg)}}
.ld-t{font-size:14px;color:#78716C}
.ld-s{font-size:12px;color:#A8A29E;margin-top:4px}
.rh{display:flex;align-items:baseline;gap:12px;margin-bottom:24px}
.rt{font-family:'Instrument Serif',serif;font-size:28px;color:#1C1917}
.rc{font-family:'JetBrains Mono',monospace;font-size:11px;color:#A8A29E;letter-spacing:.05em}
.card{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:20px;margin-bottom:12px;transition:box-shadow .15s;animation:fu .3s ease both}
.card:hover{box-shadow:0 2px 12px rgba(28,25,23,.06)}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.card-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.sev{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}
.sev-dot{width:6px;height:6px;border-radius:50%}
.sec{font-size:14px;font-weight:600;color:#1C1917}
.c-lbl{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:6px}
.c-cur{padding:12px 16px;background:#FEF2F2;border-left:3px solid #FCA5A5;border-radius:0 6px 6px 0;margin-bottom:12px;font-size:13px;line-height:1.6;color:#991B1B}
.c-sug{padding:12px 16px;background:#F0FDF4;border-left:3px solid #86EFAC;border-radius:0 6px 6px 0;margin-bottom:12px;font-size:13px;line-height:1.6;color:#166534}
.c-why{font-size:13px;line-height:1.6;color:#78716C;padding-top:8px;border-top:1px solid #F5F5F4}
.rw{background:#1C1917;border-radius:12px;padding:24px;margin-top:24px;margin-bottom:12px;animation:fu .3s ease both}
.rw-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.rw-t{font-family:'Instrument Serif',serif;font-size:20px;color:#fff}
.cp{padding:8px 16px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:transparent;color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s}
.cp:hover{background:rgba(255,255,255,.1)}
.cp.ok{border-color:#22C55E;color:#22C55E}
.rw-b{font-size:15px;line-height:1.7;color:rgba(255,255,255,.85);white-space:pre-wrap;word-break:break-word}
.err{padding:16px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:8px;color:#991B1B;font-size:14px;margin-bottom:24px}

/* ── History Page ── */
.hist-hdr{max-width:800px;margin:0 auto;padding:32px 32px 24px}
.hist-t{font-family:'Instrument Serif',serif;font-size:32px;color:#1C1917;margin-bottom:4px}
.hist-sub{font-size:14px;color:#78716C}
.hist-list{max-width:800px;margin:0 auto;padding:0 32px 32px}
.hist-empty{text-align:center;padding:64px 24px}
.hist-empty-icon{font-size:48px;margin-bottom:12px;opacity:.3}
.hist-empty-t{font-size:16px;font-weight:600;color:#78716C;margin-bottom:4px}
.hist-empty-s{font-size:13px;color:#A8A29E}
.hist-card{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:20px;margin-bottom:12px;transition:box-shadow .15s;animation:fu .3s ease both}
.hist-card:hover{box-shadow:0 2px 12px rgba(28,25,23,.06)}
.hist-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.hist-card-meta{display:flex;align-items:center;gap:8px}
.hist-plat{padding:3px 10px;border-radius:100px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#fff}
.hist-goal{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E;letter-spacing:.04em;text-transform:uppercase}
.hist-date{font-size:12px;color:#A8A29E}
.hist-orig{font-size:13px;color:#78716C;line-height:1.5;margin-bottom:12px;padding:10px 14px;background:#FAFAF9;border-radius:6px}
.hist-orig-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#A8A29E;margin-bottom:4px}
.hist-optimized{font-size:13px;color:#1C1917;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.hist-expand{background:none;border:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:#0A66C2;cursor:pointer;padding:0;margin-top:8px}
.hist-expand:hover{text-decoration:underline}
.hist-stats{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A8A29E;margin-top:10px;padding-top:10px;border-top:1px solid #F5F5F4}
.hist-copy{padding:6px 12px;border:1px solid #E7E5E4;border-radius:6px;background:#fff;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;color:#57534E;cursor:pointer;transition:all .15s}
.hist-copy:hover{background:#F5F5F4;border-color:#D6D3D1}

@media(max-width:768px){.sidebar{transform:translateX(-240px)}.sidebar.open{transform:translateX(0)}.main-wrap{margin-left:0}.sb-toggle{display:flex}}
@media(max-width:640px){.hdr-inner{padding:16px 20px 24px}.hdr-t{font-size:30px}.hdr-logo{height:110px;margin-left:-10px}.hdr-brand{font-size:28px;margin-left:-28px}.main{padding:20px}.pbtn-row{flex-wrap:wrap}.pbtn{min-width:calc(50% - 4px)}.row{flex-direction:column}.hist-hdr{padding:24px 20px 16px}.hist-list{padding:0 20px 20px}}
      `}</style>

      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="sb-header">
            <img src={LOGO_SRC} alt="Postyn.ai" className="sb-logo" />
            <span className="sb-brand">Postyn.ai</span>
          </div>
          <nav className="sb-nav">
            <button className={`sb-item ${page === "optimizer" ? "active" : ""}`} onClick={() => setPage("optimizer")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Optimize Post
            </button>
            <button className={`sb-item ${page === "history" ? "active" : ""}`} onClick={() => setPage("history")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Previous Posts
              {postHistory.length > 0 && <span style={{ marginLeft: "auto", background: "#E7E5E4", borderRadius: 100, padding: "1px 7px", fontSize: 11, fontWeight: 600, color: "#57534E" }}>{postHistory.length}</span>}
            </button>
          </nav>
          <div className="sb-footer">
            <div className="sb-user">
              <div className="sb-avatar">{(signupForm.fullName || loginForm.email || "U").charAt(0).toUpperCase()}</div>
              <div className="sb-user-info">
                <div className="sb-user-name">{signupForm.fullName || "User"}</div>
                <div className="sb-user-email">{signupForm.email || loginForm.email || ""}</div>
              </div>
            </div>
            <button className="sb-signout" onClick={() => { setAuthView("login"); setLoginForm({ email: "", password: "" }); setSignupForm({ fullName: "", email: "", phone: "", industry: "", password: "", confirmPassword: "" }); setSignupStep(1); setPage("optimizer"); setSuggestions(null); setDraft(""); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile toggle */}
        <button className={`sb-toggle ${!sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        {/* Main content */}
        <div className={`main-wrap ${!sidebarOpen ? "expanded" : ""}`}>

        {page === "optimizer" && (
      <div className="root">
        <header className="hdr">
          <div className="hdr-inner">
            <div className="hdr-bar">
              <img src={LOGO_SRC} alt="Postyn.ai" className="hdr-logo" />
              <span className="hdr-brand">Postyn.ai</span>
            </div>
            <h1 className="hdr-t">Write posts that actually perform.</h1>
            <p className="hdr-s">Paste your draft. Pick your platform. Get specific, explainable changes backed by how each algorithm actually works.</p>
          </div>
        </header>

        <main className="main">
          <div className="row">
            <div className="grp" style={{ flex: 2 }}>
              <div className="lbl">Platform</div>
              <div className="pbtn-row">
                {Object.entries(P).map(([k, c]) => (
                  <button key={k} className={`pbtn ${platform === k ? "on" : ""}`} style={{ "--pc": c.color }} onClick={() => setPlatform(k)}>{c.name}</button>
                ))}
              </div>
            </div>
            <div className="grp">
              <div className="lbl">Optimize for</div>
              <select className="sel" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="impressions">Impressions & Reach</option>
                <option value="engagement">Engagement (comments, shares)</option>
                <option value="likes">Likes & Reactions</option>
                <option value="followers">Follower Growth</option>
              </select>
            </div>
          </div>

          {hasSkill && (
            <div className="skill-badge">
              <span className="skill-dot" />
              <span className="skill-txt">Deep Skill Active: {cfg.name} {GOAL_LABELS[goal]} Engine</span>
            </div>
          )}

          <button className="info-tog" onClick={() => setShowInfo(!showInfo)}>
            {showInfo ? "−" : "+"} {cfg.name} algorithm intel
          </button>

          {showInfo && (
            <div className="info-panel">
              <h4>What works on {cfg.name}</h4>
              <ul>{cfg.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
              <div className="algo-note"><strong>How the algorithm thinks:</strong> {cfg.algo}</div>
            </div>
          )}

          <div className="ta-wrap">
            <textarea ref={textareaRef} className="ta" value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder={`Paste your ${cfg.name} post draft here...\n\nWrite it however you normally would — even if it's rough. The optimizer will tell you exactly what to change and why.`} />
            <span className={`cc ${overLimit ? "over" : ""}`}>{charCount.toLocaleString()} / {cfg.max.toLocaleString()}</span>
          </div>

          <input ref={fileRef} type="file" multiple accept="image/*,.pdf" onChange={handleFiles} style={{ display: "none" }} />
          <div className="att-row">
            <button className="att-btn" onClick={() => fileRef.current?.click()}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8.5l-5.5 5.5a3.5 3.5 0 01-5-5l6.5-6.5a2.5 2.5 0 013.5 3.5L7 12.5a1.5 1.5 0 01-2-2L10.5 5"/></svg>
              Attach image or PDF
            </button>
            <span className="att-hint">{platform === "instagram" || platform === "linkedin" ? "Carousel PDFs and images will be analyzed for caption optimization" : "Images will be factored into caption suggestions"}</span>
          </div>

          {attachments.length > 0 && (
            <div className="att-prev">
              {attachments.map((a, i) => (
                <div className="att-chip" key={i}>
                  {a.preview ? <img src={a.preview} alt={a.name} className="att-thumb" /> : (
                    <div className="att-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#78716C" strokeWidth="1.2"><path d="M8 1H3.5A1.5 1.5 0 002 2.5v9A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V5L8 1z"/><path d="M8 1v4h4"/></svg></div>
                  )}
                  <div className="att-info">
                    <span className="att-name">{a.name.length > 24 ? a.name.slice(0, 22) + "…" : a.name}</span>
                    <span className="att-size">{fmtSize(a.size)}</span>
                  </div>
                  <button className="att-rm" onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3L3 9M3 3l6 6"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="go" onClick={analyze} disabled={!draft.trim() || loading}>{loading ? "Analyzing..." : "Optimize this post"}</button>

          {error && <div className="err">{error}</div>}

          {loading && (
            <div className="ld">
              <div className="spin" />
              <div className="ld-t">{hasSkill ? `Running ${cfg.name} ${GOAL_LABELS[goal]} optimization skill...` : `Breaking down your post against ${cfg.name}'s algorithm...`}</div>
              <div className="ld-s">{LOADING_SUB[loadKey] || "Analyzing hook strength, structure, tone, and engagement signals"}</div>
            </div>
          )}

          {suggestions && (
            <div ref={resultsRef}>
              <div className="rh">
                <h2 className="rt">Analysis</h2>
                <span className="rc">{items.length} suggestion{items.length !== 1 ? "s" : ""}</span>
              </div>

              {items.map((s, i) => {
                const sv = SEV[s.severity] || SEV.polish;
                return (
                  <div className="card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="card-top">
                      <span className="sev" style={{ background: sv.bg, color: sv.text, border: `1px solid ${sv.border}` }}>
                        <span className="sev-dot" style={{ background: sv.dot }} />{sv.label}
                      </span>
                      <span className="sec">{s.section}</span>
                    </div>
                    {s.current && (<><div className="c-lbl">Current</div><div className="c-cur">{s.current}</div></>)}
                    <div className="c-lbl">Suggested change</div>
                    <div className="c-sug">{s.suggestion}</div>
                    <div className="c-why">{s.reasoning}</div>
                  </div>
                );
              })}

              {rewrite && (
                <div className="rw">
                  <div className="rw-hd">
                    <span className="rw-t">Optimized Post</span>
                    <button className={`cp ${copied ? "ok" : ""}`} onClick={() => copy(rewrite.suggestion)}>{copied ? "Copied ✓" : "Copy post"}</button>
                  </div>
                  <div className="rw-b">{rewrite.suggestion}</div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
        )}

        {page === "history" && (
          <div className="root">
            <div className="hist-hdr">
              <h1 className="hist-t">Previous Posts</h1>
              <p className="hist-sub">{postHistory.length} optimized post{postHistory.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="hist-list">
              {postHistory.length === 0 && (
                <div className="hist-empty">
                  <div className="hist-empty-icon">📝</div>
                  <div className="hist-empty-t">No posts yet</div>
                  <div className="hist-empty-s">Your optimized posts will appear here after you run your first optimization.</div>
                </div>
              )}
              {postHistory.map((post, i) => (
                <HistoryCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </>
  );
}
