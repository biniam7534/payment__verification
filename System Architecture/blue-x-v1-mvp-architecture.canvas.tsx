import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

const pages = [
  ["Profile", "Account, business profile, receiver details, logout"],
  ["Scanner", "Manual entry, QR/receipt scan, loading state, result card"],
  ["Dashboard", "History, totals, provider breakdown, weekly/monthly/yearly analysis"],
];

const backendApps = [
  ["accounts", "Users, login, register, business profile, permissions"],
  ["verification", "Verify request, provider calls, normalized result, saved transaction"],
  ["analytics", "Dashboard summaries, history filters, charts, scan usage"],
];

const apiRows = [
  ["POST /api/accounts/register/", "Create user account", "Mobile Auth/Profile"],
  ["POST /api/accounts/login/", "Login and return token", "Mobile Auth/Profile"],
  ["GET/PUT /api/accounts/profile/", "Read/update business profile", "Profile"],
  ["POST /api/verification/verify/", "Verify and save payment result", "Scanner"],
  ["GET /api/verification/dashboard/summary/", "Return totals and chart data", "Dashboard"],
  ["GET /api/verification/transactions/", "Return payment history", "Dashboard"],
];

const roleRows = [
  ["Dev 1", "Mobile Auth/Profile", "Login, register, profile, token storage"],
  ["Dev 2", "Mobile Scanner", "Manual verification, QR scan, loading, result card"],
  ["Dev 3", "Mobile Dashboard", "History list, summary cards, provider charts"],
  ["Dev 4", "Backend Accounts", "Django accounts app, auth APIs, business profile"],
  ["Dev 5", "Backend Verification", "Provider services, verify endpoint, save result"],
  ["Dev 6", "Backend Data/Analytics", "Dashboard API, scan usage, duplicate handling"],
  ["Dev 7", "QA/DevOps", "Testing, env setup, integration, deployment prep"],
];

function FlowStep({ number, title, detail }: { number: string; title: string; detail: string }) {
  const theme = useHostTheme();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr",
        gap: 10,
        alignItems: "start",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          border: `1px solid ${theme.stroke.secondary}`,
          background: theme.fill.quaternary,
          fontWeight: 700,
        }}
      >
        {number}
      </div>
      <Stack gap={2}>
        <Text weight="semibold">{title}</Text>
        <Text size="small" tone="secondary">
          {detail}
        </Text>
      </Stack>
    </div>
  );
}

function SectionBox({ title, children }: { title: string; children: any }) {
  const theme = useHostTheme();

  return (
    <div
      style={{
        padding: 14,
        border: `1px solid ${theme.stroke.tertiary}`,
        borderRadius: 10,
        background: theme.bg.editor,
      }}
    >
      <H3>{title}</H3>
      {children}
    </div>
  );
}

