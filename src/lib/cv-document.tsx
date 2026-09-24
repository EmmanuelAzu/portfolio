import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatRange, type Profile, type Project, type TimelineEntry } from "./data";

const OLIVE = "#4A5D4E";
const GOLD = "#D4AF37";
const TEXT = "#1F2937";
const MUTED = "#6B7280";

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: TEXT, lineHeight: 1.45 },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: OLIVE },
  headline: { fontSize: 12, marginTop: 2 },
  contact: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6, color: MUTED, fontSize: 9 },
  rule: { height: 1.5, backgroundColor: GOLD, marginVertical: 14 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: OLIVE, letterSpacing: 1.5, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  itemTitle: { fontFamily: "Helvetica-Bold" },
  org: { color: OLIVE },
  date: { color: MUTED, fontSize: 9 },
  body: { marginTop: 2 },
  tags: { color: MUTED, fontSize: 8.5, marginTop: 2 },
  item: { marginBottom: 9 },
  link: { color: OLIVE, textDecoration: "none" },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function Entry({ e }: { e: TimelineEntry }) {
  return (
    <View style={s.item} wrap={false}>
      <View style={s.row}>
        <Text style={s.itemTitle}>{e.title}</Text>
        <Text style={s.date}>{formatRange(e.start_date, e.end_date)}</Text>
      </View>
      <Text style={s.org}>{e.organization}</Text>
      {e.description ? <Text style={s.body}>{e.description}</Text> : null}
      {e.skills_acquired?.length ? <Text style={s.tags}>{e.skills_acquired.join(" · ")}</Text> : null}
    </View>
  );
}

/** Printable CV generated from the same Supabase rows that power the site. */
export function CvDocument({
  profile,
  timeline,
  projects,
}: {
  profile: Profile;
  timeline: TimelineEntry[];
  projects: Project[];
}) {
  const experience = timeline.filter((t) => t.type === "experience");
  const education = timeline.filter((t) => t.type === "education");
  const awards = timeline.filter((t) => t.type === "award");
  const skills = Object.entries(profile.skills).filter(([, v]) => v.length);

  return (
    <Document title={`${profile.full_name} — CV`} author={profile.full_name}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{profile.full_name}</Text>
        <Text style={s.headline}>{profile.headline}</Text>
        <View style={s.contact}>
          {profile.location ? <Text>{profile.location}</Text> : null}
          {profile.email ? <Text>{profile.email}</Text> : null}
          {Object.values(profile.links).map((url) => (
            <Link key={url} src={url} style={s.link}>
              {url.replace(/^https?:\/\//, "")}
            </Link>
          ))}
        </View>
        <View style={s.rule} />

        {profile.bio ? (
          <Section title="Profile">
            <Text>{profile.bio}</Text>
          </Section>
        ) : null}
        {experience.length ? (
          <Section title="Experience">
            {experience.map((e) => (
              <Entry key={e.id} e={e} />
            ))}
          </Section>
        ) : null}
        {projects.length ? (
          <Section title="Selected projects">
            {projects.map((p) => (
              <View key={p.id} style={s.item} wrap={false}>
                <View style={s.row}>
                  <Text style={s.itemTitle}>{p.title}</Text>
                  <Text style={s.date}>{p.category}</Text>
                </View>
                <Text style={s.body}>{p.short_description}</Text>
                {p.tech_stack?.length ? <Text style={s.tags}>{p.tech_stack.join(" · ")}</Text> : null}
              </View>
            ))}
          </Section>
        ) : null}
        {education.length ? (
          <Section title="Education">
            {education.map((e) => (
              <Entry key={e.id} e={e} />
            ))}
          </Section>
        ) : null}
        {awards.length ? (
          <Section title="Awards">
            {awards.map((e) => (
              <Entry key={e.id} e={e} />
            ))}
          </Section>
        ) : null}
        {skills.length ? (
          <Section title="Skills">
            {skills.map(([group, list]) => (
              <Text key={group} style={{ marginBottom: 3 }}>
                <Text style={s.itemTitle}>{group}: </Text>
                {list.join(", ")}
              </Text>
            ))}
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}
