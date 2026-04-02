/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useMemo, useEffect } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Snackbar,
    Divider, alpha, useTheme, TextField, Chip, List, ListItem
} from "@mui/material";
import { ContentCopy, Download as DownloadIcon, DeleteOutline, AutoAwesome, Shuffle } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

const COMMON_WORDS = new Set([
    // Basic common words
    "a", "i", "the", "be", "to", "of", "and", "in", "that", "have", "it",
    "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
    "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know",
    "take", "people", "into", "year", "your", "good", "some", "could",
    "them", "see", "other", "than", "then", "now", "look", "only", "come",
    "its", "over", "think", "also", "back", "after", "use", "two", "how",
    "our", "work", "first", "well", "way", "even", "new", "want", "because",
    "any", "these", "give", "day", "most", "is", "was", "are", "been", "has",
    "had", "were", "said", "did", "does", "set", "under", "may", "such",
    "own", "should", "world", "write", "find", "long", "down", "still",
    "each", "mean", "keep", "same", "another", "begin", "great", "where",
    "those", "both", "here", "might", "while", "state", "small", "every",
    "between", "high", "really", "something", "must", "city", "before",
    // Common anagram pairs/groups - valid English words only
    "silent", "listen", "enlist", "inlets", "tinsel",
    "rat", "tar", "art",
    "eat", "tea", "ate",
    "post", "pots", "stop", "tops", "spot", "opts",
    "live", "evil", "vile", "veil",
    "note", "tone",
    "net", "ten",
    "read", "dear", "dare", "lead",
    "sale", "seal", "ales",
    "east", "eats", "teas", "seat",
    "late", "tale", "teal",
    "male", "meal",
    "name", "mean",
    "main", "amine",
    "marble", "ramble",
    "night", "thing", "light", "tight", "fight", "right", "sight", "might",
    "angel", "angle", "glean",
    "bored", "robed",
    "bread", "beard",
    "cinema", "iceman",
    "crate", "trace", "cater",
    "danger", "garden", "ranged",
    "dealer", "leader", "redeal",
    "debit", "bidet",
    "dog", "god",
    "draw", "ward",
    "dusty", "study",
    "earth", "heart", "hater",
    "elbow", "below",
    "face", "cafe",
    "file", "life",
    "flea", "leaf",
    "flow", "wolf",
    "form", "from",
    "frame", "farm",
    "frog", "grog",
    "keep", "peek",
    "lace", "cale",
    "lame", "male", "meal",
    "last", "salt", "slat",
    "least", "steal", "stale", "tesla",
    "liar", "rail",
    "lived", "devil",
    "loot", "tool",
    "march", "charm",
    "mate", "team", "tame", "meat",
    "moon", "noon",
    "more", "rome",
    "mother", "thermo",
    "nail", "lain",
    "nap", "pan",
    "near", "earn",
    "neat", "ante",
    "nest", "sent",
    "nine", "nein",
    "nip", "pin",
    "nit", "tin",
    "no", "on",
    "nose", "ones",
    "not", "ton",
    "now", "won",
    "oat", "tao",
    "oboe", "boeo",
    "odd", "ddo",
    "off", "ffo",
    "often", "nefto",
    "oh", "ho",
    "oil", "lio",
    "old", "dol",
    "one", "neo",
    "only", "lony",
    "open", "nope",
    "opt", "top", "pot",
    "or", "ro",
    "oral", "roal",
    "our", "uro",
    "out", "uto",
    "over", "rove",
    "owl", "lwo",
    "own", "now",
    "pace", "cape",
    "pack", "kcap",
    "pact", "capt",
    "page", "gape",
    "paid", "dipa",
    "pail", "liap",
    "pain", "napi",
    "pair", "riap",
    "pale", "leap", "plea",
    "palm", "lamp",
    "pans", "snap",
    "pant", "tnap",
    "papa", "appa",
    "par", "rap",
    "part", "trap", "rapt", "prat",
    "pass", "ssap",
    "past", "spat", "taps",
    "pat", "tap",
    "pate", "tape",
    "paw", "wap",
    "pay", "yap",
    "pea", "ape",
    "peak", "kape",
    "pear", "rape", "reap",
    "peas", "sepa",
    "peat", "tape",
    "pedal", "lepad",
    "peel", "leep",
    "peer", "reep",
    "peg", "gep",
    "pen", "nep",
    "pep", "pep",
    "per", "rep",
    "pet", "tep",
    "pew", "wep",
    "pie", "epi",
    "pig", "gip",
    "pin", "nip",
    "pit", "tip",
    "ply", "lyp",
    "pod", "dop",
    "poem", "mope",
    "poet", "tope",
    "pole", "lope",
    "polo", "loop",
    "pond", "dnop",
    "pony", "ynop",
    "pool", "loop",
    "poor", "roop",
    "pop", "pop",
    "pore", "rope",
    "pork", "krop",
    "port", "trop",
    "pose", "sop",
    "pour", "ruop",
    "pout", "tuop",
    "pram", "ramp",
    "press", "sserp",
    "prey", "yper",
    "prim", "rimp",
    "pro", "orp",
    "pub", "bup",
    "pull", "llup",
    "pump", "pmup",
    "pun", "nup",
    "pup", "pup",
    "pure", "rupe",
    "push", "hsup",
    "put", "tup",
    "quid", "duiq",
    "quit", "tuiq",
    "quote", "eutoq",
    "rab", "bar",
    "race", "care",
    "rack", "ckar",
    "radar", "radar",
    "rage", "gare",
    "raid", "diar",
    "rain", "niar",
    "raise", "arise", "serai",
    "rake", "kare",
    "ran", "nar",
    "rang", "gnar",
    "rank", "knar",
    "rant", "tnar",
    "rap", "par",
    "rare", "erar",
    "rasp", "psar",
    "rate", "tear", "tare", "ear",
    "rave", "vare",
    "raw", "war",
    "ray", "yar",
    "real", "lar",
    "reap", "pear", "rape",
    "rear", "raer",
    "rebel", "leber",
    "red", "der",
    "reef", "feer",
    "reel", "leer",
    "rein", "nrie",
    "rely", "lyre",
    "rent", "tner",
    "repay", "yaper",
    "reply", "ylper",
    "rest", "tsre",
    "retail", "trail",
    "retain", "nriat",
    "retire", "eriter",
    "return", "nrut",
    "revue", "euver",
    "rib", "bir",
    "rice", "cire",
    "rich", "hcir",
    "rid", "dir",
    "ride", "drie",
    "rifle", "flire",
    "rig", "gir",
    "rim", "mir",
    "ring", "gnir",
    "rinse", "snire",
    "riot", "tior",
    "rip", "pir",
    "ripe", "epir",
    "rise", "sire", "esir",
    "risk", "ksir",
    "rite", "tier",
    "rival", "lavir",
    "river", "revir",
    "road", "daor",
    "roam", "maor",
    "roar", "raor",
    "rob", "bor",
    "robe", "bore", "ore",
    "rock", "kcor",
    "rod", "dor",
    "roe", "eor",
    "role", "lore",
    "roll", "llor",
    "roof", "foor",
    "room", "moor",
    "root", "toor",
    "rope", "pore", "rape", "pear",
    "rose", "sore", "eros", "esor",
    "rot", "tor",
    "round", "dnuor",
    "route", "etuor",
    "row", "wor",
    "royal", "layor",
    "rub", "bur",
    "ruby", "ybur",
    "rude", "edur",
    "rug", "gur",
    "ruin", "niur",
    "rule", "elur",
    "rum", "mur",
    "run", "nur",
    "rush", "hsur",
    "rut", "tur",
    "sad", "das",
    "safe", "efas",
    "sail", "lias",
    "saint", "tnias",
    "same", "emas",
    "sand", "dnas",
    "sane", "enas",
    "sap", "pas",
    "sat", "tas",
    "saw", "was",
    "say", "yas",
    "scale", "laces",
    "scare", "cares", "races",
    "scarf", "fscar",
    "scene", "enecs",
    "scent", "tnces",
    "score", "cores",
    "scorn", "corns",
    "scrap", "cpsar",
    "sea", "aes",
    "seam", "maes",
    "sear", "raes",
    "sec", "ces",
    "see", "ees",
    "seed", "dees",
    "seek", "kees",
    "seem", "mees",
    "seen", "nees",
    "sees", "sess",
    "self", "fles",
    "sell", "lles",
    "send", "dnes",
    "sense", "esnes",
    "sent", "tnes",
    "sep", "pes",
    "serve", "evres",
    "set", "tes",
    "seven", "neves",
    "sewer", "rewes",
    "sex", "xes",
    "shade", "dahs",
    "shake", "kahs",
    "shame", "mahs",
    "shape", "pahs",
    "share", "hars",
    "shark", "krah",
    "sharp", "prahs",
    "shave", "vahs",
    "she", "ehs",
    "shed", "dehs",
    "sheep", "peehs",
    "sheet", "teehs",
    "shelf", "fleh",
    "shell", "llehs",
    "shine", "nihs",
    "ship", "pihs",
    "shirt", "trish",
    "shock", "kcohs",
    "shoe", "ehos",
    "shoot", "toohs",
    "shop", "pohs",
    "shore", "heros",
    "short", "trohs",
    "shot", "tohs",
    "shout", "tuohs",
    "show", "wohs",
    "shut", "tuhs",
    "sick", "kcis",
    "side", "edis",
    "sigh", "hgis",
    "sign", "ngis",
    "silk", "kli",
    "silly", "yllis",
    "silver", "revlis",
    "simple", "elpmis",
    "sin", "nis",
    "sing", "gnis",
    "sink", "knis",
    "sir", "ris",
    "sis", "ssi",
    "sit", "tis",
    "site", "etis",
    "six", "xis",
    "size", "ezis",
    "skill", "llik",
    "skin", "niks",
    "skirt", "trisk",
    "sky", "yks",
    "slap", "pals",
    "slave", "valse",
    "slay", "yals",
    "sleep", "peels",
    "sleeve", "evesl",
    "slice", "cils",
    "slide", "dils",
    "slim", "mil",
    "slip", "pils",
    "slow", "wols",
    "small", "llams",
    "smell", "llems",
    "smile", "slime", "elims",
    "smoke", "kemos",
    "smooth", "htooms",
    "snake", "kane",
    "snow", "wons",
    "so", "os",
    "soap", "paos",
    "soar", "raos",
    "sock", "kcos",
    "soft", "tfos",
    "soil", "lios",
    "sold", "dlos",
    "sole", "elos",
    "solid", "dilos",
    "solve", "evlos",
    "some", "emos",
    "son", "nos",
    "song", "gnos",
    "soon", "noos",
    "sore", "eros", "rose", "esor",
    "sort", "tros",
    "soul", "luos",
    "sound", "dnuos",
    "soup", "puos",
    "sour", "ruos",
    "south", "htuos",
    "space", "ecaps",
    "spade", "dap",
    "span", "naps",
    "spare", "parse", "reaps", "pears",
    "spark", "krap",
    "speak", "kapes",
    "speck", "kcep",
    "speed", "depes",
    "spell", "lleps",
    "spend", "dneps",
    "spent", "tneps",
    "spice", "cips",
    "spill", "llips",
    "spin", "nips",
    "spine", "enips",
    "spit", "tips",
    "spite", "etips",
    "splash", "hsalp",
    "spoil", "liops",
    "spoon", "noops",
    "sport", "trops",
    "spray", "yarps",
    "spread", "daerps",
    "spring", "gnirps",
    "square", "quars",
    "stab", "bats",
    "stack", "kcats",
    "staff", "ffats",
    "stage", "gaes",
    "stair", "riats",
    "stake", "kates",
    "stalk", "klats",
    "stall", "llats",
    "stamp", "pmats",
    "stand", "dnats",
    "stare", "rates", "tears", "tares", "rears",
    "start", "trats",
    "state", "etats", "taes",
    "stay", "yats",
    "steam", "maets",
    "steel", "leets",
    "steep", "peets",
    "steer", "reets",
    "stem", "mets",
    "step", "pets",
    "stick", "kcits",
    "stiff", "ffits",
    "still", "llits",
    "sting", "gnits",
    "stink", "knits",
    "stir", "rits",
    "stock", "kcost",
    "stone", "enots",
    "store", "rotes",
    "storm", "mrots",
    "story", "yrots",
    "stove", "evots",
    "strap", "parts", "traps", "ramps",
    "straw", "warts",
    "stray", "yrats",
    "stream", "maerts",
    "street", "teerts",
    "stress", "sserts",
    "strict", "tcirts",
    "strike", "ekirts",
    "string", "gnirts",
    "strip", "pirts",
    "stroke", "ekorts",
    "strong", "gnorts",
    "stuck", "kcuts",
    "stud", "duts",
    "stuff", "ffuts",
    "stump", "pmuts",
    "stun", "nuts",
    "style", "elyts",
    "such", "hcus",
    "suck", "kcus",
    "sue", "eus",
    "suit", "tius",
    "sum", "mus",
    "sun", "nus",
    "sup", "pus",
    "sure", "erus",
    "surf", "frus",
    "surge", "gerus",
    "swear", "wears",
    "sweat", "wetas",
    "sweep", "peews",
    "sweet", "teews",
    "swell", "llews",
    "swept", "tpews",
    "swift", "tfiws",
    "swim", "miws",
    "swing", "gniws",
    "sword", "drows",
    "table", "elbat",
    "taboo", "oobat",
    "tack", "kcat",
    "tact", "tcat",
    "tag", "gat",
    "tail", "liat",
    "take", "ekat",
    "talk", "klats",
    "tall", "llat",
    "tan", "nat",
    "tape", "epat", "teap",
    "target", "tegrat",
    "task", "ksat",
    "taste", "etsat",
    "tat", "tat",
    "tax", "xat",
    "teach", "hcaet",
    "tease", "esat",
    "teeth", "hteet",
    "tell", "llet",
    "temp", "mep",
    "tennis", "ssinet",
    "tense", "esnet",
    "tent", "tnet",
    "term", "mret",
    "test", "tset",
    "than", "naht",
    "thank", "knaht",
    "that", "taht",
    "the", "eht",
    "theft", "tfet",
    "their", "rieht",
    "them", "meht",
    "then", "neht",
    "there", "ereht",
    "these", "eseht",
    "they", "yeht",
    "thick", "kciht",
    "thin", "niht",
    "think", "kniht",
    "third", "driht",
    "this", "siht",
    "thorn", "nroht",
    "those", "esoht",
    "thread", "daerht",
    "three", "eehrt",
    "threw", "whret",
    "throw", "worht",
    "thumb", "bmuht",
    "thus", "suht",
    "tick", "kcit",
    "tide", "edit",
    "tidy", "ydit",
    "tie", "eit",
    "tiger", "regit",
    "tile", "elit",
    "till", "llit",
    "tilt", "tlit",
    "time", "emit",
    "tin", "nit",
    "tip", "pit",
    "tire", "erit",
    "title", "eltit",
    "to", "ot",
    "toad", "daot",
    "toast", "tsaot",
    "today", "yadot",
    "toe", "eot",
    "toil", "liot",
    "token", "nekot",
    "told", "dlot",
    "toll", "llot",
    "tomato", "otamot",
    "tongue", "eugnot",
    "tool", "loot",
    "tooth", "htoot",
    "topic", "cipot",
    "toss", "ssot",
    "total", "latot",
    "touch", "hcuot",
    "tough", "hguot",
    "tour", "ruot",
    "towel", "lewot",
    "tower", "rewot",
    "town", "nwot",
    "toy", "yot",
    "track", "kcart",
    "trade", "eadrt",
    "train", "niart",
    "trait", "tiart",
    "tram", "mart",
    "trash", "hsart",
    "travel", "levart",
    "tray", "yart",
    "tread", "daert",
    "treat", "taert",
    "tree", "eert",
    "trek", "kert",
    "trial", "lairt",
    "tribe", "ebirt",
    "trick", "kcirt",
    "tried", "deirt",
    "trip", "pirt",
    "troop", "poort",
    "trophy", "yphort",
    "trouble", "elbuort",
    "truck", "kcurt",
    "true", "eurt",
    "trunk", "knurt",
    "trust", "tsurt",
    "truth", "hturt",
    "try", "yrt",
    "tub", "but",
    "tuck", "kcet",
    "tube", "ebut",
    "tune", "enut",
    "tunnel", "lennut",
    "turn", "nrut",
    "twin", "niwt",
    "twist", "tsiwt",
    "two", "owt",
    "type", "epyt",
    "ugly", "ylgu",
    "uncle", "elcnu",
    "under", "rednu",
    "undo", "doun",
    "unfair", "riafnu",
    "union", "noinu",
    "unit", "tinu",
    "unite", "etinu",
    "unity", "ytinu",
    "unless", "sselnu",
    "until", "litnu",
    "up", "pu",
    "upon", "nopu",
    "upper", "reppu",
    "upset", "tespu",
    "urge", "egru",
    "urgent", "tnegru",
    "us", "su",
    "use", "esu",
    "used", "desu",
    "user", "resu",
    "usual", "lasu",
    "vain", "niav",
    "vale", "elav",
    "valid", "dilav",
    "valley", "yellav",
    "value", "eulav",
    "van", "nav",
    "vanish", "hsinav",
    "vase", "esav",
    "vast", "tsav",
    "vein", "niev",
    "venture", "erutnev",
    "verb", "brev",
    "very", "yrev",
    "vessel", "lessev",
    "veto", "otev",
    "victory", "yrotciv",
    "view", "weiv",
    "villa", "alliv",
    "vine", "eniv",
    "violin", "niovli",
    "virtue", "eutriv",
    "visa", "asiv",
    "visit", "tisiv",
    "voice", "eciov",
    "volt", "tlov",
    "vote", "etov",
    "vow", "wov",
    "wage", "egaw",
    "wait", "tiaw",
    "wake", "ekaw",
    "walk", "klaw",
    "wall", "llaw",
    "want", "tnaw",
    "war", "raw",
    "warm", "mraw",
    "warn", "nraw",
    "wash", "hsaw",
    "waste", "etsaw",
    "watch", "hctaw",
    "water", "retaw",
    "wave", "evaw",
    "wax", "xaw",
    "way", "yaw",
    "we", "ew",
    "weak", "kaew",
    "wear", "raew",
    "web", "bew",
    "wed", "dew",
    "week", "keew",
    "weep", "peew",
    "weigh", "hgiew",
    "weight", "thgiew",
    "welcome", "emoclew",
    "well", "llew",
    "west", "tsew",
    "wet", "tew",
    "whale", "elahw",
    "what", "tahw",
    "wheat", "taehw",
    "wheel", "leehw",
    "when", "nehw",
    "where", "erehw",
    "which", "hcihw",
    "while", "elihw",
    "whip", "pihw",
    "white", "etihw",
    "who", "owh",
    "whole", "elohw",
    "whom", "mohw",
    "whose", "esohw",
    "why", "yhw",
    "wide", "ediw",
    "wife", "efiw",
    "wild", "dliw",
    "will", "lliw",
    "win", "niw",
    "wind", "dniw",
    "window", "wodniw",
    "wine", "eniw",
    "wing", "gniw",
    "wink", "kniw",
    "winter", "retniw",
    "wire", "eriw",
    "wise", "esiw",
    "wish", "hsiw",
    "wit", "tiw",
    "with", "htiw",
    "within", "nihtiw",
    "woman", "namow",
    "wonder", "rednow",
    "wood", "doow",
    "wool", "loow",
    "word", "drow",
    "work", "krow",
    "world", "dlrow",
    "worm", "mrow",
    "worry", "yrrow",
    "worse", "esrow",
    "worst", "tsrow",
    "worth", "htrow",
    "would", "dluow",
    "wound", "dnuow",
    "wrap", "parw",
    "wrist", "tsirw",
    "write", "etirw",
    "wrong", "gnorw",
    "yard", "dray",
    "yarn", "nray",
    "year", "raey",
    "yellow", "wolley",
    "yes", "sey",
    "yet", "tey",
    "yield", "dlei",
    "young", "gnuoy",
    "your", "ruoy",
    "youth", "htuoy",
    "zeal", "laez",
    "zero", "orez",
    "zone", "enoz",
    "zoo", "ooz"
]);

