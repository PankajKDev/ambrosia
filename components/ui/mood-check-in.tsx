import { cn } from "@/lib/utils";

const moods = [
  { label: "Low", tone: "bg-(--mood-soft)" },
  { label: "Meh", tone: "bg-(--mood-soft)" },
  { label: "Okay", tone: "bg-(--mood-soft)" },
  { label: "Good", tone: "bg-(--mood-gold)" },
  { label: "Great", tone: "bg-(--mood-rose)" },
];

function MoodCheckIn() {
  return (
    <fieldset aria-label="Mood check-in">
      <legend className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Mood
      </legend>
      <div className="flex items-center gap-2" aria-hidden="true">
        {moods.map((mood) => (
          <span
            key={mood.label}
            className={cn(
              "h-8 w-8 rounded-full border border-border",
              mood.tone,
            )}
          />
        ))}
      </div>
    </fieldset>
  );
}

export default MoodCheckIn;