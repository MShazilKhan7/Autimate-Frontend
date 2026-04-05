import { Tier } from "@/types/onboarding";
import { OnboardingQuestions } from "@/types/onboarding";

// ─── Research Framework ────────────────────────────────────────────────────────
// Based on:
// • MacArthur-Bates CDI (Communicative Development Inventories)
// • ASHA Functional Communication Measures (FCMs)
// • Autism Diagnostic Observation Schedule (ADOS-2) communication domains
// • GFTA-3 (Goldman-Fristoe Test of Articulation) difficulty tiers
// • Rossetti Infant-Toddler Language Scale
// • Hryntsiv et al. (2025) K1–K4 evaluation criteria (cited in FYP report)
// ──────────────────────────────────────────────────────────────────────────────

export const TIERS: Tier[] = [
    {
        id: 1,
        label: "Emerging Communicator",
        range: [0, 29],
        color: "#FF6B6B",
        bg: "#FFF0F0",
        description:
            "Primarily pre-verbal or single-word stage. Therapy focuses on foundational sound production, imitation, and joint attention.",
        phonemeTargets: ["p", "b", "m", "w", "h"],
        vocab: "≤ 20 functional words",
        sessionLength: "5–8 min",
        exercises: ["Vowel Imitation", "Lip Sounds (p/b/m)", "Sound-Object Pairing"],
        difficultyLevel: "Level 1 – Phoneme Isolation",
    },
    {
        id: 2,
        label: "Early Expressive",
        range: [30, 49],
        color: "#FF9F43",
        bg: "#FFF5EC",
        description:
            "Two-word combinations emerging. Therapy builds 50–200 word vocabulary, targets early consonants, and develops functional requesting.",
        phonemeTargets: ["t", "d", "n", "f", "k", "g"],
        vocab: "50–200 words",
        sessionLength: "8–10 min",
        exercises: ["Word Imitation", "Two-Word Phrases", "Early Consonant Drills"],
        difficultyLevel: "Level 2 – Word Production",
    },
    {
        id: 3,
        label: "Functional Phrase",
        range: [50, 64],
        color: "#F9CA24",
        bg: "#FFFAEC",
        description:
            "3–5 word utterances present but with notable articulation errors. Therapy targets phoneme accuracy, sentence structure, and conversational turns.",
        phonemeTargets: ["s", "z", "sh", "ch", "l"],
        vocab: "200–500 words",
        sessionLength: "10–12 min",
        exercises: ["Sentence Completion", "Phoneme in Words", "Turn-Taking Games"],
        difficultyLevel: "Level 3 – Sentence Level",
    },
    {
        id: 4,
        label: "Developing Communicator",
        range: [65, 79],
        color: "#6AB04C",
        bg: "#F0FFF0",
        description:
            "Mostly intelligible speech with residual errors on complex phonemes. Therapy refines articulation, expands vocabulary, and builds pragmatic skills.",
        phonemeTargets: ["r", "th", "v", "bl", "str"],
        vocab: "500–1000 words",
        sessionLength: "12–15 min",
        exercises: ["Story Retelling", "Minimal Pairs", "Social Scripts"],
        difficultyLevel: "Level 4 – Connected Speech",
    },
    {
        id: 5,
        label: "Advancing Communicator",
        range: [80, 100],
        color: "#4A90D9",
        bg: "#EEF5FF",
        description:
            "Near age-appropriate speech with subtle errors. Therapy focuses on prosody, fluency, pragmatic nuance, and generalisation to real-world contexts.",
        phonemeTargets: ["r-blends", "complex clusters", "prosody"],
        vocab: "1000+ words",
        sessionLength: "15 min",
        exercises: ["Conversation Practice", "Prosody & Intonation", "Narrative Building"],
        difficultyLevel: "Level 5 – Discourse Level",
    },
];

