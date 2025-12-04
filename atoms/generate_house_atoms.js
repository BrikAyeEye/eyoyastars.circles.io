const fs = require('fs');
const path = require('path');

/**
 * GENERATE HIGH-QUALITY HOUSE ATOMS
 * 
 * Creates punchy, vivid atoms for all 120 planet-house combinations
 * in the same style as the best placement atoms.
 */

const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const HOUSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const HOUSE_DOMAINS = {
    '1st': 'Identity & Self',
    '2nd': 'Money & Resources',
    '3rd': 'Communication & Learning',
    '4th': 'Home & Family',
    '5th': 'Creativity & Pleasure',
    '6th': 'Work & Health',
    '7th': 'Relationships & Partnerships',
    '8th': 'Transformation & Shared Resources',
    '9th': 'Philosophy & Expansion',
    '10th': 'Career & Public Image',
    '11th': 'Friends & Community',
    '12th': 'Spirituality & Subconscious'
};

// Comprehensive atom library for each planet-house combination
const HOUSE_ATOMS = {
    'Sun': {
        '1st': [
            "You are here to be seen, not to hide.",
            "Your presence enters the room before you do.",
            "Self-discovery is your primary career.",
            "You lead best when you are being unapologetically yourself.",
            "Your vitality is directly linked to your independence.",
            "You are the protagonist of your own life, and you know it.",
            "Confidence is your natural state, even if you have to fake it sometimes.",
            "You shine by blazing a trail that is uniquely yours."
        ],
        '2nd': [
            "Your worth is written in what you build, not what you borrow.",
            "You define value through tangible accumulation.",
            "Money flows when you honor your own pricing.",
            "Your identity is tied to what you can touch and own.",
            "You shine brightest when you're building something real.",
            "Security isn't a luxury—it's your foundation.",
            "You attract resources by valuing yourself first.",
            "Your self-worth multiplies through steady investment."
        ],
        '3rd': [
            "Your identity is written in every conversation you start.",
            "You shine through words, ideas, and relentless curiosity.",
            "Learning isn't a hobby—it's how you discover who you are.",
            "Your presence is felt through what you communicate.",
            "You define yourself by what you know and how you share it.",
            "Your voice is your calling card.",
            "You become who you are through constant mental stimulation.",
            "Identity crystallizes in the spaces between your words."
        ],
        '4th': [
            "Your identity is rooted in where you come from.",
            "Home isn't a place—it's who you are at your core.",
            "You shine brightest in private spaces with people you trust.",
            "Your foundation is your greatest strength.",
            "Family history writes itself into your bones.",
            "You define yourself through what you protect and nurture.",
            "Your roots run deeper than anyone suspects.",
            "Identity blooms in the safety of your inner sanctuary."
        ],
        '5th': [
            "You shine through what you create, not what you consume.",
            "Your identity is written in every risk you take for joy.",
            "You become who you are through play, not work.",
            "Self-expression isn't optional—it's your life force.",
            "You define yourself by what makes you feel alive.",
            "Your presence radiates when you're doing what you love.",
            "Identity crystallizes in moments of pure creative flow.",
            "You are most yourself when you're creating something new."
        ],
        '6th': [
            "You find your purpose in the details that others ignore.",
            "Service is your language of leadership.",
            "You shine when you are solving a practical problem.",
            "Your daily routine is the altar where you worship your potential.",
            "You need to feel useful to feel alive.",
            "Health and body wisdom are central to your identity.",
            "You are a craftsman, refining your life one day at a time.",
            "Chaos is your enemy; efficiency is your superpower."
        ],
        '7th': [
            "You don't know who you are until you see yourself reflected in another.",
            "Your identity is defined through partnership, not isolation.",
            "You shine brightest when you're collaborating, not competing.",
            "Self-discovery happens in the space between you and them.",
            "Your presence amplifies when you're in one-on-one connection.",
            "You become who you are through the mirror of relationship.",
            "Identity crystallizes in the dance of give and take.",
            "You are most yourself when you're seen by someone who matters."
        ],
        '8th': [
            "Your identity is forged in the fires of transformation.",
            "You shine through what you survive, not what you avoid.",
            "Death and rebirth are your native languages.",
            "Your presence carries the weight of everything you've overcome.",
            "You define yourself through what you've let go of.",
            "Identity deepens in the shadows, not the spotlight.",
            "You become who you are through total surrender to change.",
            "Your power is written in what you've transformed."
        ],
        '9th': [
            "Your identity expands through every horizon you chase.",
            "You shine brightest when you're teaching what you've learned.",
            "Truth-seeking isn't a hobby—it's your life's work.",
            "You define yourself through the philosophies you live by.",
            "Your presence grows with every adventure you take.",
            "Identity crystallizes in the spaces between cultures and beliefs.",
            "You become who you are by outrunning your own limits.",
            "Your purpose is written in the questions you refuse to stop asking."
        ],
        '10th': [
            "Your identity is your public reputation, and you know it.",
            "You shine through what you achieve, not what you feel.",
            "Career isn't a job—it's who you become in the world.",
            "You define yourself through what you build that lasts.",
            "Your presence commands respect because you've earned it.",
            "Identity solidifies in the public eye, not private spaces.",
            "You become who you are through consistent, visible achievement.",
            "Your legacy is written in every goal you reach."
        ],
        '11th': [
            "Your identity is written in the communities you build.",
            "You shine through the networks you create, not the ones you inherit.",
            "Friendship isn't casual—it's how you discover who you are.",
            "You define yourself through the causes you champion.",
            "Your presence amplifies in groups that share your vision.",
            "Identity crystallizes in the spaces between you and your tribe.",
            "You become who you are through collective dreams.",
            "Your purpose is written in the futures you help others build."
        ],
        '12th': [
            "Your identity dissolves into something larger than yourself.",
            "You shine through what you surrender, not what you control.",
            "Spirituality isn't abstract—it's your native language.",
            "You define yourself through what you can't explain.",
            "Your presence carries the weight of collective dreams.",
            "Identity blurs in the best way possible.",
            "You become who you are by letting go of who you thought you were.",
            "Your power is written in the spaces between waking and dreaming."
        ]
    },
    'Moon': {
        '1st': [
            "Your emotions are the first thing people notice about you.",
            "You feel everything before you think anything.",
            "Your moods paint your face like weather.",
            "Emotional transparency isn't a choice—it's your default.",
            "You wear your heart on your sleeve because you can't hide it.",
            "Your presence is colored by whatever you're feeling right now.",
            "People read your emotions before they read your words.",
            "You shine through your vulnerability, not despite it."
        ],
        '2nd': [
            "Your emotional security is tied to what you can touch and hold.",
            "You feel safest when you're surrounded by beautiful, tangible things.",
            "Money isn't just money—it's emotional safety made visible.",
            "Your moods stabilize when you're building something real.",
            "You soothe yourself through texture, ritual, and possession.",
            "Emotional comfort lives in what you can count and measure.",
            "You feel most secure when you're accumulating value.",
            "Your heart calms down when your resources are growing."
        ],
        '3rd': [
            "Your feelings show up as thoughts that haven't been verbalized yet.",
            "You process emotion by talking about it until it makes sense.",
            "Emotions become data points and gossip in your hands.",
            "You feel safest when you can explain what you're feeling.",
            "Your moods change as quickly as the conversation topic.",
            "Emotional clarity arrives through words, not silence.",
            "You need to talk it out before you can feel it through.",
            "Feelings become stories before they become feelings."
        ],
        '4th': [
            "Your emotions are rooted in home, family, and where you come from.",
            "You feel everything through the lens of safety and belonging.",
            "Home isn't a place—it's an emotional state you carry.",
            "Your moods are tied to the people who made you feel safe.",
            "You feel most yourself in private spaces with people you trust.",
            "Emotional security lives in the foundation you've built.",
            "Your heart opens widest in the spaces where you're protected.",
            "You shine through your ability to create emotional sanctuary."
        ],
        '5th': [
            "Your emotions are your creative fuel, not your enemy.",
            "You feel most alive when you're expressing yourself creatively.",
            "Emotions become art before they become problems.",
            "You shine through your ability to turn feelings into something beautiful.",
            "Your moods are tied to how freely you can create.",
            "You feel safest when you're playing, not working.",
            "Emotional expression isn't optional—it's your life force.",
            "Your heart opens widest when you're doing what you love."
        ],
        '6th': [
            "Your emotions are tied to how useful you feel.",
            "You feel most stable when you're solving practical problems.",
            "Emotional chaos triggers your need for order and routine.",
            "You soothe yourself through service, not self-care.",
            "Your moods stabilize when you're being productive.",
            "You feel safest when you're improving something.",
            "Emotional security lives in the details you can control.",
            "Your heart calms down when you're making things better."
        ],
        '7th': [
            "You don't feel fully yourself until you are connected to another.",
            "Your emotional well-being is tied to the harmony of your partnerships.",
            "You instinctively mirror the feelings of those around you.",
            "Loneliness is harder for you than for most.",
            "You seek a partner who feels like home.",
            "Your heart opens through one-on-one intimacy.",
            "You are a natural diplomat in emotional conflicts.",
            "You need reassurance and responsiveness to feel safe."
        ],
        '8th': [
            "Your emotions run deeper than most people can handle.",
            "You feel everything through the lens of transformation and intensity.",
            "Emotional intimacy isn't casual—it's your native language.",
            "You shine through your ability to feel what others can't.",
            "Your moods are tied to what you're transforming.",
            "You feel most alive when you're diving into emotional depths.",
            "Emotional security lives in the shadows, not the light.",
            "Your heart opens widest when you're sharing what's hidden."
        ],
        '9th': [
            "Your emotions expand through every adventure you take.",
            "You feel most alive when you're learning something new.",
            "Emotional growth happens through travel, philosophy, and expansion.",
            "You shine through your ability to feel the world, not just your corner.",
            "Your moods are tied to how free you feel to explore.",
            "You feel safest when you're chasing horizons.",
            "Emotional security lives in the questions you're asking.",
            "Your heart opens widest when you're expanding your perspective."
        ],
        '10th': [
            "Your emotions are tied to your public reputation.",
            "You feel most stable when you're achieving something visible.",
            "Emotional security lives in what you've built that lasts.",
            "You shine through your ability to feel and achieve simultaneously.",
            "Your moods are tied to how respected you feel.",
            "You feel safest when you're recognized for your contributions.",
            "Emotional comfort comes from public validation, not private praise.",
            "Your heart calms down when your career is on track."
        ],
        '11th': [
            "Your emotions are tied to the communities you belong to.",
            "You feel most alive when you're part of something larger.",
            "Emotional security lives in the networks you've built.",
            "You shine through your ability to feel collective dreams.",
            "Your moods are tied to how connected you feel to your tribe.",
            "You feel safest when you're surrounded by like-minded people.",
            "Emotional comfort comes from shared vision, not individual achievement.",
            "Your heart opens widest when you're building the future together."
        ],
        '12th': [
            "Your emotions dissolve into something larger than yourself.",
            "You feel everything through the lens of collective unconscious.",
            "Emotional boundaries blur in the most beautiful way.",
            "You shine through your ability to feel what others can't name.",
            "Your moods are tied to spiritual currents, not personal drama.",
            "You feel most alive when you're surrendering to something bigger.",
            "Emotional security lives in the spaces between waking and dreaming.",
            "Your heart opens widest when you're dissolving into compassion."
        ]
    },
    'Mercury': {
        '1st': [
            "Your mind is the first thing people notice about you.",
            "You think out loud because you can't help it.",
            "Your words define you before your actions do.",
            "Communication isn't a skill—it's your identity.",
            "You shine through your ability to articulate what others can't.",
            "Your presence is colored by whatever you're thinking right now.",
            "People read your mind before they read your face.",
            "You are most yourself when you're explaining something."
        ],
        '2nd': [
            "Your thoughts are tied to what you can count and measure.",
            "You think in terms of value, worth, and tangible results.",
            "Communication becomes negotiation in your hands.",
            "You shine through your ability to price things accurately.",
            "Your mind stabilizes when you're building something real.",
            "You think most clearly when you're accumulating resources.",
            "Your words carry weight because they're backed by value.",
            "You communicate best when you're talking about money or resources."
        ],
        '3rd': [
            "Your mind runs a dozen news feeds at once.",
            "You think in parallel universes and still ask for more bandwidth.",
            "Communication isn't a tool—it's your native language.",
            "You shine through your ability to connect ideas others can't see.",
            "Your thoughts change as quickly as the conversation topic.",
            "You think most clearly when you're talking to someone.",
            "Your words are your primary currency.",
            "You communicate best when you're learning something new."
        ],
        '4th': [
            "Your thoughts are rooted in home, family, and where you come from.",
            "You think through the lens of safety and belonging.",
            "Communication becomes emotional weather reports in your hands.",
            "You shine through your ability to remember what matters.",
            "Your mind is tied to the people who made you feel safe.",
            "You think most clearly in private spaces with people you trust.",
            "Your words carry the weight of family history.",
            "You communicate best when you're protecting what you love."
        ],
        '5th': [
            "Your thoughts are your creative fuel, not your enemy.",
            "You think most clearly when you're expressing yourself creatively.",
            "Communication becomes art before it becomes information.",
            "You shine through your ability to turn ideas into something beautiful.",
            "Your mind is tied to how freely you can create.",
            "You think best when you're playing, not working.",
            "Your words carry the weight of creative expression.",
            "You communicate best when you're doing what you love."
        ],
        '6th': [
            "Your thoughts are tied to how useful you feel.",
            "You think most clearly when you're solving practical problems.",
            "Communication becomes service in your hands.",
            "You shine through your ability to explain how things work.",
            "Your mind stabilizes when you're being productive.",
            "You think best when you're improving something.",
            "Your words carry the weight of practical wisdom.",
            "You communicate best when you're making things better."
        ],
        '7th': [
            "Your thoughts are tied to partnership and collaboration.",
            "You think most clearly when you're talking to someone else.",
            "Communication becomes negotiation in your hands.",
            "You shine through your ability to see both sides.",
            "Your mind is tied to how well you can communicate with others.",
            "You think best when you're in dialogue, not monologue.",
            "Your words carry the weight of partnership.",
            "You communicate best when you're building consensus."
        ],
        '8th': [
            "Your thoughts dive deeper than most people can follow.",
            "You think through the lens of transformation and intensity.",
            "Communication becomes interrogation in your hands.",
            "You shine through your ability to see what's hidden.",
            "Your mind is tied to what you're transforming.",
            "You think most clearly when you're diving into depths.",
            "Your words carry the weight of secrets and power.",
            "You communicate best when you're exposing what's hidden."
        ],
        '9th': [
            "Your thoughts expand through every adventure you take.",
            "You think most clearly when you're learning something new.",
            "Communication becomes teaching in your hands.",
            "You shine through your ability to see the big picture.",
            "Your mind is tied to how free you feel to explore.",
            "You think best when you're chasing horizons.",
            "Your words carry the weight of philosophy and truth.",
            "You communicate best when you're expanding perspectives."
        ],
        '10th': [
            "Your thoughts are tied to your public reputation.",
            "You think most clearly when you're achieving something visible.",
            "Communication becomes leadership in your hands.",
            "You shine through your ability to articulate vision.",
            "Your mind is tied to how respected you feel.",
            "You think best when you're building something that lasts.",
            "Your words carry the weight of authority.",
            "You communicate best when you're commanding attention."
        ],
        '11th': [
            "Your thoughts are tied to the communities you belong to.",
            "You think most clearly when you're part of something larger.",
            "Communication becomes networking in your hands.",
            "You shine through your ability to connect people and ideas.",
            "Your mind is tied to how connected you feel to your tribe.",
            "You think best when you're building the future together.",
            "Your words carry the weight of collective dreams.",
            "You communicate best when you're sharing vision."
        ],
        '12th': [
            "Your thoughts dissolve into something larger than yourself.",
            "You think through the lens of collective unconscious.",
            "Communication becomes intuition in your hands.",
            "You shine through your ability to know what can't be explained.",
            "Your mind is tied to spiritual currents, not personal logic.",
            "You think most clearly when you're surrendering to something bigger.",
            "Your words carry the weight of dreams and visions.",
            "You communicate best when you're dissolving boundaries."
        ]
    },
    'Venus': {
        '1st': [
            "Beauty is your calling card, not your mask.",
            "You attract people before you even speak.",
            "Your presence is magnetic because you know your worth.",
            "Charm isn't a skill—it's your identity.",
            "You shine through your ability to make others feel beautiful.",
            "Your appearance is your first language.",
            "People are drawn to you because you're drawn to yourself.",
            "You are most yourself when you're being appreciated."
        ],
        '2nd': [
            "Your values are written in what you can touch and own.",
            "You attract money through beauty, not force.",
            "Love and money flow together in your hands.",
            "You shine through your ability to value what's valuable.",
            "Your worth is tied to what you can accumulate.",
            "You attract resources by honoring your own pricing.",
            "Beauty becomes currency in your hands.",
            "You are most yourself when you're surrounded by beautiful things."
        ],
        '3rd': [
            "Your charm is written in every conversation you start.",
            "You attract people through words, wit, and curiosity.",
            "Love flows through communication, not grand gestures.",
            "You shine through your ability to make others feel heard.",
            "Your values are tied to what you can learn and share.",
            "You attract partners through intellectual connection.",
            "Beauty becomes conversation in your hands.",
            "You are most yourself when you're talking to someone you love."
        ],
        '4th': [
            "Your values are rooted in home, family, and where you come from.",
            "You attract love through creating emotional sanctuary.",
            "Beauty lives in the spaces where you feel safe.",
            "You shine through your ability to make anywhere feel like home.",
            "Your worth is tied to the people who made you feel loved.",
            "You attract partners through emotional security.",
            "Love becomes protection in your hands.",
            "You are most yourself when you're nurturing what you love."
        ],
        '5th': [
            "Your values are written in what you create, not what you consume.",
            "You attract love through play, not work.",
            "Beauty becomes art in your hands.",
            "You shine through your ability to turn love into something beautiful.",
            "Your worth is tied to how freely you can express yourself.",
            "You attract partners through creative expression.",
            "Love becomes joy in your hands.",
            "You are most yourself when you're doing what you love."
        ],
        '6th': [
            "Your values are tied to how useful you feel.",
            "You attract love through service, not seduction.",
            "Beauty becomes efficiency in your hands.",
            "You shine through your ability to make others feel cared for.",
            "Your worth is tied to what you can improve.",
            "You attract partners through practical acts of love.",
            "Love becomes routine in your hands.",
            "You are most yourself when you're making things better."
        ],
        '7th': [
            "Your values are written in partnership, not isolation.",
            "You attract love through balance, not drama.",
            "Beauty becomes harmony in your hands.",
            "You shine through your ability to make others feel beautiful.",
            "Your worth is tied to how well you can partner.",
            "You attract partners through aesthetic chemistry.",
            "Love becomes collaboration in your hands.",
            "You are most yourself when you're in one-on-one connection."
        ],
        '8th': [
            "Your values are forged in the fires of transformation.",
            "You attract love through intensity, not surface charm.",
            "Beauty becomes power in your hands.",
            "You shine through your ability to transform what you touch.",
            "Your worth is tied to what you've survived.",
            "You attract partners through emotional depth.",
            "Love becomes obsession in your hands.",
            "You are most yourself when you're diving into emotional depths."
        ],
        '9th': [
            "Your values expand through every adventure you take.",
            "You attract love through philosophy, not practicality.",
            "Beauty becomes truth in your hands.",
            "You shine through your ability to see beauty in everything.",
            "Your worth is tied to how free you feel to explore.",
            "You attract partners through shared vision.",
            "Love becomes expansion in your hands.",
            "You are most yourself when you're chasing horizons together."
        ],
        '10th': [
            "Your values are tied to your public reputation.",
            "You attract love through achievement, not neediness.",
            "Beauty becomes status in your hands.",
            "You shine through your ability to make success look beautiful.",
            "Your worth is tied to what you've built that lasts.",
            "You attract partners through public recognition.",
            "Love becomes legacy in your hands.",
            "You are most yourself when you're achieving together."
        ],
        '11th': [
            "Your values are written in the communities you belong to.",
            "You attract love through friendship, not romance.",
            "Beauty becomes collective vision in your hands.",
            "You shine through your ability to make others feel included.",
            "Your worth is tied to how connected you feel to your tribe.",
            "You attract partners through shared dreams.",
            "Love becomes community in your hands.",
            "You are most yourself when you're building the future together."
        ],
        '12th': [
            "Your values dissolve into something larger than yourself.",
            "You attract love through compassion, not attachment.",
            "Beauty becomes transcendence in your hands.",
            "You shine through your ability to see beauty in suffering.",
            "Your worth is tied to what you surrender.",
            "You attract partners through spiritual connection.",
            "Love becomes dissolution in your hands.",
            "You are most yourself when you're dissolving boundaries."
        ]
    },
    'Mars': {
        '1st': [
            "Your drive is the first thing people notice about you.",
            "You act before you think because you can't help it.",
            "Your energy defines you before your words do.",
            "Action isn't a choice—it's your identity.",
            "You shine through your ability to move when others hesitate.",
            "Your presence is colored by whatever you're fighting for right now.",
            "People feel your energy before they hear your words.",
            "You are most yourself when you're charging ahead."
        ],
        '2nd': [
            "Your drive is tied to what you can build and accumulate.",
            "You act through steady, tangible progress.",
            "Energy becomes persistence in your hands.",
            "You shine through your ability to outlast everyone else.",
            "Your action stabilizes when you're building something real.",
            "You move most clearly when you're accumulating resources.",
            "Your energy carries weight because it's backed by value.",
            "You act best when you're fighting for what you own."
        ],
        '3rd': [
            "Your drive is written in every conversation you start.",
            "You act through words, wit, and tactical communication.",
            "Energy becomes curiosity in your hands.",
            "You shine through your ability to move minds, not just bodies.",
            "Your action changes as quickly as the conversation topic.",
            "You move most clearly when you're talking to someone.",
            "Your energy is your primary currency.",
            "You act best when you're learning something new."
        ],
        '4th': [
            "Your drive is rooted in home, family, and what you protect.",
            "You act through emotional defense, not offense.",
            "Energy becomes protection in your hands.",
            "You shine through your ability to fight for what you love.",
            "Your action is tied to the people who made you feel safe.",
            "You move most clearly when you're defending your territory.",
            "Your energy carries the weight of family history.",
            "You act best when you're protecting what matters."
        ],
        '5th': [
            "Your drive is written in what you create, not what you destroy.",
            "You act through play, not work.",
            "Energy becomes creativity in your hands.",
            "You shine through your ability to turn action into art.",
            "Your action is tied to how freely you can express yourself.",
            "You move most clearly when you're doing what you love.",
            "Your energy carries the weight of creative expression.",
            "You act best when you're fighting for joy."
        ],
        '6th': [
            "Your drive is tied to how useful you feel.",
            "You act through service, not self-interest.",
            "Energy becomes efficiency in your hands.",
            "You shine through your ability to solve practical problems.",
            "Your action stabilizes when you're being productive.",
            "You move most clearly when you're improving something.",
            "Your energy carries the weight of practical wisdom.",
            "You act best when you're making things better."
        ],
        '7th': [
            "Your drive is written in partnership, not isolation.",
            "You act through collaboration, not competition.",
            "Energy becomes negotiation in your hands.",
            "You shine through your ability to fight for others, not yourself.",
            "Your action is tied to how well you can partner.",
            "You move most clearly when you're in dialogue, not monologue.",
            "Your energy carries the weight of partnership.",
            "You act best when you're building consensus."
        ],
        '8th': [
            "Your drive dives deeper than most people can follow.",
            "You act through transformation, not surface change.",
            "Energy becomes intensity in your hands.",
            "You shine through your ability to transform what you touch.",
            "Your action is tied to what you're destroying to rebuild.",
            "You move most clearly when you're diving into depths.",
            "Your energy carries the weight of secrets and power.",
            "You act best when you're exposing what's hidden."
        ],
        '9th': [
            "Your drive expands through every adventure you take.",
            "You act through philosophy, not practicality.",
            "Energy becomes expansion in your hands.",
            "You shine through your ability to fight for truth.",
            "Your action is tied to how free you feel to explore.",
            "You move most clearly when you're chasing horizons.",
            "Your energy carries the weight of philosophy and truth.",
            "You act best when you're fighting for what you believe."
        ],
        '10th': [
            "Your drive is tied to your public reputation.",
            "You act through achievement, not emotion.",
            "Energy becomes ambition in your hands.",
            "You shine through your ability to build something that lasts.",
            "Your action is tied to how respected you feel.",
            "You move most clearly when you're achieving something visible.",
            "Your energy carries the weight of authority.",
            "You act best when you're commanding attention."
        ],
        '11th': [
            "Your drive is written in the communities you belong to.",
            "You act through collective vision, not individual ambition.",
            "Energy becomes networking in your hands.",
            "You shine through your ability to fight for the future.",
            "Your action is tied to how connected you feel to your tribe.",
            "You move most clearly when you're building the future together.",
            "Your energy carries the weight of collective dreams.",
            "You act best when you're fighting for what's next."
        ],
        '12th': [
            "Your drive dissolves into something larger than yourself.",
            "You act through surrender, not force.",
            "Energy becomes compassion in your hands.",
            "You shine through your ability to fight for the unseen.",
            "Your action is tied to spiritual currents, not personal drama.",
            "You move most clearly when you're surrendering to something bigger.",
            "Your energy carries the weight of dreams and visions.",
            "You act best when you're dissolving boundaries."
        ]
    },
    'Jupiter': {
        '1st': [
            "Your optimism is the first thing people notice about you.",
            "You expand before you contract because you can't help it.",
            "Your luck defines you before your effort does.",
            "Growth isn't a choice—it's your identity.",
            "You shine through your ability to see opportunity when others see obstacles.",
            "Your presence is colored by whatever you're expanding into right now.",
            "People feel your optimism before they hear your words.",
            "You are most yourself when you're growing."
        ],
        '2nd': [
            "Your expansion is tied to what you can build and accumulate.",
            "You grow through steady, tangible progress.",
            "Luck becomes persistence in your hands.",
            "You shine through your ability to multiply what you touch.",
            "Your growth stabilizes when you're building something real.",
            "You expand most clearly when you're accumulating resources.",
            "Your luck carries weight because it's backed by value.",
            "You grow best when you're investing in what matters."
        ],
        '3rd': [
            "Your expansion is written in every conversation you start.",
            "You grow through words, ideas, and relentless curiosity.",
            "Luck becomes learning in your hands.",
            "You shine through your ability to expand minds, not just resources.",
            "Your growth changes as quickly as the conversation topic.",
            "You expand most clearly when you're talking to someone.",
            "Your luck is your primary currency.",
            "You grow best when you're learning something new."
        ],
        '4th': [
            "Your expansion is rooted in home, family, and where you come from.",
            "You grow through emotional security, not material wealth.",
            "Luck becomes protection in your hands.",
            "You shine through your ability to expand what you protect.",
            "Your growth is tied to the people who made you feel safe.",
            "You expand most clearly when you're building your foundation.",
            "Your luck carries the weight of family history.",
            "You grow best when you're nurturing what you love."
        ],
        '5th': [
            "Your expansion is written in what you create, not what you consume.",
            "You grow through play, not work.",
            "Luck becomes creativity in your hands.",
            "You shine through your ability to turn growth into art.",
            "Your growth is tied to how freely you can express yourself.",
            "You expand most clearly when you're doing what you love.",
            "Your luck carries the weight of creative expression.",
            "You grow best when you're expanding through joy."
        ],
        '6th': [
            "Your expansion is tied to how useful you feel.",
            "You grow through service, not self-interest.",
            "Luck becomes efficiency in your hands.",
            "You shine through your ability to expand what you improve.",
            "Your growth stabilizes when you're being productive.",
            "You expand most clearly when you're making things better.",
            "Your luck carries the weight of practical wisdom.",
            "You grow best when you're expanding through service."
        ],
        '7th': [
            "Your expansion is written in partnership, not isolation.",
            "You grow through collaboration, not competition.",
            "Luck becomes harmony in your hands.",
            "You shine through your ability to expand what you share.",
            "Your growth is tied to how well you can partner.",
            "You expand most clearly when you're in dialogue, not monologue.",
            "Your luck carries the weight of partnership.",
            "You grow best when you're expanding together."
        ],
        '8th': [
            "Your expansion dives deeper than most people can follow.",
            "You grow through transformation, not surface change.",
            "Luck becomes intensity in your hands.",
            "You shine through your ability to expand what you transform.",
            "Your growth is tied to what you're destroying to rebuild.",
            "You expand most clearly when you're diving into depths.",
            "Your luck carries the weight of secrets and power.",
            "You grow best when you're expanding through transformation."
        ],
        '9th': [
            "Your expansion grows through every adventure you take.",
            "You grow through philosophy, not practicality.",
            "Luck becomes truth in your hands.",
            "You shine through your ability to expand what you believe.",
            "Your growth is tied to how free you feel to explore.",
            "You expand most clearly when you're chasing horizons.",
            "Your luck carries the weight of philosophy and truth.",
            "You grow best when you're expanding through adventure."
        ],
        '10th': [
            "Your expansion is tied to your public reputation.",
            "You grow through achievement, not emotion.",
            "Luck becomes legacy in your hands.",
            "You shine through your ability to expand what you build.",
            "Your growth is tied to how respected you feel.",
            "You expand most clearly when you're achieving something visible.",
            "Your luck carries the weight of authority.",
            "You grow best when you're expanding through achievement."
        ],
        '11th': [
            "Your expansion is written in the communities you belong to.",
            "You grow through collective vision, not individual ambition.",
            "Luck becomes networking in your hands.",
            "You shine through your ability to expand what you share.",
            "Your growth is tied to how connected you feel to your tribe.",
            "You expand most clearly when you're building the future together.",
            "Your luck carries the weight of collective dreams.",
            "You grow best when you're expanding through community."
        ],
        '12th': [
            "Your expansion dissolves into something larger than yourself.",
            "You grow through surrender, not force.",
            "Luck becomes compassion in your hands.",
            "You shine through your ability to expand what you surrender.",
            "Your growth is tied to spiritual currents, not personal drama.",
            "You expand most clearly when you're surrendering to something bigger.",
            "Your luck carries the weight of dreams and visions.",
            "You grow best when you're expanding through dissolution."
        ]
    },
    'Saturn': {
        '1st': [
            "Your discipline is the first thing people notice about you.",
            "You structure before you expand because you can't help it.",
            "Your authority defines you before your words do.",
            "Responsibility isn't a choice—it's your identity.",
            "You shine through your ability to build when others break.",
            "Your presence is colored by whatever you're building right now.",
            "People feel your authority before they hear your words.",
            "You are most yourself when you're creating structure."
        ],
        '2nd': [
            "Your discipline is tied to what you can build and accumulate.",
            "You structure through steady, tangible progress.",
            "Authority becomes persistence in your hands.",
            "You shine through your ability to build what lasts.",
            "Your structure stabilizes when you're building something real.",
            "You structure most clearly when you're accumulating resources.",
            "Your authority carries weight because it's backed by value.",
            "You structure best when you're investing in what matters."
        ],
        '3rd': [
            "Your discipline is written in every conversation you start.",
            "You structure through words, ideas, and systematic thinking.",
            "Authority becomes precision in your hands.",
            "You shine through your ability to structure minds, not just resources.",
            "Your structure changes as methodically as you think.",
            "You structure most clearly when you're talking to someone.",
            "Your authority is your primary currency.",
            "You structure best when you're teaching something new."
        ],
        '4th': [
            "Your discipline is rooted in home, family, and where you come from.",
            "You structure through emotional security, not material wealth.",
            "Authority becomes protection in your hands.",
            "You shine through your ability to build foundations that last.",
            "Your structure is tied to the people who made you feel safe.",
            "You structure most clearly when you're building your foundation.",
            "Your authority carries the weight of family history.",
            "You structure best when you're protecting what you love."
        ],
        '5th': [
            "Your discipline is written in what you create, not what you consume.",
            "You structure through play, not work.",
            "Authority becomes creativity in your hands.",
            "You shine through your ability to turn structure into art.",
            "Your structure is tied to how freely you can express yourself.",
            "You structure most clearly when you're doing what you love.",
            "Your authority carries the weight of creative expression.",
            "You structure best when you're building through joy."
        ],
        '6th': [
            "Your discipline is tied to how useful you feel.",
            "You structure through service, not self-interest.",
            "Authority becomes efficiency in your hands.",
            "You shine through your ability to structure what you improve.",
            "Your structure stabilizes when you're being productive.",
            "You structure most clearly when you're making things better.",
            "Your authority carries the weight of practical wisdom.",
            "You structure best when you're building through service."
        ],
        '7th': [
            "Your discipline is written in partnership, not isolation.",
            "You structure through collaboration, not competition.",
            "Authority becomes contracts in your hands.",
            "You shine through your ability to structure what you share.",
            "Your structure is tied to how well you can partner.",
            "You structure most clearly when you're in dialogue, not monologue.",
            "Your authority carries the weight of partnership.",
            "You structure best when you're building together."
        ],
        '8th': [
            "Your discipline dives deeper than most people can follow.",
            "You structure through transformation, not surface change.",
            "Authority becomes power in your hands.",
            "You shine through your ability to structure what you transform.",
            "Your structure is tied to what you're destroying to rebuild.",
            "You structure most clearly when you're diving into depths.",
            "Your authority carries the weight of secrets and power.",
            "You structure best when you're building through transformation."
        ],
        '9th': [
            "Your discipline expands through every adventure you take.",
            "You structure through philosophy, not practicality.",
            "Authority becomes truth in your hands.",
            "You shine through your ability to structure what you believe.",
            "Your structure is tied to how free you feel to explore.",
            "You structure most clearly when you're chasing horizons.",
            "Your authority carries the weight of philosophy and truth.",
            "You structure best when you're building through adventure."
        ],
        '10th': [
            "Your discipline is tied to your public reputation.",
            "You structure through achievement, not emotion.",
            "Authority becomes legacy in your hands.",
            "You shine through your ability to structure what you build.",
            "Your structure is tied to how respected you feel.",
            "You structure most clearly when you're achieving something visible.",
            "Your authority carries the weight of public recognition.",
            "You structure best when you're building through achievement."
        ],
        '11th': [
            "Your discipline is written in the communities you belong to.",
            "You structure through collective vision, not individual ambition.",
            "Authority becomes networking in your hands.",
            "You shine through your ability to structure what you share.",
            "Your structure is tied to how connected you feel to your tribe.",
            "You structure most clearly when you're building the future together.",
            "Your authority carries the weight of collective dreams.",
            "You structure best when you're building through community."
        ],
        '12th': [
            "Your discipline dissolves into something larger than yourself.",
            "You structure through surrender, not force.",
            "Authority becomes compassion in your hands.",
            "You shine through your ability to structure what you surrender.",
            "Your structure is tied to spiritual currents, not personal drama.",
            "You structure most clearly when you're surrendering to something bigger.",
            "Your authority carries the weight of dreams and visions.",
            "You structure best when you're building through dissolution."
        ]
    },
    'Uranus': {
        '1st': [
            "Your innovation is the first thing people notice about you.",
            "You disrupt before you conform because you can't help it.",
            "Your originality defines you before your words do.",
            "Freedom isn't a choice—it's your identity.",
            "You shine through your ability to break rules when others follow them.",
            "Your presence is colored by whatever you're revolutionizing right now.",
            "People feel your electricity before they hear your words.",
            "You are most yourself when you're breaking free."
        ],
        '2nd': [
            "Your innovation is tied to what you can build and accumulate.",
            "You disrupt through steady, unexpected progress.",
            "Originality becomes value in your hands.",
            "You shine through your ability to revolutionize what you touch.",
            "Your disruption stabilizes when you're building something real.",
            "You innovate most clearly when you're accumulating resources.",
            "Your originality carries weight because it's backed by value.",
            "You disrupt best when you're investing in what's next."
        ],
        '3rd': [
            "Your innovation is written in every conversation you start.",
            "You disrupt through words, ideas, and revolutionary thinking.",
            "Originality becomes communication in your hands.",
            "You shine through your ability to revolutionize minds, not just resources.",
            "Your disruption changes as quickly as the conversation topic.",
            "You innovate most clearly when you're talking to someone.",
            "Your originality is your primary currency.",
            "You disrupt best when you're learning something new."
        ],
        '4th': [
            "Your innovation is rooted in home, family, and where you come from.",
            "You disrupt through emotional security, not material wealth.",
            "Originality becomes protection in your hands.",
            "You shine through your ability to revolutionize what you protect.",
            "Your disruption is tied to the people who made you feel free.",
            "You innovate most clearly when you're building your foundation.",
            "Your originality carries the weight of family history.",
            "You disrupt best when you're protecting what you love."
        ],
        '5th': [
            "Your innovation is written in what you create, not what you consume.",
            "You disrupt through play, not work.",
            "Originality becomes creativity in your hands.",
            "You shine through your ability to turn disruption into art.",
            "Your disruption is tied to how freely you can express yourself.",
            "You innovate most clearly when you're doing what you love.",
            "Your originality carries the weight of creative expression.",
            "You disrupt best when you're revolutionizing through joy."
        ],
        '6th': [
            "Your innovation is tied to how useful you feel.",
            "You disrupt through service, not self-interest.",
            "Originality becomes efficiency in your hands.",
            "You shine through your ability to revolutionize what you improve.",
            "Your disruption stabilizes when you're being productive.",
            "You innovate most clearly when you're making things better.",
            "Your originality carries the weight of practical wisdom.",
            "You disrupt best when you're revolutionizing through service."
        ],
        '7th': [
            "Your innovation is written in partnership, not isolation.",
            "You disrupt through collaboration, not competition.",
            "Originality becomes harmony in your hands.",
            "You shine through your ability to revolutionize what you share.",
            "Your disruption is tied to how well you can partner.",
            "You innovate most clearly when you're in dialogue, not monologue.",
            "Your originality carries the weight of partnership.",
            "You disrupt best when you're revolutionizing together."
        ],
        '8th': [
            "Your innovation dives deeper than most people can follow.",
            "You disrupt through transformation, not surface change.",
            "Originality becomes power in your hands.",
            "You shine through your ability to revolutionize what you transform.",
            "Your disruption is tied to what you're destroying to rebuild.",
            "You innovate most clearly when you're diving into depths.",
            "Your originality carries the weight of secrets and power.",
            "You disrupt best when you're revolutionizing through transformation."
        ],
        '9th': [
            "Your innovation expands through every adventure you take.",
            "You disrupt through philosophy, not practicality.",
            "Originality becomes truth in your hands.",
            "You shine through your ability to revolutionize what you believe.",
            "Your disruption is tied to how free you feel to explore.",
            "You innovate most clearly when you're chasing horizons.",
            "Your originality carries the weight of philosophy and truth.",
            "You disrupt best when you're revolutionizing through adventure."
        ],
        '10th': [
            "Your innovation is tied to your public reputation.",
            "You disrupt through achievement, not emotion.",
            "Originality becomes legacy in your hands.",
            "You shine through your ability to revolutionize what you build.",
            "Your disruption is tied to how respected you feel.",
            "You innovate most clearly when you're achieving something visible.",
            "Your originality carries the weight of authority.",
            "You disrupt best when you're revolutionizing through achievement."
        ],
        '11th': [
            "Your innovation is written in the communities you belong to.",
            "You disrupt through collective vision, not individual ambition.",
            "Originality becomes networking in your hands.",
            "You shine through your ability to revolutionize what you share.",
            "Your disruption is tied to how connected you feel to your tribe.",
            "You innovate most clearly when you're building the future together.",
            "Your originality carries the weight of collective dreams.",
            "You disrupt best when you're revolutionizing through community."
        ],
        '12th': [
            "Your innovation dissolves into something larger than yourself.",
            "You disrupt through surrender, not force.",
            "Originality becomes compassion in your hands.",
            "You shine through your ability to revolutionize what you surrender.",
            "Your disruption is tied to spiritual currents, not personal drama.",
            "You innovate most clearly when you're surrendering to something bigger.",
            "Your originality carries the weight of dreams and visions.",
            "You disrupt best when you're revolutionizing through dissolution."
        ]
    },
    'Neptune': {
        '1st': [
            "Your dreams are the first thing people notice about you.",
            "You dissolve before you define because you can't help it.",
            "Your intuition defines you before your words do.",
            "Mysticism isn't a choice—it's your identity.",
            "You shine through your ability to see what others can't.",
            "Your presence is colored by whatever you're dreaming right now.",
            "People feel your mystery before they hear your words.",
            "You are most yourself when you're dissolving boundaries."
        ],
        '2nd': [
            "Your dreams are tied to what you can build and accumulate.",
            "You dissolve through steady, intangible progress.",
            "Intuition becomes value in your hands.",
            "You shine through your ability to dream what you touch.",
            "Your dissolution stabilizes when you're building something real.",
            "You dream most clearly when you're accumulating resources.",
            "Your intuition carries weight because it's backed by value.",
            "You dissolve best when you're investing in what matters."
        ],
        '3rd': [
            "Your dreams are written in every conversation you start.",
            "You dissolve through words, ideas, and intuitive communication.",
            "Intuition becomes learning in your hands.",
            "You shine through your ability to dream minds, not just resources.",
            "Your dissolution changes as quickly as the conversation topic.",
            "You dream most clearly when you're talking to someone.",
            "Your intuition is your primary currency.",
            "You dissolve best when you're learning something new."
        ],
        '4th': [
            "Your dreams are rooted in home, family, and where you come from.",
            "You dissolve through emotional security, not material wealth.",
            "Intuition becomes protection in your hands.",
            "You shine through your ability to dream what you protect.",
            "Your dissolution is tied to the people who made you feel safe.",
            "You dream most clearly when you're building your foundation.",
            "Your intuition carries the weight of family history.",
            "You dissolve best when you're protecting what you love."
        ],
        '5th': [
            "Your dreams are written in what you create, not what you consume.",
            "You dissolve through play, not work.",
            "Intuition becomes creativity in your hands.",
            "You shine through your ability to turn dreams into art.",
            "Your dissolution is tied to how freely you can express yourself.",
            "You dream most clearly when you're doing what you love.",
            "Your intuition carries the weight of creative expression.",
            "You dissolve best when you're dreaming through joy."
        ],
        '6th': [
            "Your dreams are tied to how useful you feel.",
            "You dissolve through service, not self-interest.",
            "Intuition becomes efficiency in your hands.",
            "You shine through your ability to dream what you improve.",
            "Your dissolution stabilizes when you're being productive.",
            "You dream most clearly when you're making things better.",
            "Your intuition carries the weight of practical wisdom.",
            "You dissolve best when you're dreaming through service."
        ],
        '7th': [
            "Your dreams are written in partnership, not isolation.",
            "You dissolve through collaboration, not competition.",
            "Intuition becomes harmony in your hands.",
            "You shine through your ability to dream what you share.",
            "Your dissolution is tied to how well you can partner.",
            "You dream most clearly when you're in dialogue, not monologue.",
            "Your intuition carries the weight of partnership.",
            "You dissolve best when you're dreaming together."
        ],
        '8th': [
            "Your dreams dive deeper than most people can follow.",
            "You dissolve through transformation, not surface change.",
            "Intuition becomes power in your hands.",
            "You shine through your ability to dream what you transform.",
            "Your dissolution is tied to what you're destroying to rebuild.",
            "You dream most clearly when you're diving into depths.",
            "Your intuition carries the weight of secrets and power.",
            "You dissolve best when you're dreaming through transformation."
        ],
        '9th': [
            "Your dreams expand through every adventure you take.",
            "You dissolve through philosophy, not practicality.",
            "Intuition becomes truth in your hands.",
            "You shine through your ability to dream what you believe.",
            "Your dissolution is tied to how free you feel to explore.",
            "You dream most clearly when you're chasing horizons.",
            "Your intuition carries the weight of philosophy and truth.",
            "You dissolve best when you're dreaming through adventure."
        ],
        '10th': [
            "Your dreams are tied to your public reputation.",
            "You dissolve through achievement, not emotion.",
            "Intuition becomes legacy in your hands.",
            "You shine through your ability to dream what you build.",
            "Your dissolution is tied to how respected you feel.",
            "You dream most clearly when you're achieving something visible.",
            "Your intuition carries the weight of authority.",
            "You dissolve best when you're dreaming through achievement."
        ],
        '11th': [
            "Your dreams are written in the communities you belong to.",
            "You dissolve through collective vision, not individual ambition.",
            "Intuition becomes networking in your hands.",
            "You shine through your ability to dream what you share.",
            "Your dissolution is tied to how connected you feel to your tribe.",
            "You dream most clearly when you're building the future together.",
            "Your intuition carries the weight of collective dreams.",
            "You dissolve best when you're dreaming through community."
        ],
        '12th': [
            "Your dreams dissolve into something larger than yourself.",
            "You dissolve through surrender, not force.",
            "Intuition becomes compassion in your hands.",
            "You shine through your ability to dream what you surrender.",
            "Your dissolution is tied to spiritual currents, not personal drama.",
            "You dream most clearly when you're surrendering to something bigger.",
            "Your intuition carries the weight of dreams and visions.",
            "You dissolve best when you're dreaming through dissolution."
        ]
    },
    'Pluto': {
        '1st': [
            "Your transformation is the first thing people notice about you.",
            "You regenerate before you break because you can't help it.",
            "Your power defines you before your words do.",
            "Intensity isn't a choice—it's your identity.",
            "You shine through your ability to transform when others break.",
            "Your presence is colored by whatever you're transforming right now.",
            "People feel your intensity before they hear your words.",
            "You are most yourself when you're regenerating."
        ],
        '2nd': [
            "Your transformation is tied to what you can build and accumulate.",
            "You regenerate through steady, powerful progress.",
            "Intensity becomes value in your hands.",
            "You shine through your ability to transform what you touch.",
            "Your regeneration stabilizes when you're building something real.",
            "You transform most clearly when you're accumulating resources.",
            "Your intensity carries weight because it's backed by value.",
            "You regenerate best when you're investing in what matters."
        ],
        '3rd': [
            "Your transformation is written in every conversation you start.",
            "You regenerate through words, ideas, and powerful communication.",
            "Intensity becomes learning in your hands.",
            "You shine through your ability to transform minds, not just resources.",
            "Your regeneration changes as intensely as you think.",
            "You transform most clearly when you're talking to someone.",
            "Your intensity is your primary currency.",
            "You regenerate best when you're learning something new."
        ],
        '4th': [
            "Your transformation is rooted in home, family, and where you come from.",
            "You regenerate through emotional security, not material wealth.",
            "Intensity becomes protection in your hands.",
            "You shine through your ability to transform what you protect.",
            "Your regeneration is tied to the people who made you feel powerful.",
            "You transform most clearly when you're building your foundation.",
            "Your intensity carries the weight of family history.",
            "You regenerate best when you're protecting what you love."
        ],
        '5th': [
            "Your transformation is written in what you create, not what you consume.",
            "You regenerate through play, not work.",
            "Intensity becomes creativity in your hands.",
            "You shine through your ability to turn transformation into art.",
            "Your regeneration is tied to how freely you can express yourself.",
            "You transform most clearly when you're doing what you love.",
            "Your intensity carries the weight of creative expression.",
            "You regenerate best when you're transforming through joy."
        ],
        '6th': [
            "Your transformation is tied to how useful you feel.",
            "You regenerate through service, not self-interest.",
            "Intensity becomes efficiency in your hands.",
            "You shine through your ability to transform what you improve.",
            "Your regeneration stabilizes when you're being productive.",
            "You transform most clearly when you're making things better.",
            "Your intensity carries the weight of practical wisdom.",
            "You regenerate best when you're transforming through service."
        ],
        '7th': [
            "Your transformation is written in partnership, not isolation.",
            "You regenerate through collaboration, not competition.",
            "Intensity becomes power in your hands.",
            "You shine through your ability to transform what you share.",
            "Your regeneration is tied to how well you can partner.",
            "You transform most clearly when you're in dialogue, not monologue.",
            "Your intensity carries the weight of partnership.",
            "You regenerate best when you're transforming together."
        ],
        '8th': [
            "Your transformation dives deeper than most people can follow.",
            "You regenerate through transformation, not surface change.",
            "Intensity becomes power in your hands.",
            "You shine through your ability to transform what you transform.",
            "Your regeneration is tied to what you're destroying to rebuild.",
            "You transform most clearly when you're diving into depths.",
            "Your intensity carries the weight of secrets and power.",
            "You regenerate best when you're transforming through transformation."
        ],
        '9th': [
            "Your transformation expands through every adventure you take.",
            "You regenerate through philosophy, not practicality.",
            "Intensity becomes truth in your hands.",
            "You shine through your ability to transform what you believe.",
            "Your regeneration is tied to how free you feel to explore.",
            "You transform most clearly when you're chasing horizons.",
            "Your intensity carries the weight of philosophy and truth.",
            "You regenerate best when you're transforming through adventure."
        ],
        '10th': [
            "Your transformation is tied to your public reputation.",
            "You regenerate through achievement, not emotion.",
            "Intensity becomes legacy in your hands.",
            "You shine through your ability to transform what you build.",
            "Your regeneration is tied to how respected you feel.",
            "You transform most clearly when you're achieving something visible.",
            "Your intensity carries the weight of authority.",
            "You regenerate best when you're transforming through achievement."
        ],
        '11th': [
            "Your transformation is written in the communities you belong to.",
            "You regenerate through collective vision, not individual ambition.",
            "Intensity becomes networking in your hands.",
            "You shine through your ability to transform what you share.",
            "Your regeneration is tied to how connected you feel to your tribe.",
            "You transform most clearly when you're building the future together.",
            "Your intensity carries the weight of collective dreams.",
            "You regenerate best when you're transforming through community."
        ],
        '12th': [
            "Your transformation dissolves into something larger than yourself.",
            "You regenerate through surrender, not force.",
            "Intensity becomes compassion in your hands.",
            "You shine through your ability to transform what you surrender.",
            "Your regeneration is tied to spiritual currents, not personal drama.",
            "You transform most clearly when you're surrendering to something bigger.",
            "Your intensity carries the weight of dreams and visions.",
            "You regenerate best when you're transforming through dissolution."
        ]
    }
};

