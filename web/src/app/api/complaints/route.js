import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const {
      student_id,
      branch,
      category,
      subject,
      description,
      attachment_url,
    } = await request.json();

    // Calculate escalation deadline: 3 days from now
    const escalation_deadline = new Date();
    escalation_deadline.setDate(escalation_deadline.getDate() + 3);

    const [complaint] = await sql`
      INSERT INTO complaints (
        student_id, branch, category, subject, description, attachment_url, status, escalation_deadline
      )
      VALUES (
        ${student_id}, ${branch}, ${category}, ${subject}, ${description}, ${attachment_url}, 'submitted', ${escalation_deadline}
      )
      RETURNING *
    `;

    return Response.json({ complaint });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const userId = searchParams.get("userId");
    const branch = searchParams.get("branch");

    // Auto-escalation logic: Update status to 'escalated' if deadline passed and not resolved
    await sql`
      UPDATE complaints 
      SET status = 'escalated' 
      WHERE status NOT IN ('resolved', 'escalated') 
      AND escalation_deadline < NOW()
    `;

    let query;
    if (role === "student") {
      query = sql`SELECT * FROM complaints WHERE student_id = ${userId} ORDER BY created_at DESC`;
    } else if (role === "hod") {
      query = sql`SELECT * FROM complaints WHERE branch = ${branch} ORDER BY created_at DESC`;
    } else if (role === "principal") {
      query = sql`SELECT * FROM complaints WHERE status = 'escalated' OR is_urgent = true ORDER BY created_at DESC`;
    } else {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    const complaints = await query;
    return Response.json({ complaints });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