export const QUESTIONS: OnboardingQuestions = {
    communication_mode: {
        title: "Primary Communication",
        subtitle: "How does your child most often communicate right now?",
        research: "ADOS-2 Module A/B communication domain screening",
        type: "single",
        options: [
            { id: "nonverbal", label: "No words yet", sub: "Uses gestures, pointing, or sounds", score: { expressive: 0, receptive: 0 } },
            { id: "single_words", label: "Single words", sub: "Says individual words occasionally", score: { expressive: 6, receptive: 3 } },
            { id: "two_word", label: "Two-word phrases", sub: '"More juice", "Daddy go"', score: { expressive: 12, receptive: 7 } },
            { id: "short_sentences", label: "Short sentences", sub: "3–5 words, sometimes unclear", score: { expressive: 18, receptive: 12 } },
            { id: "full_sentences", label: "Full sentences", sub: "Mostly understood by strangers", score: { expressive: 26, receptive: 18 } },
        ],
    },

    expressive_language: {
        title: "Expressive Language",
        subtitle: "Questions about what your child can say and express",
        research: "MacArthur-Bates CDI + ASHA FCM Level (Expressive Language)",
        questions: [
            {
                id: "vocab_size",
                text: "Approximately how many different words does your child use consistently?",
                type: "scale",
                options: [
                    { label: "0–10 words", score: 0 },
                    { label: "10–50 words", score: 2 },
                    { label: "50–200 words", score: 4 },
                    { label: "200–500 words", score: 6 },
                    { label: "500+ words", score: 8 },
                ],
            },
            {
                id: "initiate_comm",
                text: "Does your child initiate communication (ask for things, comment on events) without being prompted?",
                type: "frequency",
                options: [
                    { label: "Never / rarely", score: 0 },
                    { label: "Sometimes (1–2×/day)", score: 1 },
                    { label: "Often (several times/day)", score: 2 },
                    { label: "Frequently (many times/day)", score: 3 },
                ],
            },
            {
                id: "combine_words",
                text: "Does your child combine words into phrases or sentences?",
                type: "frequency",
                options: [
                    { label: "No – single words only", score: 0 },
                    { label: "Occasionally 2-word combos", score: 1 },
                    { label: "Regular 2–3 word phrases", score: 2 },
                    { label: "3–5 word sentences often", score: 3 },
                ],
            },
            {
                id: "echolalia",
                text: "Does your child repeat phrases they heard before (echolalia) instead of forming new sentences?",
                type: "frequency",
                options: [
                    { label: "Mostly echolalia", score: 0 },
                    { label: "Frequent echolalia", score: 1 },
                    { label: "Some echolalia", score: 2 },
                    { label: "Rare / no echolalia", score: 3 },
                ],
            },
            {
                id: "ask_questions",
                text: "Can your child ask simple questions (What's that? Where is...?)?",
                type: "frequency",
                options: [
                    { label: "No", score: 0 },
                    { label: "Rarely", score: 1 },
                    { label: "Sometimes", score: 2 },
                    { label: "Yes, regularly", score: 3 },
                ],
            },
        ],
    },

    receptive_language: {
        title: "Receptive Language",
        subtitle: "How well does your child understand language?",
        research: "Rossetti Scale + ADOS-2 Receptive Language Domain",
        questions: [
            {
                id: "follow_instructions",
                text: "How many steps of instructions can your child follow WITHOUT gestures?",
                type: "scale",
                options: [
                    { label: "Cannot follow verbal instructions", score: 0 },
                    { label: "1-step ('Come here')", score: 2 },
                    { label: "2-step ('Get your shoes and sit down')", score: 4 },
                    { label: "3+ step instructions", score: 6 },
                ],
            },
            {
                id: "understand_questions",
                text: "Does your child understand and respond to Wh- questions (What, Where, Who)?",
                type: "frequency",
                options: [
                    { label: "No response to questions", score: 0 },
                    { label: "Responds to 'What' only", score: 1 },
                    { label: "Understands What & Where", score: 2 },
                    { label: "Understands most Wh- questions", score: 3 },
                ],
            },
            {
                id: "concept_understanding",
                text: "Can your child identify objects, pictures, or body parts when named?",
                type: "frequency",
                options: [
                    { label: "No consistent responses", score: 0 },
                    { label: "A few familiar objects", score: 1 },
                    { label: "Many objects/body parts", score: 2 },
                    { label: "Identifies pictures in books too", score: 3 },
                ],
            },
            {
                id: "story_comprehension",
                text: "Can your child follow along with a simple picture story or answer questions about it?",
                type: "frequency",
                options: [
                    { label: "Not yet", score: 0 },
                    { label: "With lots of support", score: 1 },
                    { label: "With some support", score: 2 },
                    { label: "Independently", score: 3 },
                ],
            },
        ],
    },

    articulation: {
        title: "Speech Clarity & Articulation",
        subtitle: "How clearly does your child produce speech sounds?",
        research: "GFTA-3 developmental norms + PMDD error taxonomy (substitution, omission, distortion)",
        questions: [
            {
                id: "stranger_intelligibility",
                text: "How well can an unfamiliar person (stranger) understand your child?",
                type: "scale",
                options: [
                    { label: "Almost never understood (<25%)", score: 0 },
                    { label: "Sometimes understood (25–50%)", score: 3 },
                    { label: "Often understood (50–75%)", score: 6 },
                    { label: "Mostly understood (75–90%)", score: 9 },
                    { label: "Always understood (90%+)", score: 12 },
                ],
            },
            {
                id: "sound_errors",
                text: "Which sounds does your child have the MOST difficulty with?",
                type: "multiselect",
                options: [
                    { label: "Early sounds (p, b, m, w)", score: 0 },
                    { label: "Middle sounds (t, d, n, k, g)", score: 2 },
                    { label: "Later sounds (s, z, f, v, sh)", score: 4 },
                    { label: "Complex sounds (r, l, th, clusters)", score: 6 },
                    { label: "No major sound errors", score: 8 },
                ],
                maxScore: 8,
            },
            {
                id: "error_type",
                text: "When your child makes speech errors, what type are they most often?",
                type: "single",
                options: [
                    { label: "Omits sounds entirely ('ca' for 'cat')", score: 0 },
                    { label: "Substitutes one sound for another ('tat' for 'cat')", score: 2 },
                    { label: "Distorts sounds (approximations)", score: 4 },
                    { label: "Mostly accurate, rare errors", score: 6 },
                    { label: "Not sure / no clear pattern", score: 3 },
                ],
            },
            {
                id: "prosody",
                text: "How would you describe your child's speech rhythm and intonation?",
                type: "single",
                options: [
                    { label: "Flat or robotic sounding", score: 0 },
                    { label: "Unusual melody (sing-song or monotone)", score: 1 },
                    { label: "Sometimes natural, sometimes unusual", score: 2 },
                    { label: "Generally natural sounding", score: 4 },
                ],
            },
        ],
    },

    social_pragmatics: {
        title: "Social Communication",
        subtitle: "How does your child use language in social situations?",
        research: "ADOS-2 Social Affect domain + Hryntsiv et al. K2 criterion (Communication & Social Skills)",
        questions: [
            {
                id: "eye_contact",
                text: "Does your child make eye contact during communication?",
                type: "frequency",
                options: [
                    { label: "Rarely or never", score: 0 },
                    { label: "Sometimes with prompting", score: 1 },
                    { label: "Often spontaneously", score: 2 },
                    { label: "Consistently and naturally", score: 3 },
                ],
            },
            {
                id: "turn_taking",
                text: "Can your child take turns in a conversation (wait, respond, reply)?",
                type: "frequency",
                options: [
                    { label: "No turn-taking", score: 0 },
                    { label: "With significant support", score: 1 },
                    { label: "With some prompting", score: 2 },
                    { label: "Fairly independently", score: 3 },
                ],
            },
            {
                id: "share_emotions",
                text: "Does your child share experiences or emotions verbally ('Look!' / 'I'm happy!')?",
                type: "frequency",
                options: [
                    { label: "Never", score: 0 },
                    { label: "Rarely", score: 1 },
                    { label: "Sometimes", score: 2 },
                    { label: "Often", score: 3 },
                ],
            },
            {
                id: "greetings",
                text: "Does your child use greetings and farewells (hi, bye, thank you) appropriately?",
                type: "frequency",
                options: [
                    { label: "Not yet", score: 0 },
                    { label: "With prompting only", score: 1 },
                    { label: "Sometimes spontaneously", score: 2 },
                    { label: "Usually spontaneously", score: 3 },
                ],
            },
            {
                id: "topic_maintenance",
                text: "Can your child stay on topic in a conversation for more than 2–3 exchanges?",
                type: "frequency",
                options: [
                    { label: "No – changes topic or disengages immediately", score: 0 },
                    { label: "1–2 exchanges only", score: 1 },
                    { label: "3–5 exchanges with effort", score: 2 },
                    { label: "Maintains topic well", score: 3 },
                ],
            },
        ],
    },

    sensory_engagement: {
        title: "Engagement & Sensory Profile",
        subtitle: "Help us design the best learning environment for your child",
        research: "Sensory profile informs gamification design (Jain et al. 2023; Meier et al. 2024)",
        questions: [
            {
                id: "session_duration",
                text: "How long can your child typically focus on a preferred activity?",
                type: "scale",
                options: [
                    { label: "1–3 minutes", val: "3min" },
                    { label: "3–5 minutes", val: "5min" },
                    { label: "5–10 minutes", val: "10min" },
                    { label: "10–15 minutes", val: "15min" },
                    { label: "15+ minutes", val: "15plus" },
                ],
            },
            {
                id: "motivators",
                text: "What motivates your child most? (Select all that apply)",
                type: "multiselect_pref",
                options: [
                    { label: "🦕 Animals & Dinosaurs", val: "animals" },
                    { label: "🚂 Vehicles & Trains", val: "vehicles" },
                    { label: "⭐ Stars & Space", val: "space" },
                    { label: "🎵 Music & Songs", val: "music" },
                    { label: "🎨 Colors & Art", val: "art" },
                    { label: "🦸 Superheroes & Characters", val: "characters" },
                    { label: "🌿 Nature & Plants", val: "nature" },
                    { label: "🔢 Numbers & Letters", val: "academic" },
                ],
            },
            {
                id: "reward_type",
                text: "What type of reward does your child respond best to?",
                type: "single_pref",
                options: [
                    { label: "🌟 Stars and points", val: "points" },
                    { label: "🎉 Celebrations & animations", val: "celebration" },
                    { label: "🏆 Badges and trophies", val: "badges" },
                    { label: "🎁 Unlocking new content", val: "unlock" },
                ],
            },
            {
                id: "sensory_sensitivity",
                text: "Does your child have sensory sensitivities we should know about?",
                type: "multiselect_pref",
                options: [
                    { label: "Sensitive to loud sounds", val: "sound_sensitive" },
                    { label: "Sensitive to bright visuals / flashing", val: "visual_sensitive" },
                    { label: "Prefers calm, minimal animations", val: "calm_pref" },
                    { label: "Loves bright colors and movement", val: "stimulation_pref" },
                    { label: "No specific sensitivities", val: "none" },
                ],
            },
        ],
    },

    caregiver_goals: {
        title: "Your Therapy Goals",
        subtitle: "What matters most to you and your child's therapist?",
        research: "Hryntsiv et al. K1–K4 + ASHA goal framework",
        questions: [
            {
                id: "primary_goal",
                text: "What is your MOST important therapy goal right now?",
                type: "single_pref",
                options: [
                    { label: "🗣️ Get my child talking more / using more words", val: "increase_vocab" },
                    { label: "🔊 Improve how clearly my child speaks", val: "articulation" },
                    { label: "👋 Help my child communicate with others socially", val: "social" },
                    { label: "👂 Help my child understand what's said to them", val: "receptive" },
                    { label: "📈 General all-round improvement", val: "overall" },
                ],
            },
            {
                id: "therapist_involvement",
                text: "Is your child currently working with a speech-language pathologist?",
                type: "single_pref",
                options: [
                    { label: "Yes – regular sessions", val: "active_slp" },
                    { label: "Yes – but sessions are infrequent", val: "infrequent_slp" },
                    { label: "Waiting list / not yet started", val: "waitlist" },
                    { label: "No therapist at this time", val: "no_slp" },
                ],
            },
            {
                id: "home_practice",
                text: "How much time can you realistically dedicate to home practice per day?",
                type: "single_pref",
                options: [
                    { label: "5–10 minutes", val: "5_10min" },
                    { label: "10–20 minutes", val: "10_20min" },
                    { label: "20–30 minutes", val: "20_30min" },
                    { label: "30+ minutes", val: "30plus" },
                ],
            },
        ],
    },
};