// Generate the complete houses.json file
function generateHouses() {
    const houses = {
        meta: {
            type: "houses",
            description: "Atoms for Planets in Houses"
        },
        atoms: {}
    };

    for (const planet of PLANETS) {
        for (const house of HOUSES) {
            const key = `${planet}_${house}`;
            const domain = HOUSE_DOMAINS[house];
            
            if (HOUSE_ATOMS[planet] && HOUSE_ATOMS[planet][house]) {
                houses.atoms[key] = {
                    domain: domain,
                    atoms: HOUSE_ATOMS[planet][house]
                };
            } else {
                // Fallback (shouldn't happen, but just in case)
                houses.atoms[key] = {
                    domain: domain,
                    atoms: [
                        `${planet} in the ${house} house expresses through ${domain.toLowerCase()}.`,
                        `Your ${planet.toLowerCase()} energy ${getHouseExpression(house)}.`,
                        `The ${house} house ${planet.toLowerCase()} ${getHousePlanetMeaning(house, planet)}.`,
                        `You ${getPlanetVerb(planet)} through ${domain.toLowerCase()}.`,
                        `${planet} ${house} ${getHousePlanetAction(house, planet)}.`,
                        `Your ${getPlanetFocus(planet)} ${getHouseDomainAction(domain)}.`,
                        `The ${domain} ${planet.toLowerCase()} ${getHousePlanetQuality(house, planet)}.`,
                        `You ${getPlanetVerb(planet)} ${getHouseAction(house)}.`
                    ]
                };
            }
        }
    }

    return houses;
}