export default function BlueXV1MvpArchitecture() {
  const theme = useHostTheme();

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1180 }}>
      <Stack gap={10}>
        <Row gap={8} wrap>
          <Pill tone="info" active>
            Blue X
          </Pill>
          <Pill>Payment Verification</Pill>
          <Pill>V1 MVP Blueprint</Pill>
        </Row>
        <H1>Blue X V1 MVP Architecture</H1>
        <Text tone="secondary">
          A mobile-first app where businesses scan or enter payment receipt details,
          the backend verifies through provider APIs, saves the result, and the
          dashboard turns saved transactions into financial history and analysis.
        </Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="3" label="main mobile pages" tone="info" />
        <Stat value="3" label="backend domains" />
        <Stat value="1" label="core verification loop" tone="success" />
        <Stat value="20" label="suggested free scans/month" tone="warning" />
      </Grid>

      <Grid columns="1fr 1fr" gap={18} align="start">
        <Stack gap={14}>
          <H2>Core Flow</H2>
          <FlowStep
            number="1"
            title="User submits receipt details"
            detail="Scanner collects provider, reference or receipt ID, amount, sender, and receiver details."
          />
          <FlowStep
            number="2"
            title="Backend verifies payment"
            detail="Django validates the user/request, calls the provider API, and normalizes the response."
          />
          <FlowStep
            number="3"
            title="Backend saves result"
            detail="VerificationTransaction stores status, amount, provider, sender, and raw provider response."
          />
          <FlowStep
            number="4"
            title="Frontend displays status"
            detail="Mobile app shows verified, pending, failed, or unknown in a clear result card."
          />
          <FlowStep
            number="5"
            title="Dashboard reflects history"
            detail="Dashboard APIs read saved data for totals, provider breakdowns, and time-based analysis."
          />
        </Stack>

        <Card size="lg">
          <CardHeader trailing={<Pill tone="success" size="sm">Rule</Pill>}>
            Source Of Truth
          </CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Text>
                Frontend never decides whether money is real. It only collects
                input, calls backend APIs, waits, and displays the response.
              </Text>
              <Divider />
              <Text>
                Backend owns verification, provider integration, duplicate
                detection, saved history, scan usage, and dashboard data.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Stack gap={12}>
        <H2>MVP Product Surface</H2>
        <Grid columns={3} gap={14}>
          {pages.map(([page, detail]) => (
            <SectionBox key={page} title={page}>
              <Text tone="secondary">{detail}</Text>
            </SectionBox>
          ))}
        </Grid>
      </Stack>

      <Grid columns="0.9fr 1.1fr" gap={18} align="start">
        <Stack gap={12}>
          <H2>Backend Domains</H2>
          {backendApps.map(([name, detail]) => (
            <SectionBox key={name} title={name}>
              <Text tone="secondary">{detail}</Text>
            </SectionBox>
          ))}
        </Stack>

        <Stack gap={12}>
          <H2>API Contract Draft</H2>
          <Table
            headers={["Endpoint", "Purpose", "Consumer"]}
            rows={apiRows}
            striped
          />
        </Stack>
      </Grid>

      <Grid columns="1fr 1fr" gap={18} align="start">
        <Card>
          <CardHeader>Key Database Tables</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Text>
                <Text weight="semibold">User:</Text> login identity and account
                ownership.
              </Text>
              <Text>
                <Text weight="semibold">BusinessProfile:</Text> business name,
                receiver name, receiver account, and default provider.
              </Text>
              <Text>
                <Text weight="semibold">VerificationTransaction:</Text> the main
                transaction table for provider, reference, amount, sender, status,
                raw response, and timestamps.
              </Text>
              <Text>
                <Text weight="semibold">ScanUsage:</Text> monthly scan count and
                free/paid usage limit tracking.
              </Text>
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>V1 Boundaries</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Text>Build manual verification first, then QR/receipt URL scan.</Text>
              <Text>Use one confirmed provider first, then add more providers behind the same backend interface.</Text>
              <Text>Keep phone verification, full billing, staff roles, and advanced OCR out of the first build unless the core loop is already stable.</Text>
              <Text>Handle duplicate receipt/reference IDs before calling V1 complete.</Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Stack gap={12}>
        <H2>Developer Assignment Map</H2>
        <Table
          headers={["Developer", "Area", "Owns"]}
          rows={roleRows}
          striped
        />
      </Stack>

      <Card>
        <CardHeader>Sprint 1 Target</CardHeader>
        <CardBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ borderRight: `1px solid ${theme.stroke.tertiary}`, paddingRight: 12 }}>
              <Text weight="semibold">Mobile</Text>
              <Text size="small" tone="secondary">
                Three-page navigation, auth screens, manual scanner form, loading
                state, result card, dashboard shell.
              </Text>
            </div>
            <div style={{ borderRight: `1px solid ${theme.stroke.tertiary}`, paddingRight: 12 }}>
              <Text weight="semibold">Backend</Text>
              <Text size="small" tone="secondary">
                Django setup, accounts APIs, verification endpoint, mock or real
                provider service, saved transaction model.
              </Text>
            </div>
            <div>
              <Text weight="semibold">Integration</Text>
              <Text size="small" tone="secondary">
                Mobile login works, verification request works, backend saves
                result, dashboard shows saved history.
              </Text>
            </div>
          </div>
        </CardBody>
      </Card>
    </Stack>
  );
}