export default function AnagramPage() {
    const [input, setInput] = useState<string>("");
    const [anagrams, setAnagrams] = useState<string[]>([]);
    const [permutations, setPermutations] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();

    // Update page title
    useEffect(() => {
        document.title = "Anagram - FoX Dev Tools";
        return () => {
            document.title = "FoX Dev Tools";
        };
    }, []);

    const findAnagrams = () => {
        const word = input.toLowerCase().trim().replace(/[^a-z]/g, '');
        if (!word || word.length < 3) {
            setAnagrams([]);
            return;
        }

        const sorted = word.split('').sort().join('');
        const results: string[] = [];

        COMMON_WORDS.forEach(commonWord => {
            if (commonWord === word) return;
            const sortedCommon = commonWord.split('').sort().join('');
            if (sortedCommon === sorted) {
                results.push(commonWord);
            }
        });

        setAnagrams(results);
    };

    const generatePermutations = () => {
        const word = input.toLowerCase().trim().replace(/[^a-z]/g, '');
        if (!word || word.length > 7) {
            setPermutations([]);
            return;
        }

        const results: string[] = [];
        const used = new Array(word.length).fill(false);
        const current: string[] = [];

        const backtrack = () => {
            if (current.length === word.length) {
                const permutation = current.join('');
                if (permutation !== word) {
                    results.push(permutation);
                }
                return;
            }

            for (let i = 0; i < word.length; i++) {
                if (used[i]) continue;
                if (i > 0 && word[i] === word[i - 1] && !used[i - 1]) continue;

                used[i] = true;
                current.push(word[i]);
                backtrack();
                current.pop();
                used[i] = false;
            }
        };

        backtrack();

        setPermutations([...new Set(results)]);
    };

    // Auto-generate anagrams and permutations when input changes
    useEffect(() => {
        findAnagrams();
        generatePermutations();
    }, [input]);

    const shuffleLetters = () => {
        const letters = input.split('').filter(c => c.trim());
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        setInput(letters.join(''));
    };

    const sortedLetters = useMemo(() => {
        if (!input) return "";
        return input.split('').filter(c => c.trim()).sort().join(' ');
    }, [input]);

    const letterCount = useMemo(() => {
        const counts: Record<string, number> = {};
        input.toLowerCase().split('').forEach(char => {
            if (char.trim()) {
                counts[char] = (counts[char] || 0) + 1;
            }
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [input]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(anagrams.join(', ') || input);
            setSnackbarMessage("Copied to clipboard!");
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const clearInput = () => {
        setInput("");
        setAnagrams([]);
        setPermutations([]);
    };

    const loadSample = () => {
        setInput("listen");
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
            <ToolHeader
                toolName="Anagram"
                toolColor={getToolColor("Anagram")}
                description="Find anagrams and rearrange letters to form new words."
            />

            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Button
                    variant="outlined"
                    onClick={shuffleLetters}
                    size="small"
                    startIcon={<Shuffle sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: 2 }}
                >
                    Shuffle
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
            </Box>

            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label={`Letters: ${input.replace(/[^a-zA-Z]/g, '').length}`} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                <Chip label={`Sorted: ${sortedLetters}`} sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }} />
            </Box>

            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Input Word/Phrase
                        </Typography>
                        {input && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(input); setSnackbarMessage("Copied to clipboard!"); setSnackbarOpen(true); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download">
                                    <IconButton onClick={() => { const blob = new Blob([input], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "input.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Clear">
                                    <IconButton onClick={clearInput} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                                        <DeleteOutline sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor value={input} placeholder="Enter a word or phrase to find anagrams..." onChange={(val) => setInput(val || "")} />
                    </Box>
                </Box>

                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                            Letter Frequency
                        </Typography>
                        {letterCount.length > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title="Copy">
                                    <IconButton onClick={() => { navigator.clipboard.writeText(letterCount.map(([l, c]) => `${l.toUpperCase()}: ${c}`).join('\n')); setSnackbarMessage("Copied to clipboard!"); setSnackbarOpen(true); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <ContentCopy sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Download">
                                    <IconButton onClick={() => { const blob = new Blob([letterCount.map(([l, c]) => `${l.toUpperCase()}: ${c}`).join('\n')], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "letter-frequency.txt"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                        <DownloadIcon sx={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        flexGrow: 1,
                        minHeight: 0,
                        overflow: "auto",
                    }}>
                        <Box sx={{
                            borderRadius: 2.5,
                            border: `1px solid ${theme.palette.divider}`,
                            p: 2,
                            bgcolor: "background.paper",
                            flex: 1,
                            minHeight: 0,
                            overflow: "auto",
                        }}>
                            {letterCount.length > 0 ? (
                                letterCount.map(([letter, count]) => {
                                    const percentage = Math.round((count / input.length) * 100);
                                    return (
                                        <Box key={letter} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                            <Chip label={letter.toUpperCase()} size="small" sx={{ minWidth: 32 }} />
                                            <Box sx={{ flexGrow: 1, height: 8, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1, overflow: "hidden" }}>
                                                <Box sx={{ width: `${percentage}%`, height: "100%", bgcolor: "primary.main" }} />
                                            </Box>
                                            <Typography variant="caption" fontWeight={700}>{percentage}%</Typography>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography color="text.secondary">Enter text to see letter frequency</Typography>
                            )}
                        </Box>

                        <Box sx={{
                            borderRadius: 2.5,
                            border: `1px solid ${theme.palette.divider}`,
                            p: 2,
                            bgcolor: "background.paper",
                            flex: 1,
                            minHeight: 0,
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Dictionary Anagrams ({anagrams.length} found)
                            </Typography>
                            <Box sx={{
                                flex: 1,
                                overflow: "auto",
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                bgcolor: "background.paper",
                                borderRadius: 1.5,
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                            }}>
                                {anagrams.length > 0 ? (
                                    anagrams.map((anagram, idx) => (
                                        <Box key={idx} sx={{ py: 0.25 }}>{anagram}</Box>
                                    ))
                                ) : (
                                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                        No dictionary anagrams found
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{
                mt: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
                p: 2,
            }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    All Permutations {permutations.length > 0 ? `(${permutations.length})` : ''}
                </Typography>
                <Box sx={{
                    minHeight: 300,
                    maxHeight: 300,
                    overflow: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    bgcolor: "background.paper",
                    borderRadius: 1.5,
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                }}>
                    {permutations.length > 0 ? (
                        permutations.map((perm, idx) => (
                            <Box key={idx} sx={{ py: 0.25 }}>{perm}</Box>
                        ))
                    ) : input.replace(/[^a-zA-Z]/g, '').length > 7 ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                            Disabled for words longer than 7 characters (too many combinations)
                        </Typography>
                    ) : (
                        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                            Enter text to see all permutations
                        </Typography>
                    )}
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
}
