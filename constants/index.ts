import {
  CalendarDays,
  Compass,
  Download,
  NotebookPen,
  Settings,
  TrendingUp,
} from "lucide-react";

export const adhdCommunities = [
  {
    name: "r/ADHD",
    platform: "Reddit",
    href: "https://www.reddit.com/r/ADHD/",
    description:
      "Large peer community for ADHD questions and lived experience.",
  },
  {
    name: "r/ADHDers",
    platform: "Reddit",
    href: "https://www.reddit.com/r/ADHDers/",
    description:
      "Peer-led ADHD discussions with a neurodiversity-friendly tone.",
  },
  {
    name: "r/ADHDWomen",
    platform: "Reddit",
    href: "https://www.reddit.com/r/ADHDWomen/",
    description:
      "Support and discussion for women and gender-diverse ADHD experiences.",
  },
  {
    name: "r/productivity",
    platform: "Reddit",
    href: "https://www.reddit.com/r/productivity/",
    description:
      "Practical systems for planning, focus, routines, and follow-through.",
  },
  {
    name: "ADHD on X",
    platform: "X",
    href: "https://x.com/search?q=ADHD&src=typed_query",
    description:
      "A live search for ADHD discussions, educators, and lived experience.",
  },
  {
    name: "ADHD productivity on X",
    platform: "X",
    href: "https://x.com/search?q=ADHD%20productivity&src=typed_query",
    description:
      "Ideas around focus, planning, task initiation, and work systems.",
  },
  {
    name: "Neurodiversity on X",
    platform: "X",
    href: "https://x.com/search?q=neurodiversity%20ADHD&src=typed_query",
    description:
      "Broader conversations about ADHD, accessibility, and neurodivergence.",
  },
];

export const adhdArticleResources = [
  {
    title: "Attention-Deficit / Hyperactivity Disorder",
    source: "CDC",
    href: "https://www.cdc.gov/adhd/",
    description:
      "Official overview of ADHD symptoms, diagnosis, treatment, and data.",
  },
  {
    title: "Attention-Deficit/Hyperactivity Disorder",
    source: "NIMH",
    href: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd",
    description:
      "Research-backed ADHD information from the National Institute of Mental Health.",
  },
  {
    title: "Adult attention-deficit/hyperactivity disorder",
    source: "Mayo Clinic",
    href: "https://www.mayoclinic.org/diseases-conditions/adult-adhd/symptoms-causes/syc-20350878",
    description:
      "Adult ADHD symptoms, causes, complications, and when to seek care.",
  },
  {
    title: "CHADD ADHD Resources",
    source: "CHADD",
    href: "https://chadd.org/",
    description:
      "Education, support groups, events, and ADHD resources for adults and families.",
  },
  {
    title: "What is ADHD?",
    source: "Understood",
    href: "https://www.understood.org/en/articles/what-is-adhd",
    description:
      "Plain-language ADHD guide covering focus, executive function, and support.",
  },
  {
    title: "Adult ADHD: A Guide to Symptoms, Signs, and Treatments",
    source: "ADDitude",
    href: "https://www.additudemag.com/adhd-in-adults/",
    description:
      "Adult-focused ADHD guide with practical explanations and next steps.",
  },
];

export const moodLevels = [
  { value: "low", dbValue: "LOW", label: "Low", tone: "bg-(--mood-soft)" },
  { value: "meh", dbValue: "MEH", label: "Meh", tone: "bg-(--mood-gold)/35" },
  {
    value: "okay",
    dbValue: "OKAY",
    label: "Okay",
    tone: "bg-(--mood-gold)/60",
  },
  { value: "good", dbValue: "GOOD", label: "Good", tone: "bg-(--mood-gold)" },
  {
    value: "great",
    dbValue: "GREAT",
    label: "Great",
    tone: "bg-(--mood-rose)",
  },
] as const;

export const appLinks = [
  { href: "/", label: "Today", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/insights", label: "Insights", icon: TrendingUp },
  { href: "/explore", label: "Explore", icon: Compass },
];

export const profileItems = [
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/export", label: "Export data", icon: Download },
];

export const marketingLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];