// Helper functions (fallback only)
function getHouseExpression(house) {
    return `activates in the ${house} house`;
}

function getHousePlanetMeaning(house, planet) {
    return `expresses ${planet.toLowerCase()} energy`;
}

function getPlanetVerb(planet) {
    const verbs = {
        'Sun': 'shine', 'Moon': 'feel', 'Mercury': 'think',
        'Venus': 'attract', 'Mars': 'act', 'Jupiter': 'expand',
        'Saturn': 'structure', 'Uranus': 'disrupt', 'Neptune': 'dream',
        'Pluto': 'transform'
    };
    return verbs[planet] || 'express';
}

function getHousePlanetAction(house, planet) {
    return `${getPlanetVerb(planet)}s in the ${house} house`;
}

function getPlanetFocus(planet) {
    const focuses = {
        'Sun': 'identity', 'Moon': 'emotions', 'Mercury': 'communication',
        'Venus': 'values', 'Mars': 'action', 'Jupiter': 'expansion',
        'Saturn': 'structure', 'Uranus': 'innovation', 'Neptune': 'intuition',
        'Pluto': 'transformation'
    };
    return focuses[planet] || 'energy';
}

function getHouseDomainAction(domain) {
    return `activates in ${domain.toLowerCase()}`;
}

function getHousePlanetQuality(house, planet) {
    return `${getPlanetVerb(planet)}s in the ${house} house`;
}

function getHouseAction(house) {
    return `in the ${house} house`;
}

// Generate and write
console.log('Generating high-quality house atoms...\n');
const houses = generateHouses();

fs.writeFileSync(
    path.join(__dirname, 'houses.json'),
    JSON.stringify(houses, null, 4)
);

console.log(`✓ Generated ${Object.keys(houses.atoms).length} house combinations`);
console.log(`✓ Total atoms: ${Object.values(houses.atoms).reduce((sum, h) => sum + h.atoms.length, 0)}`);
console.log('\n✅ houses.json regenerated with punchy, vivid atoms!');





